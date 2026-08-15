/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, ChangeEvent } from 'react';
import {
  getStudentProfile,
  getAllExamRecords,
  updateStudentDisplayName,
  downloadBackupJsonFile,
  importBackupData,
  clearAllData,
  ImportResult,
} from '../services/storageService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataChanged?: () => void;
}

export function SettingsModal({ isOpen, onClose, onDataChanged }: SettingsModalProps) {
  const [studentNameInput, setStudentNameInput] = useState<string>('Syifa');
  const [confirmDelete, setConfirmDelete] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync active name from storage whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const current = getStudentProfile();
      setStudentNameInput(current.displayName || 'Syifa');
      setConfirmDelete(false);
      setStatusMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const student = getStudentProfile();
  const records = getAllExamRecords();

  const handleSaveName = () => {
    const trimmed = studentNameInput.trim();
    if (!trimmed) {
      setStatusMessage({
        type: 'error',
        text: 'Sila masukkan nama murid.',
      });
      return;
    }

    const result = updateStudentDisplayName(studentNameInput);
    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: '✓ Nama berjaya disimpan!',
      });
      if (result.profile) {
        setStudentNameInput(result.profile.displayName);
      }
      if (onDataChanged) {
        onDataChanged();
      }
    } else {
      setStatusMessage({
        type: 'error',
        text: result.message,
      });
    }
  };

  const handleExport = () => {
    try {
      downloadBackupJsonFile();
      setStatusMessage({
        type: 'success',
        text: 'Fail sandaran JSON berjaya dimuat turun!',
      });
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Gagal memuat turun fail sandaran.',
      });
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const result: ImportResult = importBackupData(content);
        if (result.success) {
          const updatedProfile = getStudentProfile();
          setStudentNameInput(updatedProfile.displayName);
          setStatusMessage({
            type: 'success',
            text: result.message,
          });
          if (onDataChanged) onDataChanged();
        } else {
          setStatusMessage({
            type: 'error',
            text: result.message,
          });
        }
      }
    };
    reader.onerror = () => {
      setStatusMessage({
        type: 'error',
        text: 'Gagal membaca fail yang dipilih.',
      });
    };
    reader.readAsText(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDeleteAll = () => {
    clearAllData();
    setConfirmDelete(false);
    const defaultProfile = getStudentProfile();
    setStudentNameInput(defaultProfile.displayName);
    setStatusMessage({
      type: 'success',
      text: 'Semua rekod ujian dan data tempatan telah dipadam.',
    });
    if (onDataChanged) onDataChanged();
  };

  return (
    <div
      id="settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        id="settings-modal-content"
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-slate-100 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl shadow-2xs">
              ⚙️
            </div>
            <div>
              <h2 className="text-lg font-black text-indigo-950">
                Tetapan
              </h2>
              <p className="text-xs text-slate-400 font-semibold">
                Profil & Pengurusan Data Tempatan
              </p>
            </div>
          </div>

          <button
            id="btn-close-settings"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold flex items-center justify-center cursor-pointer transition-all"
            aria-label="Tutup Tetapan"
          >
            ✕
          </button>
        </div>

        {/* Status Alert Banner */}
        {statusMessage && (
          <div
            id="settings-status-banner"
            className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
              statusMessage.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200 shadow-2xs'
                : 'bg-rose-50 text-rose-800 border-2 border-rose-200 shadow-2xs'
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-base">{statusMessage.type === 'success' ? '✅' : '⚠️'}</span>
              <span>{statusMessage.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="text-slate-400 hover:text-slate-700 ml-2 font-black cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* 1. SECTION: NAMA MURID (Sprint 11 Requirement) */}
        <section className="p-4 sm:p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100/80 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-indigo-900 block">
                Nama Murid
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Nama ini akan dipaparkan di skrin pembelajaran, ucapan dan laporan ujian.
              </span>
            </div>
            <span className="text-xs font-black text-indigo-600 bg-white px-2.5 py-1 rounded-full border border-indigo-100 shadow-2xs">
              1 Profil Aktif
            </span>
          </div>

          <div className="space-y-2">
            <label htmlFor="input-student-name" className="text-xs font-bold text-slate-700 block">
              Nama murid:
            </label>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
              <input
                id="input-student-name"
                type="text"
                value={studentNameInput}
                onChange={(e) => setStudentNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSaveName();
                  }
                }}
                maxLength={50}
                placeholder="Syifa"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none text-sm font-bold text-slate-800 placeholder-slate-400 transition-all shadow-2xs"
              />
              <button
                id="btn-save-student-name"
                type="button"
                onClick={handleSaveName}
                className="btn-tactile-primary px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-black text-xs sm:text-sm tracking-wide shadow-xs cursor-pointer select-none transition-all flex items-center justify-center gap-1.5"
              >
                <span>SIMPAN NAMA</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-semibold">
              Maksimum 50 aksara. Nama disimpan secara kekal pada peranti ini.
            </p>
          </div>
        </section>

        {/* 2. SECTION: STATISTIK & REKOD TEMPATAN */}
        <section className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs font-bold text-slate-600">
          <div className="flex items-center gap-2">
            <span className="text-base">📊</span>
            <span>Rekod Ujian Tersimpan:</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-white border border-slate-200 font-black text-indigo-900">
            {records.length} rekod
          </span>
        </section>

        {/* 3. SECTION: SANDARAN DATA (Backup & Restore) */}
        <section className="space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 block">
            Sandaran Data (Backup & Restore)
          </span>

          {/* Export JSON Button */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all flex items-center justify-between gap-3 bg-white">
            <div>
              <span className="text-xs sm:text-sm font-bold text-indigo-950 block">
                📤 Eksport Data (Backup)
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                Simpan semua profil & rekod ujian ke fail JSON.
              </span>
            </div>
            <button
              id="btn-export-backup"
              type="button"
              onClick={handleExport}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer transition-all shrink-0 shadow-2xs"
            >
              Muat Turun
            </button>
          </div>

          {/* Import JSON Button */}
          <div className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-indigo-200 transition-all flex items-center justify-between gap-3 bg-white">
            <div>
              <span className="text-xs sm:text-sm font-bold text-indigo-950 block">
                📥 Import Data (Restore)
              </span>
              <span className="text-[11px] text-slate-400 font-medium block">
                Pulihkan data daripada fail sandaran JSON rasmi.
              </span>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileSelect}
              className="hidden"
              id="input-file-backup"
            />

            <button
              id="btn-trigger-import"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs cursor-pointer transition-all shrink-0 shadow-2xs"
            >
              Pilih Fail
            </button>
          </div>
        </section>

        {/* 4. SECTION: PADAM DATA */}
        <section className="p-4 rounded-2xl border border-rose-200 bg-rose-50/40 space-y-2.5">
          <span className="text-xs font-black uppercase tracking-wider text-rose-800 block">
            Zon Bahaya (Padam Data)
          </span>
          <p className="text-xs text-slate-500 font-medium">
            Memadam semua sejarah ujian pada peranti ini secara kekal.
          </p>

          {confirmDelete ? (
            <div className="p-3 bg-white rounded-xl border border-rose-300 space-y-2">
              <p className="text-xs font-bold text-rose-900">
                Adakah anda pasti mahu memadam semua data?
              </p>
              <div className="flex items-center gap-2">
                <button
                  id="btn-cancel-delete"
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  BATAL
                </button>
                <button
                  id="btn-confirm-delete"
                  type="button"
                  onClick={handleDeleteAll}
                  className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer"
                >
                  PADAM DATA
                </button>
              </div>
            </div>
          ) : (
            <button
              id="btn-init-delete"
              type="button"
              onClick={() => setConfirmDelete(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-rose-300 text-rose-700 hover:bg-rose-100 font-bold text-xs cursor-pointer transition-all"
            >
              🗑️ Padam Semua Data
            </button>
          )}
        </section>

        {/* Footer & Back / Close Button */}
        <div className="pt-2 flex flex-col items-center gap-2">
          <button
            id="btn-back-settings"
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm cursor-pointer transition-all"
          >
            ← Kembali
          </button>
          <p className="text-[10px] font-semibold text-slate-400">
            Jom Belajar Matematik • Local-First Storage Engine
          </p>
        </div>
      </div>
    </div>
  );
}
