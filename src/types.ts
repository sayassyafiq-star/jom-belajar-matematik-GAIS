export interface StudentProfile {
  studentId: string;
  fullName: string;
  displayName: string;
  createdAt: string;
  updatedAt: string;
  avatarSeed?: string;
}

export type ActionType = 'start' | 'exam' | 'performance' | 'settings' | 'math_lab';

export interface ActionFeedback {
  type: ActionType;
  title: string;
  message: string;
}

export type CardState = 'default' | 'selected' | 'correct' | 'incorrect' | 'disabled';

export type CardSize = 'sm' | 'md' | 'lg';

export interface NumberCardProps {
  key?: string | number;
  value: number | string;
  selected?: boolean;
  disabled?: boolean;
  state?: CardState;
  onClick?: () => void;
  size?: CardSize;
  className?: string;
  ariaLabel?: string;
  id?: string;
}

export type MathOperation = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'time';

export interface VisualGroup {
  count: number;
  itemEmoji: string;
  label: string;
}

export interface Question {
  id: string;
  operation: MathOperation;
  operandA: number;
  operandB: number;
  prompt: string;
  correctAnswer: number | string;
  choices: (number | string)[];
  level: number;
  topicTitle?: string;
  groupA?: VisualGroup;
  groupB?: VisualGroup;
  operatorSymbol?: string;
  questionIndex?: number;
  totalQuestions?: number;
}

export interface ExamQuestionResult {
  questionNumber: number;
  questionId: string;
  prompt?: string;
  studentAnswer: number | string;
  correctAnswer: number | string;
  isCorrect: boolean;
}

export interface ExamRecord {
  examId: string;
  studentId: string;
  topic: MathOperation;
  level: number;
  startedAt: string;
  completedAt: string;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  score: number;
  percentage: number;
  questionResults: ExamQuestionResult[];
}

export interface BackupData {
  app: 'jom-belajar-matematik';
  version: number;
  exportedAt: string;
  student: StudentProfile;
  examRecords: ExamRecord[];
}

