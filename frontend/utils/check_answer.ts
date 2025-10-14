/**
 * Extracts acronym from parentheses at the end of a string
 * e.g., "Elastic Compute Cloud (EC2)" -> "EC2"
 */
const extractAcronym = (str: string): string | null => {
  const match = str.match(/\(([^)]+)\)$/);
  return match ? match[1].trim() : null;
};

/**
 * Normalizes a string for answer comparison by:
 * - Converting to lowercase
 * - Removing "Amazon" or "AWS" from the beginning
 * - Removing acronyms in parentheses at the end
 * - Converting "&" to "and"
 * - Removing extra whitespace
 * - Removing common punctuation
 */
const normalize = (str: string): string => {
  return (
    str
      .toLowerCase()
      .trim()
      // Remove "Amazon" or "AWS" from the beginning
      .replace(/^(amazon|aws)\s+/i, "")
      // Remove acronym in parentheses at the end (e.g., "(ECS)")
      .replace(/\s*\([^)]+\)\s*$/g, "")
      // Convert "&" to "and"
      .replace(/\s*&\s*/g, " and ")
      .replace(/\s+and\s+/g, " and ")
      // Remove extra whitespace
      .replace(/\s+/g, " ")
      // Remove common punctuation
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      .trim()
  );
};

/**
 * Checks if a user's answer is correct by comparing normalized versions
 * Supports partial matches where all correct words appear in order
 * Also accepts acronyms (e.g., "EC2" for "Elastic Compute Cloud (EC2)")
 */
export const isAnswerCorrect = (
  userAnswer: string,
  correctAnswer: string
): boolean => {
  const normalizedUser = normalize(userAnswer);
  const normalizedCorrect = normalize(correctAnswer);

  // Direct match with full name
  if (normalizedUser === normalizedCorrect) {
    return true;
  }

  // Check if user typed the acronym
  const acronym = extractAcronym(correctAnswer);
  if (acronym && normalize(acronym) === normalizedUser) {
    return true;
  }

  // Check if one contains the other (for cases with extra words)
  const userWords = normalizedUser.split(" ");
  const correctWords = normalizedCorrect.split(" ");

  // If all correct words are in user answer in order
  let correctIndex = 0;
  for (const userWord of userWords) {
    if (userWord === correctWords[correctIndex]) {
      correctIndex++;
      if (correctIndex === correctWords.length) {
        return true;
      }
    }
  }

  return false;
};
