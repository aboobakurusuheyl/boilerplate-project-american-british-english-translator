const chai = require('chai');
const assert = chai.assert;

const Translator = require('../components/translator.js');

suite('Unit Tests', () => {
  const translator = new Translator();

  test('Translate Mangoes are my favorite fruit. to British English', () => {
    const text = 'Mangoes are my favorite fruit.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'favourite');
  });

  test('Translate I ate yogurt for breakfast. to British English', () => {
    const text = 'I ate yogurt for breakfast.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'yoghurt');
  });

  test('Translate We had a party at my friend\'s condo. to British English', () => {
    const text = 'We had a party at my friend\'s condo.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'flat');
  });

  test('Translate Can you toss this in the trashcan for me? to British English', () => {
    const text = 'Can you toss this in the trashcan for me?';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'bin');
  });

  test('Translate The parking lot was full. to British English', () => {
    const text = 'The parking lot was full.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'car park');
  });

  test('Translate Like a high tech Rube Goldberg machine. to British English', () => {
    const text = 'Like a high tech Rube Goldberg machine.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'Heath Robinson device');
  });

  test('Translate To play hooky means to skip class or work. to British English', () => {
    const text = 'To play hooky means to skip class or work.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'bunk off');
  });

  test('Translate No Mr. Bond, I expect you to die. to British English', () => {
    const text = 'No Mr. Bond, I expect you to die.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'Mr');
    assert.notInclude(result.translation, 'Mr.');
  });

  test('Translate Dr. Grosh will see you now. to British English', () => {
    const text = 'Dr. Grosh will see you now.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'Dr');
    assert.notInclude(result.translation, 'Dr.');
  });

  test('Translate Lunch is at 12:15 today. to British English', () => {
    const text = 'Lunch is at 12:15 today.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, '12.15');
    assert.notInclude(result.translation, '12:15');
  });

  test('Translate We watched the footie match for a while. to American English', () => {
    const text = 'We watched the footie match for a while.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'soccer');
  });

  test('Translate Paracetamol takes up to an hour to work. to American English', () => {
    const text = 'Paracetamol takes up to an hour to work.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'Tylenol');
  });

  test('Translate First, caramelise the onions. to American English', () => {
    const text = 'First, caramelise the onions.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'caramelize');
  });

  test('Translate I spent the bank holiday at the funfair. to American English', () => {
    const text = 'I spent the bank holiday at the funfair.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'public holiday');
    assert.include(result.translation, 'carnival');
  });

  test('Translate I had a bicky then went to the chippy. to American English', () => {
    const text = 'I had a bicky then went to the chippy.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'cookie');
    assert.include(result.translation, 'fish-and-chip shop');
  });

  test('Translate I\'ve just got bits and bobs in my bum bag. to American English', () => {
    const text = 'I\'ve just got bits and bobs in my bum bag.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'odds and ends');
    assert.include(result.translation, 'fanny pack');
  });

  test('Translate The car boot sale at Boxted Airfield was called off. to American English', () => {
    const text = 'The car boot sale at Boxted Airfield was called off.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'swap meet');
  });

  test('Translate Have you met Mrs Kalyani? to American English', () => {
    const text = 'Have you met Mrs Kalyani?';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'Mrs.');
  });

  test('Translate Prof Joyner of King\'s College, London. to American English', () => {
    const text = 'Prof Joyner of King\'s College, London.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, 'Prof.');
  });

  test('Translate Tea time is usually around 4 or 4.30. to American English', () => {
    const text = 'Tea time is usually around 4 or 4.30.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, '4:30');
    assert.notInclude(result.translation, '4.30');
  });

  test('Highlight translation in Mangoes are my favorite fruit.', () => {
    const text = 'Mangoes are my favorite fruit.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, '<span class="highlight">favourite</span>');
  });

  test('Highlight translation in I ate yogurt for breakfast.', () => {
    const text = 'I ate yogurt for breakfast.';
    const locale = 'american-to-british';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, '<span class="highlight">yoghurt</span>');
  });

  test('Highlight translation in We watched the footie match for a while.', () => {
    const text = 'We watched the footie match for a while.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, '<span class="highlight">soccer</span>');
  });

  test('Highlight translation in Paracetamol takes up to an hour to work.', () => {
    const text = 'Paracetamol takes up to an hour to work.';
    const locale = 'british-to-american';
    const result = translator.translate(text, locale);
    assert.equal(result.text, text);
    assert.include(result.translation, '<span class="highlight">Tylenol</span>');
  });
});
