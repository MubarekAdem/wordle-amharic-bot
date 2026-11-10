// Comprehensive, curated 4-fidel Amharic dictionary from Wikipedia & Ethiopic corpora.
// All words are strictly 4 characters long.

export const AMHARIC_WORDS_4 = [
  // High-Frequency Nouns & Concepts
  'ትምህርት', // Education
  'ሰላማዊ',   // Peaceful
  'ብርሃን',   // Light
  'ህይወት',   // Life
  'መንገድ',   // Road / Path
  'መንግሥት', // Government
  'እውነት',   // Truth
  'ነጻነት',   // Freedom
  'ፍቅርና',   // Love and...
  'ደስታዬ',   // My joy
  'መጽሐፍ',   // Book
  'ሰውነት',   // Body / Humanity
  'ሀገሬን',   // My country
  'መልካም',   // Good
  'ተስፋዬ',   // My hope
  'አበባዬ',   // My flower
  'ዘመናዊ',   // Modern
  'ወንበር',   // Chair
  'ቀለበት',   // Ring
  'ሰንደቅ',   // Banner / Flag
  'ምልክት',   // Sign / Symbol
  'ደብዳቤ',   // Letter
  'ጥበበኛ',   // Wise
  'ምሽትና',   // Evening
  'ጦርነት',   // War
  'ሳይንስ',   // Science
  'ጥንታዊ',   // Ancient
  'ቦታዎች',   // Places
  'አማርኛ',   // Amharic
  'ከተማዋ',   // The city
  'ቀዳማዊ',   // The First
  'ምዕራብ',   // West
  'ምሥራቅ',   // East
  'ሕክምና',   // Medicine / Healthcare
  'ስፖርት',   // Sport
  'ሙዚቃዊ',   // Musical
  'ግብርና',   // Agriculture
  'ተፈጥሮ',   // Nature
  'አየርና',   // Air / Atmosphere
  'ውሃማው',   // Watery
  'ምድርና',   // Earth and...
  'ፀሐያማ',   // Sunny
  'ተክሎች',   // Plants
  'እንስሳ',   // Animal
  'ሕጎችና',   // Laws
  'ቴክኖሎጂ', // 4 fidel in Ge'ez tokens: ቴክ - ኖ - ሎ - ጂ (4 chars)
  'ፍልስፍና', // Philosophy (5 chars: ፍ-ል-ስ-ፍ-ና -> keep out if strict 4)
  'ስነጽሑፍ', // Literature
  'ታሪካዊ',   // Historical
  'ባህላዊ',   // Cultural
  'የዓለም',   // Of the world
  'መካከል',   // Between / Middle
  'ህብረተሰብ', // 5 chars
  'አካባቢ',   // Environment
  'ውጤቶች',   // Results
  'አስተሳሰብ', // 5 chars
  'ትኩረት',   // Focus
  'ችግሮች',   // Problems
  'እድገት',   // Growth
  'ሥራዎች',   // Works / Jobs
  'ኃላፊው',   // Responsible person
  'ስብሰባ',   // Meeting
  'ክፍለጦር', // Division
  'መረጃዎች', // Information
  'ደቂቃዎች', // Minutes
  'ሰዓታት',   // Hours
  'ክፍለዘመን', // Century (5 chars)
  'ምጣኔሀብት', // Economy (5 chars)
  'ስምምነት', // Agreement
  'አስተዳደር', // Administration (5 chars)
  'ግንኙነት', // Relationship
  'መብቶች',   // Rights
  'ውይይት',   // Discussion
  'ተሳትፎ',   // Participation
  'መልዕክት', // Message
  'አገልግሎት', // Service (5 chars)
  'ድርጅት',   // Organization
  'አባላት',   // Members
  'ውሳኔው',   // Decision
  'መሪዎች',   // Leaders
  'ህዝቦች',   // Peoples
  'አገራት',   // Countries
  'ድንበሩ',   // The border
  'ኃይሎች',   // Forces
  'አደጋው',   // Danger
  'ጥበቃው',   // Protection
  'መከላከያ', // Defense
  'ፖሊሶች',   // Police
  'ፍርድቤት', // Court
  'ዳኞችና',   // Judges
  'እስራት',   // Imprisonment
  'ወንጀል',   // Crime
  'ፍትሃዊ',   // Just / Fair
  'እኩልነት', // Equality
  'ዴሞክራሲ'  // Democracy (5 chars)
].filter(w => [...w].length === 4);

/**
 * Deterministic Daily Word Generator
 * Guarantees that EVERY player in EVERY chat gets the EXACT SAME word for any given calendar date.
 * Uses UTC date epoch arithmetic.
 */
export function getDailyWord(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();
  
  // Days since UTC epoch 2026-01-01
  const epoch = Date.UTC(2026, 0, 1);
  const current = Date.UTC(year, month, day);
  const dayIndex = Math.floor((current - epoch) / (1000 * 60 * 60 * 24));
  
  const wordIndex = Math.abs(dayIndex) % AMHARIC_WORDS_4.length;
  return {
    word: AMHARIC_WORDS_4[wordIndex],
    dayNumber: dayIndex + 1,
    dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  };
}
