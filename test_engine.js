import { evaluateGuess, normalizeWord, getFamily } from './engine.js';
import { AMHARIC_WORDS_4, getDailyWord } from './words.js';

console.log('--- Testing Amharic Wordle Engine ---');
console.log(`Loaded ${AMHARIC_WORDS_4.length} 4-fidel words.`);

// Test 1: Exact Match
const res1 = evaluateGuess('ብርሃን', 'ብርሃን');
console.log('Exact match test:', res1.every(r => r === 'correct') ? 'PASS' : 'FAIL', res1);

// Test 2: Homophone match (ሓ [4th order of ሐ] vs ሃ [4th order of ሀ])
// 'ብርሓን' vs 'ብርሃን'
const res2 = evaluateGuess('ብርሓን', 'ብርሃን');
console.log('Homophone match test (ሓ vs ሃ):', res2.every(r => r === 'correct') ? 'PASS' : 'FAIL', res2);

// Test 3: Family match (different vowel order)
// Guess 'ብርሁን' (Birhun, 2nd order ሑ) vs Answer 'ብርሃን' (Birhan, 4th order ሃ)
// Expected: [correct, correct, family, correct]
const res3 = evaluateGuess('ብርሁን', 'ብርሃን');
console.log('Family match test (ሑ vs ሃ):', res3[2] === 'family' ? 'PASS' : 'FAIL', res3);

// Test 4: Daily word
console.log('Daily word today:', getDailyWord());
