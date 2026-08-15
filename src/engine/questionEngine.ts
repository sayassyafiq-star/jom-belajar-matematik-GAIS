import { MathOperation, Question, VisualGroup } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface StatisticalTestSummary {
  totalQuestions: number;
  passedCount: number;
  failedCount: number;
  durationMs: number;
  breakdown: Array<{
    operation: MathOperation;
    level: number;
    tested: number;
    passed: number;
    failed: number;
    sampleErrors?: string[];
  }>;
}

/**
 * Returns the maximum value of each operand for a given level.
 * Level 1: 10
 * Level 2: 50
 * Level 3: 100
 * Level 4: 500
 * Level 5: 999
 */
export function getMaxNumber(level: number): number {
  switch (level) {
    case 1:
      return 10;
    case 2:
      return 50;
    case 3:
      return 100;
    case 4:
      return 500;
    case 5:
      return 999;
    default:
      if (level <= 0) return 10;
      return 999;
  }
}

/**
 * Helper to get user-friendly Malay topic title and math operator symbol.
 */
export function getOperationMetadata(operation: MathOperation): {
  topicTitle: string;
  symbol: string;
} {
  switch (operation) {
    case 'addition':
      return { topicTitle: 'Tambah', symbol: '+' };
    case 'subtraction':
      return { topicTitle: 'Tolak', symbol: '−' };
    case 'multiplication':
      return { topicTitle: 'Darab', symbol: '×' };
    case 'division':
      return { topicTitle: 'Bahagi', symbol: '÷' };
    case 'time':
      return { topicTitle: 'Bacaan Jam', symbol: '🕐' };
    default:
      return { topicTitle: 'Matematik', symbol: '+' };
  }
}

/**
 * Formats a 12-hour time into standard display string (e.g. "3:00", "3:30").
 */
export function formatTimeString(hour: number, minute: number): string {
  const safeHour = ((Math.floor(hour) - 1) % 12 + 12) % 12 + 1;
  const safeMinute = minute === 30 ? '30' : '00';
  return `${safeHour}:${safeMinute}`;
}

/**
 * Returns an integer random number between min and max (inclusive).
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Shuffles an array deterministically using the Fisher-Yates algorithm.
 */
function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Helper to wrap hour in range [1..12]
 */
function wrapHour(h: number): number {
  return (((h - 1) % 12 + 12) % 12) + 1;
}

/**
 * Generates 3 mathematically plausible, unique distractors for a given question.
 */
export function generateDistractors(
  correctAnswer: number | string,
  operandA: number,
  operandB: number,
  operation: MathOperation,
  level: number
): (number | string)[] {
  // SPECIAL HANDLING: TIME OPERATION
  if (operation === 'time') {
    if (level === 1) {
      // Level 1: Jam Tepat numbers 1..12
      const correctHour = typeof correctAnswer === 'number' ? correctAnswer : parseInt(String(correctAnswer), 10);
      const distractors = new Set<number>();
      
      const candidates = [
        wrapHour(correctHour + 1),
        wrapHour(correctHour - 1),
        wrapHour(correctHour + 2),
        wrapHour(correctHour - 2),
        wrapHour(correctHour + 6),
      ];

      for (const cand of shuffleArray(candidates)) {
        if (cand !== correctHour) distractors.add(cand);
        if (distractors.size === 3) break;
      }

      // Fill remaining from 1..12
      const allHours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter((h) => h !== correctHour);
      for (const h of shuffleArray(allHours)) {
        if (distractors.size >= 3) break;
        distractors.add(h);
      }
      return Array.from(distractors).slice(0, 3);
    } else {
      // Level 2: Time strings with :00 and :30 (e.g. "3:30", "3:00", "4:30", "2:30")
      const hour = operandA;
      const minute = operandB;
      const correctTimeStr = typeof correctAnswer === 'string' ? correctAnswer : formatTimeString(hour, minute);
      const distractors = new Set<string>();

      // Plausible candidate time strings
      const candidates: string[] = [
        // 1. Same hour, opposite minute (e.g. 3:00 when answer is 3:30)
        formatTimeString(hour, minute === 0 ? 30 : 0),
        // 2. Adjacent hours, same minute (e.g. 4:30, 2:30)
        formatTimeString(wrapHour(hour + 1), minute),
        formatTimeString(wrapHour(hour - 1), minute),
        // 3. Adjacent hours, opposite minute (e.g. 4:00, 2:00)
        formatTimeString(wrapHour(hour + 1), minute === 0 ? 30 : 0),
        formatTimeString(wrapHour(hour - 1), minute === 0 ? 30 : 0),
        // 4. +/- 2 hours
        formatTimeString(wrapHour(hour + 2), minute),
        formatTimeString(wrapHour(hour - 2), minute),
      ];

      for (const cand of shuffleArray(candidates)) {
        if (cand !== correctTimeStr) {
          distractors.add(cand);
        }
        if (distractors.size === 3) break;
      }

      // Fill remaining if needed
      if (distractors.size < 3) {
        for (let h = 1; h <= 12; h++) {
          for (const m of [0, 30]) {
            const timeCandidate = formatTimeString(h, m);
            if (timeCandidate !== correctTimeStr && !distractors.has(timeCandidate)) {
              distractors.add(timeCandidate);
            }
            if (distractors.size === 3) break;
          }
          if (distractors.size === 3) break;
        }
      }

      return Array.from(distractors).slice(0, 3);
    }
  }

  // NUMERIC OPERATIONS (Addition, Subtraction, Multiplication, Division)
  const numCorrect = typeof correctAnswer === 'number' ? correctAnswer : parseInt(String(correctAnswer), 10);
  const distractors = new Set<number>();

  // Common offset candidates close to the correct answer
  const offsetPool = [1, -1, 2, -2, 3, -3, 10, -10, 5, -5, 4, -4, 20, -20];

  // Plausible conceptual slip candidates based on operation
  const conceptualCandidates: number[] = [];

  if (operation === 'addition') {
    // Student subtracted instead
    if (operandA >= operandB) conceptualCandidates.push(operandA - operandB);
    // Calculation slips: off by one on tens or ones
    conceptualCandidates.push(numCorrect + 1, numCorrect - 1, numCorrect + 10, numCorrect - 10, numCorrect + 2, numCorrect - 2);
  } else if (operation === 'subtraction') {
    // Student added instead
    conceptualCandidates.push(operandA + operandB);
    conceptualCandidates.push(numCorrect + 1, numCorrect - 1, numCorrect + 2, numCorrect + 10);
    if (numCorrect >= 10) conceptualCandidates.push(numCorrect - 10);
  } else if (operation === 'multiplication') {
    // Student added instead
    conceptualCandidates.push(operandA + operandB);
    // Off by one multiple
    if (operandA > 0) {
      conceptualCandidates.push(numCorrect + operandA);
      if (numCorrect - operandA >= 0) conceptualCandidates.push(numCorrect - operandA);
    }
    if (operandB > 0) {
      conceptualCandidates.push(numCorrect + operandB);
      if (numCorrect - operandB >= 0) conceptualCandidates.push(numCorrect - operandB);
    }
    conceptualCandidates.push(numCorrect + 1, numCorrect - 1, numCorrect + 2);
  } else if (operation === 'division') {
    // Student subtracted or added
    if (operandA >= operandB) conceptualCandidates.push(operandA - operandB);
    conceptualCandidates.push(numCorrect + 1, numCorrect + 2, numCorrect + 3);
    if (numCorrect > 1) conceptualCandidates.push(numCorrect - 1);
    if (numCorrect > 2) conceptualCandidates.push(numCorrect - 2);
  }

  // Shuffle and add valid conceptual candidates first
  const shuffledConceptual = shuffleArray(conceptualCandidates);
  for (const cand of shuffledConceptual) {
    if (cand >= 0 && Number.isInteger(cand) && cand !== numCorrect && !distractors.has(cand)) {
      distractors.add(cand);
      if (distractors.size === 3) break;
    }
  }

  // Fill remaining slots using shuffled nearby offsets
  const shuffledOffsets = shuffleArray(offsetPool);
  for (const offset of shuffledOffsets) {
    if (distractors.size >= 3) break;
    const cand = numCorrect + offset;
    if (cand >= 0 && Number.isInteger(cand) && cand !== numCorrect && !distractors.has(cand)) {
      distractors.add(cand);
    }
  }

  // Fallback if still under 3 unique distractors
  let delta = 1;
  while (distractors.size < 3) {
    const candUp = numCorrect + delta;
    if (candUp >= 0 && !distractors.has(candUp) && candUp !== numCorrect) {
      distractors.add(candUp);
    }
    if (distractors.size < 3) {
      const candDown = numCorrect - delta;
      if (candDown >= 0 && !distractors.has(candDown) && candDown !== numCorrect) {
        distractors.add(candDown);
      }
    }
    delta++;
    if (delta > 500) {
      const fallback = Math.max(0, numCorrect + getRandomInt(1, 100));
      if (fallback !== numCorrect) distractors.add(fallback);
    }
  }

  return Array.from(distractors).slice(0, 3);
}

/**
 * Validates a Question object according to all strict mathematical and structural rules.
 */
export function validateQuestion(question: Question): ValidationResult {
  const errors: string[] = [];

  if (!question) {
    return { isValid: false, errors: ['Question is null or undefined'] };
  }

  // 1. Check ID
  if (!question.id || typeof question.id !== 'string') {
    errors.push('Question ID must be a non-empty string');
  }

  // 2. Check Operation
  const validOperations: MathOperation[] = ['addition', 'subtraction', 'multiplication', 'division', 'time'];
  if (!validOperations.includes(question.operation)) {
    errors.push(`Invalid operation: ${question.operation}`);
  }

  // 3. Check Level & Max Number
  const maxNumber = getMaxNumber(question.level);
  if (typeof question.level !== 'number' || question.level < 1 || question.level > 5) {
    errors.push(`Level must be an integer between 1 and 5, received: ${question.level}`);
  }

  // 4. Check Operands according to Operation & Level
  if (!Number.isInteger(question.operandA) || question.operandA < 0) {
    errors.push(`operandA must be a non-negative integer, received: ${question.operandA}`);
  }
  if (!Number.isInteger(question.operandB) || question.operandB < 0) {
    errors.push(`operandB must be a non-negative integer, received: ${question.operandB}`);
  }

  // 5. Operation & Level Specific Mathematics Checks
  let expectedNumericAnswer: number | null = null;
  let expectedStringAnswer: string | null = null;

  switch (question.operation) {
    case 'addition': {
      if (question.level === 1) {
        if (question.operandA > 10) {
          errors.push(`Level 1 addition operandA (${question.operandA}) exceeds 10`);
        }
        if (question.operandB > 10) {
          errors.push(`Level 1 addition operandB (${question.operandB}) exceeds 10`);
        }
      } else if (question.level === 2) {
        // Level 2 addition: operandA 10-50, operandB 1-50
        if (question.operandA < 10 || question.operandA > 50) {
          errors.push(`Level 2 addition operandA (${question.operandA}) must be between 10 and 50`);
        }
        if (question.operandB < 1 || question.operandB > 50) {
          errors.push(`Level 2 addition operandB (${question.operandB}) must be between 1 and 50`);
        }
      } else {
        if (question.operandA > maxNumber) {
          errors.push(`operandA (${question.operandA}) exceeds maxNumber (${maxNumber}) for level ${question.level}`);
        }
        if (question.operandB > maxNumber) {
          errors.push(`operandB (${question.operandB}) exceeds maxNumber (${maxNumber}) for level ${question.level}`);
        }
      }
      expectedNumericAnswer = question.operandA + question.operandB;
      break;
    }

    case 'subtraction': {
      if (question.operandA < question.operandB) {
        errors.push(
          `Subtraction operandA (${question.operandA}) must be >= operandB (${question.operandB}) to avoid negative answers`
        );
      }
      if (question.level === 1) {
        if (question.operandA > 20) {
          errors.push(`Level 1 subtraction operandA (${question.operandA}) exceeds 20`);
        }
      } else if (question.level === 2) {
        // Level 2 subtraction: operandA 10-50, operandB 1-operandA
        if (question.operandA < 10 || question.operandA > 50) {
          errors.push(`Level 2 subtraction operandA (${question.operandA}) must be between 10 and 50`);
        }
        if (question.operandB < 1 || question.operandB > question.operandA) {
          errors.push(`Level 2 subtraction operandB (${question.operandB}) must be between 1 and operandA (${question.operandA})`);
        }
      } else {
        if (question.operandA > maxNumber) {
          errors.push(`operandA (${question.operandA}) exceeds maxNumber (${maxNumber}) for level ${question.level}`);
        }
      }
      expectedNumericAnswer = question.operandA - question.operandB;
      if (expectedNumericAnswer < 0) {
        errors.push(`Subtraction correctAnswer cannot be negative: ${expectedNumericAnswer}`);
      }
      break;
    }

    case 'multiplication': {
      if (question.operandA === 0 || question.operandB === 0) {
        errors.push('Multiplication operands must not be zero');
      }

      if (question.level === 1) {
        // Level 1: operandA 1..10, multiplier operandB 1..5
        if (question.operandA < 1 || question.operandA > 10) {
          errors.push(`Level 1 multiplication operandA (${question.operandA}) must be between 1 and 10`);
        }
        if (question.operandB < 1 || question.operandB > 5) {
          errors.push(`Level 1 multiplication multiplier operandB (${question.operandB}) must be between 1 and 5`);
        }
      } else if (question.level === 2) {
        // Level 2: operandA 2..10, operandB 2..10
        if (question.operandA < 2 || question.operandA > 10) {
          errors.push(`Level 2 multiplication operandA (${question.operandA}) must be between 2 and 10`);
        }
        if (question.operandB < 2 || question.operandB > 10) {
          errors.push(`Level 2 multiplication operandB (${question.operandB}) must be between 2 and 10`);
        }
      } else {
        if (question.operandA > maxNumber || question.operandB > maxNumber) {
          errors.push(`Multiplication operand exceeds maxNumber (${maxNumber}) for level ${question.level}`);
        }
      }
      expectedNumericAnswer = question.operandA * question.operandB;
      break;
    }

    case 'division': {
      if (question.operandB === 0) {
        errors.push('Division by zero is strictly forbidden (operandB === 0)');
      } else if (question.operandB === 1 && (question.level === 1 || question.level === 2)) {
        errors.push(`Divisor 1 is forbidden in Level ${question.level} division`);
      } else if (question.level === 1) {
        // Level 1: divisor 2..5, dividend !== divisor, whole integer result
        if (question.operandB < 2 || question.operandB > 5) {
          errors.push(`Level 1 division divisor operandB (${question.operandB}) must be between 2 and 5`);
        }
        if (question.operandA < 1) {
          errors.push(`Level 1 division dividend operandA (${question.operandA}) must be >= 1`);
        }
        if (question.operandA === question.operandB) {
          errors.push(`Level 1 division dividend (${question.operandA}) must not equal divisor (${question.operandB})`);
        }
        if (question.operandA % question.operandB !== 0) {
          errors.push(`Division must produce a whole number integer: ${question.operandA} ÷ ${question.operandB}`);
        }
        expectedNumericAnswer = Math.floor(question.operandA / question.operandB);
      } else if (question.level === 2) {
        // Level 2: divisor 2..10, quotient 2..10, dividend = divisor * quotient
        if (question.operandB < 2 || question.operandB > 10) {
          errors.push(`Level 2 division divisor operandB (${question.operandB}) must be between 2 and 10`);
        }
        if (question.operandA % question.operandB !== 0) {
          errors.push(`Level 2 division must produce a whole number integer: ${question.operandA} ÷ ${question.operandB}`);
        }
        const quotient = Math.floor(question.operandA / question.operandB);
        if (quotient < 2 || quotient > 10) {
          errors.push(`Level 2 division quotient (${quotient}) must be between 2 and 10`);
        }
        expectedNumericAnswer = quotient;
      } else {
        if (question.operandA % question.operandB !== 0) {
          errors.push(`Division must produce a whole number integer: ${question.operandA} ÷ ${question.operandB}`);
        }
        expectedNumericAnswer = Math.floor(question.operandA / question.operandB);
      }
      break;
    }

    case 'time': {
      if (question.operandA < 1 || question.operandA > 12) {
        errors.push(`Time hour operandA (${question.operandA}) must be between 1 and 12`);
      }

      if (question.level === 1) {
        // Level 1: Jam tepat 1:00 hingga 12:00 sahaja (minute = 0)
        if (question.operandB !== 0) {
          errors.push(`Level 1 time minute operandB (${question.operandB}) must be strictly 0 for jam tepat`);
        }
        // In Level 1, correctAnswer is number hour (e.g. 3) or string "3:00"
        if (typeof question.correctAnswer === 'number') {
          expectedNumericAnswer = question.operandA;
        } else {
          expectedStringAnswer = formatTimeString(question.operandA, 0);
        }
      } else if (question.level === 2) {
        // Level 2: minute must strictly be 0 or 30
        if (question.operandB !== 0 && question.operandB !== 30) {
          errors.push(`Level 2 time minute operandB (${question.operandB}) must strictly be 0 or 30`);
        }
        expectedStringAnswer = formatTimeString(question.operandA, question.operandB);
      } else {
        if (question.operandB < 0 || question.operandB >= 60) {
          errors.push(`Time minute operandB (${question.operandB}) must be between 0 and 59`);
        }
        expectedStringAnswer = formatTimeString(question.operandA, question.operandB);
      }
      break;
    }
  }

  // 6. Check Correct Answer
  if (expectedNumericAnswer !== null && question.correctAnswer !== expectedNumericAnswer) {
    errors.push(
      `correctAnswer (${question.correctAnswer}) does not match expected numeric result (${expectedNumericAnswer}) for ${question.prompt}`
    );
  }
  if (expectedStringAnswer !== null && question.correctAnswer !== expectedStringAnswer) {
    errors.push(
      `correctAnswer (${question.correctAnswer}) does not match expected string result (${expectedStringAnswer}) for ${question.prompt}`
    );
  }

  // 7. Check Choices
  if (!Array.isArray(question.choices)) {
    errors.push('choices must be an array');
  } else {
    if (question.choices.length !== 4) {
      errors.push(`choices must contain exactly 4 options, found: ${question.choices.length}`);
    }

    // Check uniqueness
    const uniqueChoices = new Set(question.choices);
    if (uniqueChoices.size !== question.choices.length) {
      errors.push(`choices must all be unique, found duplicates: [${question.choices.join(', ')}]`);
    }

    // Check that correct answer exists in choices exactly once
    const correctCount = question.choices.filter((c) => c === question.correctAnswer).length;
    if (correctCount !== 1) {
      errors.push(
        `correctAnswer (${question.correctAnswer}) must exist exactly once in choices, found ${correctCount} occurrences`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Generates a single deterministic, validated Question object.
 *
 * @param operation The arithmetic operation ('addition' | 'subtraction' | 'multiplication' | 'division' | 'time')
 * @param level Integer level between 1 and 5 (Tahap 1 & 2 fully supported)
 * @param previousQuestionIds Optional list or set of previous question signatures to avoid repetition within session
 */
export function generateQuestion(
  operation: MathOperation,
  level: number = 1,
  previousQuestionIds?: string[] | Set<string>
): Question {
  const maxNumber = getMaxNumber(level);
  const prevSet = previousQuestionIds
    ? previousQuestionIds instanceof Set
      ? previousQuestionIds
      : new Set(previousQuestionIds)
    : new Set<string>();

  const maxAttempts = 60;
  let attempts = 0;

  while (attempts < maxAttempts) {
    attempts++;

    let operandA = 0;
    let operandB = 0;
    let correctAnswer: number | string = 0;
    let prompt = '';
    const { topicTitle, symbol } = getOperationMetadata(operation);

    switch (operation) {
      case 'addition': {
        if (level === 1) {
          // Level 1: 0..10
          operandA = getRandomInt(0, 10);
          operandB = operandA === 0 ? getRandomInt(1, 10) : getRandomInt(0, 10);
        } else if (level === 2) {
          // Level 2: operandA: 10..50, operandB: 1..50
          operandA = getRandomInt(10, 50);
          operandB = getRandomInt(1, 50);
        } else {
          operandA = getRandomInt(1, maxNumber);
          operandB = getRandomInt(1, maxNumber);
        }
        correctAnswer = operandA + operandB;
        prompt = `${operandA} + ${operandB} = ?`;
        break;
      }

      case 'subtraction': {
        if (level === 1) {
          // Level 1: operandA 0..10 (or up to 20), operandB 0..operandA
          operandA = getRandomInt(1, 10);
          operandB = getRandomInt(0, operandA);
        } else if (level === 2) {
          // Level 2: operandA 10..50, operandB 1..operandA (answer >= 0)
          operandA = getRandomInt(10, 50);
          operandB = getRandomInt(1, operandA);
        } else {
          operandA = getRandomInt(10, maxNumber);
          operandB = getRandomInt(1, operandA);
        }
        correctAnswer = operandA - operandB;
        prompt = `${operandA} − ${operandB} = ?`;
        break;
      }

      case 'multiplication': {
        if (level === 1) {
          // Level 1: operandA 1..10, multiplier operandB 1..5, zero not allowed
          operandA = getRandomInt(1, 10);
          operandB = getRandomInt(1, 5);
        } else if (level === 2) {
          // Level 2: operandA 2..10, operandB 2..10, zero not allowed
          operandA = getRandomInt(2, 10);
          operandB = getRandomInt(2, 10);
        } else {
          operandA = getRandomInt(2, Math.min(20, maxNumber));
          operandB = getRandomInt(2, 10);
        }
        correctAnswer = operandA * operandB;
        prompt = `${operandA} × ${operandB} = ?`;
        break;
      }

      case 'division': {
        if (level === 1) {
          // Level 1: divisor 2..5, quotient 2..10, dividend = divisor * quotient
          const divisor = getRandomInt(2, 5);
          const quotient = getRandomInt(2, 10);
          const dividend = quotient * divisor;

          operandA = dividend;
          operandB = divisor;
          correctAnswer = quotient;
          prompt = `${operandA} ÷ ${operandB} = ?`;
        } else if (level === 2) {
          // Level 2: divisor 2..10, quotient 2..10, dividend = divisor * quotient
          const divisor = getRandomInt(2, 10);
          const quotient = getRandomInt(2, 10);
          const dividend = quotient * divisor;

          operandA = dividend;
          operandB = divisor;
          correctAnswer = quotient;
          prompt = `${operandA} ÷ ${operandB} = ?`;
        } else {
          const divisor = getRandomInt(2, Math.min(20, maxNumber));
          const maxQuotient = Math.max(2, Math.floor(maxNumber / divisor));
          const quotient = getRandomInt(1, maxQuotient);
          const dividend = quotient * divisor;

          operandA = dividend;
          operandB = divisor;
          correctAnswer = quotient;
          prompt = `${operandA} ÷ ${operandB} = ?`;
        }
        break;
      }

      case 'time': {
        if (level === 1) {
          // Level 1: Jam tepat 1:00 hingga 12:00 sahaja (minute = 0)
          const hour = getRandomInt(1, 12);
          const minute = 0;

          operandA = hour;
          operandB = minute;
          correctAnswer = hour;
          prompt = 'Pukul berapa sekarang?';
        } else if (level === 2) {
          // Level 2: Jam 1..12 dengan minit :00 atau :30 sahaja
          const hour = getRandomInt(1, 12);
          const minute = Math.random() < 0.5 ? 0 : 30;

          operandA = hour;
          operandB = minute;
          correctAnswer = formatTimeString(hour, minute);
          prompt = 'Pukul berapa sekarang?';
        } else {
          const hour = getRandomInt(1, 12);
          const minute = [0, 15, 30, 45][getRandomInt(0, 3)];

          operandA = hour;
          operandB = minute;
          correctAnswer = formatTimeString(hour, minute);
          prompt = 'Pukul berapa sekarang?';
        }
        break;
      }

      default: {
        operandA = getRandomInt(1, maxNumber);
        operandB = getRandomInt(1, maxNumber);
        correctAnswer = operandA + operandB;
        prompt = `${operandA} + ${operandB} = ?`;
        break;
      }
    }

    const signature = `${operation}-${level}-${operandA}-${operandB}`;

    // If already generated in this session and we have attempts remaining, retry
    if (prevSet.has(signature) && attempts < maxAttempts - 5) {
      continue;
    }

    // Generate 3 unique distractors
    const distractors = generateDistractors(correctAnswer, operandA, operandB, operation, level);

    // Combine and shuffle choices
    const choices = shuffleArray([correctAnswer, ...distractors]);

    const groupA: VisualGroup = {
      count: operandA,
      itemEmoji: operation === 'time' ? '🕐' : '🍎',
      label: operation === 'time' ? `Pukul ${operandA}` : `Kumpulan 1 (${operandA})`,
    };

    const groupB: VisualGroup = {
      count: operandB,
      itemEmoji: operation === 'time' ? '⏱️' : '🍎',
      label: operation === 'time' ? `${operandB} Minit` : `Kumpulan 2 (${operandB})`,
    };

    const question: Question = {
      id: `${operation}-L${level}-${operandA}-${operandB}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
      operation,
      operandA,
      operandB,
      prompt,
      correctAnswer,
      choices,
      level,
      topicTitle,
      operatorSymbol: symbol,
      groupA,
      groupB,
      questionIndex: 1,
      totalQuestions: 10,
    };

    // Strict validation check
    const validation = validateQuestion(question);
    if (validation.isValid) {
      return question;
    }
  }

  // Fallback question if max attempts reached
  const fallbackA = level === 2 ? 15 : 5;
  const fallbackB = level === 2 ? 10 : 3;
  return {
    id: `fallback-${Date.now()}`,
    operation: 'addition',
    operandA: fallbackA,
    operandB: fallbackB,
    prompt: `${fallbackA} + ${fallbackB} = ?`,
    correctAnswer: fallbackA + fallbackB,
    choices: [fallbackA + fallbackB, fallbackA + fallbackB - 1, fallbackA + fallbackB + 1, fallbackA + fallbackB + 2],
    level,
    topicTitle: 'Tambah',
    operatorSymbol: '+',
    groupA: { count: fallbackA, itemEmoji: '🍎', label: 'Kumpulan 1' },
    groupB: { count: fallbackB, itemEmoji: '🍎', label: 'Kumpulan 2' },
    questionIndex: 1,
    totalQuestions: 10,
  };
}

/**
 * Development statistical tester.
 * Generates N questions for each operation x level combination (5 operations x 5 levels x 100 = 2500 questions)
 * and runs strict mathematical validation on each.
 */
export function runStatisticalTest(iterationsPerCombination: number = 100): StatisticalTestSummary {
  const operations: MathOperation[] = ['addition', 'subtraction', 'multiplication', 'division', 'time'];
  const levels = [1, 2, 3, 4, 5];
  const startTime = performance.now();

  let totalQuestions = 0;
  let passedCount = 0;
  let failedCount = 0;

  const breakdown: StatisticalTestSummary['breakdown'] = [];

  for (const op of operations) {
    for (const lvl of levels) {
      let passed = 0;
      let failed = 0;
      const sampleErrors: string[] = [];
      const sessionIds = new Set<string>();

      for (let i = 0; i < iterationsPerCombination; i++) {
        totalQuestions++;
        const q = generateQuestion(op, lvl, sessionIds);
        sessionIds.add(`${q.operation}-${q.level}-${q.operandA}-${q.operandB}`);

        const result = validateQuestion(q);
        if (result.isValid) {
          passed++;
          passedCount++;
        } else {
          failed++;
          failedCount++;
          if (sampleErrors.length < 3) {
            sampleErrors.push(`[${q.prompt} (A=${q.operandA}, B=${q.operandB}, Ans=${q.correctAnswer}, Choices=${JSON.stringify(q.choices)})] errors: ${result.errors.join('; ')}`);
          }
        }
      }

      breakdown.push({
        operation: op,
        level: lvl,
        tested: iterationsPerCombination,
        passed,
        failed,
        sampleErrors: sampleErrors.length > 0 ? sampleErrors : undefined,
      });
    }
  }

  const durationMs = Math.round(performance.now() - startTime);

  return {
    totalQuestions,
    passedCount,
    failedCount,
    durationMs,
    breakdown,
  };
}
