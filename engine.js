// Ethiopic Unicode Fidel helpers & Homophone Normalization

// Unicode Fidel family base mapping:
// Ethiopic consonants generally repeat in 7 or 8 orders (ግዕዝ, ካዕብ, ሣልስ, ራብዕ, ኃምስ, ሳድስ, ሳብዕ)
// Consonant base families:
// ሀ (0x1200), ለ (0x1208), ሐ (0x1210), መ (0x1218), ሠ (0x1220), ረ (0x1228), ሰ (0x1230), ሸ (0x1238)...
// Homophone canonical mappings (Family base to Canonical Family base):
// ሐ (0x1210) -> ሀ (0x1200)
// ኀ (0x1280) -> ሀ (0x1200)
// ሠ (0x1220) -> ሰ (0x1230)
// ዐ (0x12D0) -> አ (0x12A0)
// ፀ (0x1348) -> ጸ (0x1340)

const HOMOPHONE_BASE = {
  0x1210: 0x1200, // ሐ -> ሀ
  0x1280: 0x1200, // ኀ -> ሀ
  0x1220: 0x1230, // ሠ -> ሰ
  0x12D0: 0x12A0, // ዐ -> አ
  0x1348: 0x1340, // ፀ -> ጸ
};

export function getFamily(char) {
  const cp = char.codePointAt(0);
  const base = cp & ~7;
  return HOMOPHONE_BASE[base] !== undefined ? HOMOPHONE_BASE[base] : base;
}

export function getOrder(char) {
  const cp = char.codePointAt(0);
  return cp & 7;
}

export function normalizeFidel(char) {
  const cp = char.codePointAt(0);
  const base = cp & ~7;
  const order = cp & 7;
  const canonicalBase = HOMOPHONE_BASE[base];
  if (canonicalBase !== undefined) {
    return String.fromCodePoint(canonicalBase | order);
  }
  return char;
}

export function normalizeWord(word) {
  return [...word].map(normalizeFidel).join('');
}

/**
 * Evaluates a guess against the answer.
 * Result types for each position:
 * - 'correct': Exact character match (Green)
 * - 'present': Exact character match, wrong position (Yellow)
 * - 'family': Same consonant family, different vowel order (Blue/Cyan)
 * - 'absent': Neither character nor family present (Gray)
 */
export function evaluateGuess(guess, answer) {
  const g = [...guess].map(normalizeFidel);
  const a = [...answer].map(normalizeFidel);
  const len = g.length;

  const result = Array(len).fill('absent');
  const answerUsed = Array(len).fill(false);

  // Pass 1: Exact matches (Character + Vowel)
  for (let i = 0; i < len; i++) {
    if (g[i] === a[i]) {
      result[i] = 'correct';
      answerUsed[i] = true;
    }
  }

  // Pass 2: Present exact character (wrong position)
  for (let i = 0; i < len; i++) {
    if (result[i] !== 'absent') continue;
    for (let j = 0; j < len; j++) {
      if (!answerUsed[j] && g[i] === a[j]) {
        result[i] = 'present';
        answerUsed[j] = true;
        break;
      }
    }
  }

  // Pass 3: Same consonant family (wrong vowel order)
  for (let i = 0; i < len; i++) {
    if (result[i] !== 'absent') continue;
    const gFam = getFamily(g[i]);
    for (let j = 0; j < len; j++) {
      if (!answerUsed[j] && getFamily(a[j]) === gFam) {
        result[i] = 'family';
        answerUsed[j] = true;
        break;
      }
    }
  }

  return result;
}
