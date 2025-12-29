const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

class Translator {
  translate(text, locale) {
    if (text === undefined || text === null || locale === undefined || locale === null) {
      return { error: "Required field(s) missing" };
    }

    if (locale !== "american-to-british" && locale !== "british-to-american") {
      return { error: "Invalid value for locale field" };
    }

    if (text.trim() === "") {
      return { error: "No text to translate" };
    }

    let translatedText = text;
    const highlights = [];

    if (locale === "american-to-british") {
      translatedText = this.translateAmericanToBritish(text, highlights);
    } else {
      translatedText = this.translateBritishToAmerican(text, highlights);
    }

    // If no translation was made, return original text
    if (highlights.length === 0) {
      return {
        text: text,
        translation: "Everything looks good to me!",
      };
    }

    // Build highlighted text by wrapping translated segments
    // Sort highlights by position in translated text (descending) to apply from end to start
    const translatedHighlights = highlights
      .map((highlight) => ({
        start: highlight.translatedStart,
        end: highlight.translatedStart + highlight.replacement.length,
        text: highlight.replacement,
      }))
      .sort((a, b) => b.start - a.start);

    let highlightedText = translatedText;
    translatedHighlights.forEach((highlight) => {
      const before = highlightedText.substring(0, highlight.start);
      const after = highlightedText.substring(highlight.end);
      highlightedText = before + '<span class="highlight">' + highlight.text + "</span>" + after;
    });

    return {
      text: text,
      translation: highlightedText,
    };
  }

  translateAmericanToBritish(text, highlights) {
    const replacements = [];

    // Translate titles (case-insensitive, with period)
    const titleRegex = /\b(Mr|Mrs|Ms|Mx|Dr|Prof)\./gi;
    let match;
    while ((match = titleRegex.exec(text)) !== null) {
      const title = match[1].toLowerCase() + ".";
      const replacement = americanToBritishTitles[title];
      if (replacement) {
        // Preserve original capitalization
        let finalReplacement = replacement;
        if (match[1][0] === match[1][0].toUpperCase()) {
          finalReplacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          replacement: finalReplacement,
        });
      }
    }

    // Translate time format (HH:MM to HH.MM)
    const timeRegex = /\b(\d{1,2}):(\d{2})\b/g;
    while ((match = timeRegex.exec(text)) !== null) {
      const replacement = match[1] + "." + match[2];
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
        replacement: replacement,
      });
    }

    // Translate phrases (longer first to avoid partial matches)
    const allPhrases = { ...americanOnly, ...americanToBritishSpelling };
    const sortedPhrases = Object.keys(allPhrases).sort((a, b) => b.length - a.length);

    sortedPhrases.forEach((phrase) => {
      const regex = new RegExp(`\\b${this.escapeRegex(phrase)}\\b`, "gi");
      while ((match = regex.exec(text)) !== null) {
        // Check if this match overlaps with any existing replacement
        const overlaps = replacements.some(
          (r) =>
            (match.index >= r.start && match.index < r.end) ||
            (match.index + match[0].length > r.start && match.index + match[0].length <= r.end) ||
            (match.index <= r.start && match.index + match[0].length >= r.end)
        );

        if (!overlaps) {
          const replacement = allPhrases[phrase.toLowerCase()];
          let finalReplacement = replacement;

          // Preserve original case
          if (match[0][0] === match[0][0].toUpperCase()) {
            finalReplacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
          }

          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            original: match[0],
            replacement: finalReplacement,
          });
        }
      }
    });

    // Sort replacements by start position (ascending) to calculate offsets correctly
    replacements.sort((a, b) => a.start - b.start);

    // Calculate offsets for each replacement
    let cumulativeOffset = 0;
    const replacementsWithOffsets = replacements.map((rep) => {
      const offset = cumulativeOffset;
      cumulativeOffset += rep.replacement.length - rep.original.length;
      return {
        ...rep,
        translatedStart: rep.start + offset,
      };
    });

    // Sort by start position (descending) to apply from end to start
    replacementsWithOffsets.sort((a, b) => b.start - a.start);

    // Apply replacements and collect highlights
    let result = text;
    replacementsWithOffsets.forEach((rep) => {
      highlights.push({
        start: rep.start,
        end: rep.end,
        original: rep.original,
        replacement: rep.replacement,
        translatedStart: rep.translatedStart,
      });
      result = result.substring(0, rep.start) + rep.replacement + result.substring(rep.end);
    });

    return result;
  }

  translateBritishToAmerican(text, highlights) {
    const replacements = [];

    // Translate titles (case-insensitive, without period)
    // Create reverse mapping: British (no period) -> American (with period)
    const britishToAmericanTitles = {};
    Object.keys(americanToBritishTitles).forEach((key) => {
      britishToAmericanTitles[americanToBritishTitles[key]] = key;
    });

    const titleRegex = /\b(Mr|Mrs|Ms|Mx|Dr|Prof)\b/gi;
    let match;
    while ((match = titleRegex.exec(text)) !== null) {
      const title = match[1].toLowerCase();
      const replacement = britishToAmericanTitles[title];
      if (replacement) {
        // Preserve original case
        let finalReplacement = replacement;
        if (match[0][0] === match[0][0].toUpperCase()) {
          finalReplacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
        }
        replacements.push({
          start: match.index,
          end: match.index + match[0].length,
          original: match[0],
          replacement: finalReplacement,
        });
      }
    }

    // Translate time format (HH.MM to HH:MM)
    const timeRegex = /\b(\d{1,2})\.(\d{2})\b/g;
    while ((match = timeRegex.exec(text)) !== null) {
      const replacement = match[1] + ":" + match[2];
      replacements.push({
        start: match.index,
        end: match.index + match[0].length,
        original: match[0],
        replacement: replacement,
      });
    }

    // Translate phrases (longer first to avoid partial matches)
    const allPhrases = { ...britishOnly };

    // Reverse the american-to-british spelling dictionary
    Object.keys(americanToBritishSpelling).forEach((key) => {
      allPhrases[americanToBritishSpelling[key]] = key;
    });

    const sortedPhrases = Object.keys(allPhrases).sort((a, b) => b.length - a.length);

    sortedPhrases.forEach((phrase) => {
      const regex = new RegExp(`\\b${this.escapeRegex(phrase)}\\b`, "gi");
      while ((match = regex.exec(text)) !== null) {
        // Check if this match overlaps with any existing replacement
        const overlaps = replacements.some(
          (r) =>
            (match.index >= r.start && match.index < r.end) ||
            (match.index + match[0].length > r.start && match.index + match[0].length <= r.end) ||
            (match.index <= r.start && match.index + match[0].length >= r.end)
        );

        if (!overlaps) {
          const replacement = allPhrases[phrase.toLowerCase()];
          let finalReplacement = replacement;

          // Preserve original case
          if (match[0][0] === match[0][0].toUpperCase()) {
            finalReplacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
          }

          replacements.push({
            start: match.index,
            end: match.index + match[0].length,
            original: match[0],
            replacement: finalReplacement,
          });
        }
      }
    });

    // Sort replacements by start position (ascending) to calculate offsets correctly
    replacements.sort((a, b) => a.start - b.start);

    // Calculate offsets for each replacement
    let cumulativeOffset = 0;
    const replacementsWithOffsets = replacements.map((rep) => {
      const offset = cumulativeOffset;
      cumulativeOffset += rep.replacement.length - rep.original.length;
      return {
        ...rep,
        translatedStart: rep.start + offset,
      };
    });

    // Sort by start position (descending) to apply from end to start
    replacementsWithOffsets.sort((a, b) => b.start - a.start);

    // Apply replacements and collect highlights
    let result = text;
    replacementsWithOffsets.forEach((rep) => {
      highlights.push({
        start: rep.start,
        end: rep.end,
        original: rep.original,
        replacement: rep.replacement,
        translatedStart: rep.translatedStart,
      });
      result = result.substring(0, rep.start) + rep.replacement + result.substring(rep.end);
    });

    return result;
  }

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

module.exports = Translator;
