/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentProfile, ExamRecord, BackupData, MathOperation } from '../types';

const STORAGE_KEYS = {
  STUDENT_PROFILE: 'jom-belajar-matematik:student-profile',
  EXAM_RECORDS: 'jom-belajar-matematik:exam-records',
  SETTINGS: 'jom-belajar-matematik:settings',
};

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  studentId: 'student-syifa-001',
  fullName: 'Noor Syifa Afiyah',
  displayName: 'Syifa',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-08-15T00:00:00.000Z',
};

// IndexedDB Helper
const DB_NAME = 'JomBelajarMatematikDB';
const DB_VERSION = 1;

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('students')) {
          db.createObjectStore('students', { keyPath: 'studentId' });
        }
        if (!db.objectStoreNames.contains('examRecords')) {
          db.createObjectStore('examRecords', { keyPath: 'examId' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

/**
 * Get active student profile.
 */
export function getStudentProfile(): StudentProfile {
  if (typeof window === 'undefined') return DEFAULT_STUDENT_PROFILE;

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
    if (!raw) {
      saveStudentProfile(DEFAULT_STUDENT_PROFILE);
      return DEFAULT_STUDENT_PROFILE;
    }

    const parsed = JSON.parse(raw);
    let profile: StudentProfile = {
      studentId: parsed.studentId || DEFAULT_STUDENT_PROFILE.studentId,
      fullName: parsed.fullName || DEFAULT_STUDENT_PROFILE.fullName,
      displayName: parsed.displayName || DEFAULT_STUDENT_PROFILE.displayName,
      createdAt: parsed.createdAt || DEFAULT_STUDENT_PROFILE.createdAt,
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      avatarSeed: parsed.avatarSeed,
    };

    if (!profile.displayName || !profile.displayName.trim()) {
      profile = {
        ...profile,
        displayName: DEFAULT_STUDENT_PROFILE.displayName,
        updatedAt: new Date().toISOString(),
      };
      saveStudentProfile(profile);
    }

    return profile;
  } catch (err) {
    console.warn('[StorageService] Error loading profile, using default:', err);
    return DEFAULT_STUDENT_PROFILE;
  }
}

export interface UpdateNameResult {
  success: boolean;
  message: string;
  profile?: StudentProfile;
}

/**
 * Update the single active student display name safely with trimming, 50-char limit, and validation.
 */
export function updateStudentDisplayName(newName: string): UpdateNameResult {
  const trimmed = (newName || '').trim();
  if (!trimmed) {
    return {
      success: false,
      message: 'Sila masukkan nama murid.',
    };
  }

  // Max 50 characters as recommended in Sprint 11 Section 4
  const sanitizedName = trimmed.slice(0, 50);
  const current = getStudentProfile();
  const updated: StudentProfile = {
    ...current,
    displayName: sanitizedName,
    fullName: current.fullName || sanitizedName,
    updatedAt: new Date().toISOString(),
  };

  saveStudentProfile(updated);

  return {
    success: true,
    message: '✓ Nama berjaya disimpan!',
    profile: updated,
  };
}

/**
 * Save student profile to localStorage and sync to IndexedDB.
 */
export function saveStudentProfile(profile: StudentProfile): void {
  if (typeof window === 'undefined') return;

  try {
    const updated = {
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(updated));

    // Sync async to IndexedDB
    openDatabase().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction('students', 'readwrite');
        const store = tx.objectStore('students');
        store.put(updated);
      } catch (e) {
        console.warn('[StorageService] IDB student sync warning:', e);
      }
    });
  } catch (err) {
    console.error('[StorageService] Error saving profile:', err);
  }
}

/**
 * Get all exam records sorted newest first.
 */
export function getAllExamRecords(): ExamRecord[] {
  if (typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.EXAM_RECORDS);
    if (!raw) return [];

    const list: ExamRecord[] = JSON.parse(raw);
    if (!Array.isArray(list)) return [];

    return list.sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );
  } catch (err) {
    console.warn('[StorageService] Error loading exam records:', err);
    return [];
  }
}

/**
 * Save an exam record (preventing double saves by examId).
 */
export function saveExamRecord(record: ExamRecord): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getAllExamRecords();
    const exists = current.some((r) => r.examId === record.examId);
    if (exists) {
      console.warn(`[StorageService] Exam ${record.examId} already saved, skipping duplicate.`);
      return;
    }

    const updated = [record, ...current];
    localStorage.setItem(STORAGE_KEYS.EXAM_RECORDS, JSON.stringify(updated));

    // Sync async to IndexedDB
    openDatabase().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction('examRecords', 'readwrite');
        const store = tx.objectStore('examRecords');
        store.put(record);
      } catch (e) {
        console.warn('[StorageService] IDB exam record sync warning:', e);
      }
    });
  } catch (err) {
    console.error('[StorageService] Error saving exam record:', err);
  }
}

/**
 * Delete an exam record by examId.
 */
export function deleteExamRecord(examId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const current = getAllExamRecords();
    const filtered = current.filter((r) => r.examId !== examId);
    localStorage.setItem(STORAGE_KEYS.EXAM_RECORDS, JSON.stringify(filtered));

    openDatabase().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction('examRecords', 'readwrite');
        const store = tx.objectStore('examRecords');
        store.delete(examId);
      } catch (e) {
        console.warn('[StorageService] IDB delete record warning:', e);
      }
    });
  } catch (err) {
    console.error('[StorageService] Error deleting exam record:', err);
  }
}

/**
 * Clear all stored records and reset student profile.
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEYS.EXAM_RECORDS);
    localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(DEFAULT_STUDENT_PROFILE));

    openDatabase().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction(['students', 'examRecords'], 'readwrite');
        tx.objectStore('examRecords').clear();
        tx.objectStore('students').put(DEFAULT_STUDENT_PROFILE);
      } catch (e) {
        console.warn('[StorageService] IDB clear warning:', e);
      }
    });
  } catch (err) {
    console.error('[StorageService] Error clearing all data:', err);
  }
}

/**
 * Export backup data structure.
 */
export function exportBackupData(): BackupData {
  return {
    app: 'jom-belajar-matematik',
    version: 1,
    exportedAt: new Date().toISOString(),
    student: getStudentProfile(),
    examRecords: getAllExamRecords(),
  };
}

/**
 * Download backup as a JSON file.
 */
export function downloadBackupJsonFile(): void {
  if (typeof window === 'undefined') return;

  const data = exportBackupData();
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `jom-belajar-matematik-backup-${dateStr}.json`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  success: boolean;
  message: string;
  recordCount?: number;
}

/**
 * Validate and import backup JSON data safely.
 */
export function importBackupData(rawContent: string | object): ImportResult {
  try {
    let parsed: any;
    if (typeof rawContent === 'string') {
      try {
        parsed = JSON.parse(rawContent);
      } catch {
        return {
          success: false,
          message: 'Fail tidak sah atau format tidak dikenali (bukan JSON yang sah).',
        };
      }
    } else {
      parsed = rawContent;
    }

    if (!parsed || typeof parsed !== 'object') {
      return {
        success: false,
        message: 'Fail tidak sah atau format tidak dikenali.',
      };
    }

    // Schema Validation: Must have app identifier or valid records structure
    if (parsed.app !== 'jom-belajar-matematik' && !Array.isArray(parsed.examRecords)) {
      return {
        success: false,
        message: 'Fail tidak sah atau bukan fail sandaran rasmi JOM BELAJAR MATEMATIK.',
      };
    }

    // Import Student Profile safely
    if (parsed.student && typeof parsed.student === 'object') {
      const studentData: StudentProfile = {
        studentId: parsed.student.studentId || DEFAULT_STUDENT_PROFILE.studentId,
        fullName: parsed.student.fullName || DEFAULT_STUDENT_PROFILE.fullName,
        displayName: parsed.student.displayName || DEFAULT_STUDENT_PROFILE.displayName,
        createdAt: parsed.student.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        avatarSeed: parsed.student.avatarSeed,
      };

      if (!studentData.displayName || !studentData.displayName.trim()) {
        studentData.displayName = DEFAULT_STUDENT_PROFILE.displayName;
      }

      saveStudentProfile(studentData);
    }

    // Import Exam Records
    const recordsToImport: ExamRecord[] = [];
    if (Array.isArray(parsed.examRecords)) {
      for (const item of parsed.examRecords) {
        if (
          item &&
          typeof item === 'object' &&
          typeof item.examId === 'string' &&
          typeof item.score === 'number' &&
          typeof item.totalQuestions === 'number'
        ) {
          recordsToImport.push({
            examId: item.examId,
            studentId: item.studentId || DEFAULT_STUDENT_PROFILE.studentId,
            topic: (item.topic as MathOperation) || 'addition',
            level: Number(item.level) || 1,
            startedAt: item.startedAt || new Date().toISOString(),
            completedAt: item.completedAt || new Date().toISOString(),
            totalQuestions: item.totalQuestions || 10,
            correctCount: item.correctCount || item.score || 0,
            incorrectCount:
              typeof item.incorrectCount === 'number'
                ? item.incorrectCount
                : (item.totalQuestions || 10) - (item.score || 0),
            score: item.score || 0,
            percentage:
              typeof item.percentage === 'number'
                ? item.percentage
                : Math.round(((item.score || 0) / (item.totalQuestions || 10)) * 100),
            questionResults: Array.isArray(item.questionResults) ? item.questionResults : [],
          });
        }
      }
    }

    // Merge with existing records without duplicates
    const existing = getAllExamRecords();
    const existingIds = new Set(existing.map((r) => r.examId));
    const merged = [...existing];

    let newCount = 0;
    for (const rec of recordsToImport) {
      if (!existingIds.has(rec.examId)) {
        merged.push(rec);
        existingIds.add(rec.examId);
        newCount++;
      }
    }

    merged.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
    localStorage.setItem(STORAGE_KEYS.EXAM_RECORDS, JSON.stringify(merged));

    return {
      success: true,
      message: `Data berjaya diimport! ${newCount} rekod ujian baharu dimasukkan (Jumlah keseluruhan: ${merged.length}).`,
      recordCount: merged.length,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Ralat semasa memproses fail: ${err?.message || 'Fail rosak.'}`,
    };
  }
}
