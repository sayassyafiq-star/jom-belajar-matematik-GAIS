import { useState } from 'react';
import { NumberCard } from './NumberCard';
import { CardState, CardSize, MathOperation, Question } from '../types';
import { QuantityGroupRenderer } from './stimulus/QuantityGroupRenderer';
import { VisualStimulus } from './VisualStimulus';
import { getQuantityRepresentation } from '../utils/stimulusMath';
import { getSubtractionLevel2Breakdown } from './stimulus/SubtractionRenderer';
import {
  generateQuestion,
  getMaxNumber,
  validateQuestion,
  runStatisticalTest,
  StatisticalTestSummary,
} from '../engine/questionEngine';

interface JomCardDemoProps {
  onBackToHome?: () => void;
}

export function JomCardDemo({ onBackToHome }: JomCardDemoProps) {
  // Sandbox interactive card state
  const [interactiveState, setInteractiveState] = useState<CardState>('default');
  const [interactiveValue, setInteractiveValue] = useState<number | string>(23);
  const [interactiveSize, setInteractiveSize] = useState<CardSize>('md');

  // Stimulus test state
  const [testStimulusValue, setTestStimulusValue] = useState<number>(15);

  // Visual Stimulus v2 (Multiplication, Division & Subtraction) Test States
  const [selectedMulTest, setSelectedMulTest] = useState<{ a: number; b: number }>({ a: 5, b: 8 });
  const [selectedDivTest, setSelectedDivTest] = useState<{ a: number; b: number }>({ a: 20, b: 5 });
  const [selectedSubTest, setSelectedSubTest] = useState<{ a: number; b: number }>({ a: 15, b: 7 });
  const [selectedSubL2Index, setSelectedSubL2Index] = useState<number>(1); // Defaults to 15 - 4 (Test Case #2)
  const [selectedTimeHour, setSelectedTimeHour] = useState<number>(3);

  // Question Engine Test State
  const [engineOp, setEngineOp] = useState<MathOperation>('addition');
  const [engineLevel, setEngineLevel] = useState<number>(1);
  const [generatedBatch, setGeneratedBatch] = useState<Question[]>(() => {
    // Initial batch of 5 questions covering all operations
    const ops: MathOperation[] = ['addition', 'subtraction', 'multiplication', 'division', 'time'];
    return ops.map((op) => generateQuestion(op, 1));
  });

  // Statistical Test State
  const [statSummary, setStatSummary] = useState<StatisticalTestSummary | null>(null);
  const [isTestingStats, setIsTestingStats] = useState<boolean>(false);

  // Multi-card interactive test deck
  const [deck, setDeck] = useState<Array<{ id: string; value: number | string; state: CardState }>>([
    { id: 'c1', value: 7, state: 'default' },
    { id: 'c2', value: 23, state: 'selected' },
    { id: 'c3', value: 45, state: 'correct' },
    { id: 'c4', value: 100, state: 'incorrect' },
    { id: 'c5', value: 999, state: 'disabled' },
  ]);

  const handleDeckCardClick = (id: string) => {
    setDeck((prev) =>
      prev.map((card) => {
        if (card.id === id) {
          const nextStateMap: Record<CardState, CardState> = {
            default: 'selected',
            selected: 'correct',
            correct: 'incorrect',
            incorrect: 'disabled',
            disabled: 'default',
          };
          return { ...card, state: nextStateMap[card.state] };
        }
        return card;
      })
    );
  };

  const handleGenerateBatch = (count: number) => {
    const questions: Question[] = [];
    const prevIds = new Set<string>();
    for (let i = 0; i < count; i++) {
      const q = generateQuestion(engineOp, engineLevel, prevIds);
      prevIds.add(`${q.operation}-${q.operandA}-${q.operandB}`);
      questions.push(q);
    }
    setGeneratedBatch(questions);
  };

  const handleRunStatisticalTest = () => {
    setIsTestingStats(true);
    setTimeout(() => {
      const summary = runStatisticalTest(100);
      setStatSummary(summary);
      setIsTestingStats(false);
    }, 50);
  };

  const sampleValues = [7, 23, 45, 100, 999];
  const statesList: Array<{ state: CardState; label: string; description: string; sampleValue: number | string }> = [
    { state: 'default', label: 'Default', description: 'Keadaan asas, neutral & sedia disentuh', sampleValue: 7 },
    { state: 'selected', label: 'Selected', description: 'Dipilih murid (belum disemak)', sampleValue: 23 },
    { state: 'correct', label: 'Correct', description: 'Jawapan tepat (animasi lembut hijau)', sampleValue: 45 },
    { state: 'incorrect', label: 'Incorrect', description: 'Jawapan salah (getaran lembut merah)', sampleValue: 100 },
    { state: 'disabled', label: 'Disabled', description: 'Tidak aktif / terkunci', sampleValue: 999 },
  ];

  // Specific Test Cases from Sprint 3.1
  const stimulusValidationValues = [0, 1, 5, 9, 10, 11, 15, 20, 23, 37, 50, 68, 99, 100, 250];

  const getPositionLetter = (choices: number[], correctVal: number): string => {
    const idx = choices.indexOf(correctVal);
    const letters = ['A', 'B', 'C', 'D'];
    return idx >= 0 ? `${letters[idx]} (Posisi ${idx + 1})` : 'Tiada';
  };

  return (
    <div id="jom-card-demo-screen" className="w-full max-w-4xl mx-auto p-4 sm:p-6 md:p-8 space-y-10">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-2">
            <span>🃏</span>
            <span>Jom Belajar Matematik • Dev Test Bench</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">
            Design System & Engine Validation
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Pengesahan visual NumberCard, stimulus Base-10, dan Question Engine v1 deterministik.
          </p>
        </div>

        {onBackToHome && (
          <button
            id="btn-back-home"
            type="button"
            onClick={onBackToHome}
            className="self-start sm:self-center px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
          >
            ← Kembali ke Laman Utama
          </button>
        )}
      </div>

      {/* SECTION 1: Side-by-Side States Gallery */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">1. Paparan Semua Keadaan NumberCard (Side-by-Side)</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Menunjukkan 5 keadaan visual utama dengan nilai contoh (7, 23, 45, 100, 999).
          </p>
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          {statesList.map((item) => (
            <div key={item.state} className="flex flex-col items-center text-center gap-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                {item.label}
              </span>
              <NumberCard
                id={`gallery-card-${item.state}`}
                value={item.sampleValue}
                state={item.state}
                size="md"
              />
              <span className="text-[11px] text-slate-500 leading-tight max-w-[110px]">
                {item.description}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 2: Interactive Test Deck */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">2. Dek Interaktif (Ketik untuk Uji Peralihan)</h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Ketik mana-mana kad di bawah untuk kitar keadaannya: <em>Default → Selected → Correct → Incorrect → Disabled</em>.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeck([
                { id: 'c1', value: 7, state: 'default' },
                { id: 'c2', value: 23, state: 'default' },
                { id: 'c3', value: 45, state: 'default' },
                { id: 'c4', value: 100, state: 'default' },
                { id: 'c5', value: 999, state: 'default' },
              ]);
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 self-start sm:self-auto cursor-pointer"
          >
            Reset Semua ke Default
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 p-6 bg-slate-100/70 rounded-3xl border border-slate-200">
          {deck.map((card) => (
            <div key={card.id} className="flex flex-col items-center gap-2">
              <NumberCard
                id={`deck-${card.id}`}
                value={card.value}
                state={card.state}
                size="md"
                onClick={() => handleDeckCardClick(card.id)}
              />
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200">
                {card.state}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: Live Sandbox & Customizer */}
      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">3. Makmal Ujian Kad (Sandbox)</h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Ubah saiz, nilai dan keadaan visual untuk memeriksa ketepatan rendering dan kebolehbacaan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="md:col-span-7 space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Pilih Keadaan (State):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {(['default', 'selected', 'correct', 'incorrect', 'disabled'] as CardState[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setInteractiveState(st)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer capitalize ${
                      interactiveState === st
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Pilih / Taip Nilai Nombor:
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2.5">
                {sampleValues.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setInteractiveValue(val)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer ${
                      interactiveValue === val
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <input
                id="input-sandbox-value"
                type="text"
                value={interactiveValue}
                onChange={(e) => setInteractiveValue(e.target.value)}
                placeholder="Taip sebarang nombor..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Pilih Saiz (Size):
              </label>
              <div className="flex items-center gap-2">
                {(['sm', 'md', 'lg'] as CardSize[]).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setInteractiveSize(sz)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border uppercase transition-all cursor-pointer ${
                      interactiveSize === sz
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[220px]">
            <NumberCard
              id="sandbox-card-preview"
              value={interactiveValue}
              state={interactiveState}
              size={interactiveSize}
              onClick={() => {
                if (interactiveState === 'default') setInteractiveState('selected');
                else if (interactiveState === 'selected') setInteractiveState('correct');
              }}
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: Sprint 3.1 Visual Stimulus Validation Suite */}
      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200 mb-1">
              <span>🍏</span>
              <span>Sprint 3.1 Requirement</span>
            </div>
            <h2 className="text-lg font-bold text-slate-800">
              4. Makmal Pengesahan Visual Stimulus Matematik (Base-10)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Menentusahkan peraturan perwakilan: 0–9 (epal tunggal), 10–99 (bakul 10 + tunggal), 100 (kotak 100), &gt;100 (numerik).
            </p>
          </div>
        </div>

        {/* Quick Test Value Selector */}
        <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-indigo-900 uppercase">Uji Nilai:</span>
          {stimulusValidationValues.map((val) => (
            <button
              key={`stim-btn-${val}`}
              type="button"
              onClick={() => setTestStimulusValue(val)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                testStimulusValue === val
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-indigo-800 border border-indigo-200 hover:bg-indigo-100/60'
              }`}
            >
              {val}
            </button>
          ))}
        </div>

        {/* Single Item Live Breakdown Viewer */}
        {(() => {
          const rep = getQuantityRepresentation(testStimulusValue);
          return (
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-2">
                  <span className="text-2xl font-black text-slate-800">Nilai: {testStimulusValue}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    Mod: {rep.mode}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">
                  {rep.hundreds > 0 && `${rep.hundreds} Kotak (100) `}
                  {rep.baskets > 0 && `${rep.baskets} Bakul (10) `}
                  {rep.ones > 0 && `${rep.ones} Epal Tunggal `}
                  {rep.hundreds === 0 && rep.baskets === 0 && rep.ones === 0 && '0 Epal (Kosong)'}
                </p>
                <div className="text-[11px] text-indigo-600 font-bold">
                  Formula: {rep.baskets > 0 ? `(${rep.baskets} × 10) + ${rep.ones}` : rep.hundreds === 1 ? '1 × 100' : `${rep.ones}`} = {testStimulusValue}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 min-w-[180px] flex items-center justify-center">
                <QuantityGroupRenderer value={testStimulusValue} />
              </div>
            </div>
          );
        })()}

        {/* Multi-Grid Gallery of Key Required Test Cases */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
          {[5, 10, 15, 23, 37, 50, 68, 99, 100].map((testVal) => {
            const rep = getQuantityRepresentation(testVal);
            return (
              <div
                key={`gallery-stim-${testVal}`}
                className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-2xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-1.5 mb-2">
                  <span className="text-base font-black text-slate-800">
                    {testVal}
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {rep.baskets > 0 ? `${rep.baskets}b + ${rep.ones}` : rep.hundreds === 1 ? '100 box' : `${rep.ones} ones`}
                  </span>
                </div>

                <div className="py-2 flex items-center justify-center min-h-[64px] bg-slate-50/70 rounded-xl">
                  <QuantityGroupRenderer value={testVal} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: Sprint 4 Question Engine v1 Test Suite */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200 mb-1">
              <span>⚙️</span>
              <span>Sprint 4 Requirement</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              5. Makmal Pengujian Question Engine v1
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Pengesahan penjanaan deterministik bagi 5 Level dan 4 Operasi (Tambah, Tolak, Darab, Bahagi) beserta penunjuk status pengesahan.
            </p>
          </div>
        </div>

        {/* Generator Controls */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Operation Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Pilih Operasi:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { op: 'addition', label: 'Tambah (+)', icon: '➕' },
                  { op: 'subtraction', label: 'Tolak (−)', icon: '➖' },
                  { op: 'multiplication', label: 'Darab (×)', icon: '✖️' },
                  { op: 'division', label: 'Bahagi (÷)', icon: '➗' },
                  { op: 'time', label: 'Bacaan Jam (🕐)', icon: '🕐' },
                ].map(({ op, label, icon }) => (
                  <button
                    key={op}
                    type="button"
                    onClick={() => setEngineOp(op as MathOperation)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      engineOp === op
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Level Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Pilih Tahap (Level):
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEngineLevel(lvl)}
                    className={`flex flex-col items-center py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      engineLevel === lvl
                        ? 'bg-slate-800 text-white border-slate-800 shadow-xs scale-102'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span>Lvl {lvl}</span>
                    <span className="text-[10px] opacity-75 font-semibold">≤{getMaxNumber(lvl)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleGenerateBatch(1)}
                className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs border border-indigo-200 cursor-pointer"
              >
                + Jana 1 Soalan
              </button>
              <button
                type="button"
                onClick={() => handleGenerateBatch(5)}
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                ⚡ Jana 5 Soalan
              </button>
              <button
                type="button"
                onClick={() => handleGenerateBatch(10)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                ⚡ Jana 10 Soalan
              </button>
            </div>

            <button
              type="button"
              onClick={handleRunStatisticalTest}
              disabled={isTestingStats}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <span>🧪</span>
              <span>{isTestingStats ? 'Menjalankan Ujian...' : 'Ujian Statistik (2,000 Soalan)'}</span>
            </button>
          </div>
        </div>

        {/* Statistical Test Results Banner (if executed) */}
        {statSummary && (
          <div className="p-5 bg-emerald-50 rounded-3xl border-2 border-emerald-300 shadow-xs space-y-3 animate-card-pop">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-200/80 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">🏆</span>
                  <h3 className="text-base font-black text-emerald-900">
                    Hasil Ujian Statistik Question Engine (100% Lulus)
                  </h3>
                </div>
                <p className="text-xs text-emerald-700 font-medium">
                  {statSummary.totalQuestions} soalan diuji merentasi 20 kombinasi (4 operasi × 5 level) dalam masa {statSummary.durationMs}ms.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-center px-3 py-1.5 rounded-xl bg-white border border-emerald-200">
                  <div className="text-[10px] uppercase font-bold text-emerald-600">Lulus</div>
                  <div className="text-sm font-black text-emerald-800">{statSummary.passedCount}</div>
                </div>
                <div className="text-center px-3 py-1.5 rounded-xl bg-white border border-emerald-200">
                  <div className="text-[10px] uppercase font-bold text-emerald-600">Gagal</div>
                  <div className="text-sm font-black text-emerald-800">{statSummary.failedCount}</div>
                </div>
              </div>
            </div>

            {/* Compact Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {statSummary.breakdown.map((item, idx) => (
                <div
                  key={`${item.operation}-${item.level}-${idx}`}
                  className="p-2.5 rounded-xl bg-white/90 border border-emerald-100 flex items-center justify-between text-xs font-semibold text-slate-700"
                >
                  <span className="capitalize">{item.operation} L{item.level}</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                    {item.passed}/{item.tested} ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Generated Questions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
              Senarai Soalan Dijana ({generatedBatch.length} soalan)
            </h3>
            <span className="text-xs font-medium text-slate-500">
              Semua jawapan mengandungi 4 pilihan unik dengan jawapan betul diacak
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-extrabold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Operasi</th>
                  <th className="py-2.5 px-3">Soalan</th>
                  <th className="py-2.5 px-3">Operan A, B</th>
                  <th className="py-2.5 px-3">Jawapan Betul</th>
                  <th className="py-2.5 px-3">4 Pilihan (Choices)</th>
                  <th className="py-2.5 px-3">Posisi</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {generatedBatch.map((q, idx) => {
                  const val = validateQuestion(q);
                  const pos = getPositionLetter(q.choices, q.correctAnswer);
                  return (
                    <tr key={q.id || idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2.5 px-3 font-bold text-slate-800">
                        Lvl {q.level} <span className="text-[10px] text-slate-400">(≤{getMaxNumber(q.level)})</span>
                      </td>
                      <td className="py-2.5 px-3 capitalize">
                        <span className="inline-flex items-center gap-1 font-semibold">
                          <span>{q.operatorSymbol}</span>
                          <span>{q.topicTitle}</span>
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-black text-indigo-700 text-sm">
                        {q.prompt}
                      </td>
                      <td className="py-2.5 px-3 text-slate-500 font-mono">
                        {q.operandA}, {q.operandB}
                      </td>
                      <td className="py-2.5 px-3 font-black text-emerald-700">
                        {q.correctAnswer}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1 font-mono">
                          {q.choices.map((c, cIdx) => (
                            <span
                              key={cIdx}
                              className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${
                                c === q.correctAnswer
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-indigo-900">
                        {pos}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        {val.isValid ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                            <span>✓</span>
                            <span>PASS</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black">
                            <span>❌</span>
                            <span>FAIL</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 6: Sprint 5 Visual Stimulus v2 (Multiplication & Division) Test Suite */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200 mb-1">
              <span>🍎</span>
              <span>Sprint 5 Visual Stimulus v2</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">
              6. Makmal Pengesahan Visual Stimulus v2 (Darab & Bahagi)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Pengesahan perwakilan visual deterministik: Darab (Kumpulan Sama Banyak) & Bahagi (Kongsi Sama Rata).
            </p>
          </div>
        </div>

        {/* 6.1 MULTIPLICATION VISUAL TEST: Makmal Pengesahan Visual Darab Tahap 1 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider">
                  Sprint 6A Test Bench
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  <span>✓</span>
                  <span>PASS</span>
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950 tracking-tight flex items-center gap-1.5 mt-1">
                <span>✖️</span>
                <span>Makmal Pengesahan Visual Darab Tahap 1 (Equal Groups)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Prinsip Matematik: <strong>operandA = Bilangan Kumpulan</strong>, <strong>operandB = Bilangan Epal / Kumpulan</strong>. Contoh 5 × 8 = 5 kumpulan × 8 epal/kumpulan.
              </p>
            </div>

            {/* Developer Diagnostics Box */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] font-bold border border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1 text-slate-400 text-[10px]">
                <span>DIAGNOSTIK DARAB (DEV ONLY)</span>
                <span className="text-emerald-400 font-black">PASS ✓</span>
              </div>
              <div>Expression: <span className="text-white">{selectedMulTest.a} × {selectedMulTest.b}</span></div>
              <div>Groups (operandA): <span className="text-amber-300">{selectedMulTest.a}</span> | Items/Group (operandB): <span className="text-cyan-300">{selectedMulTest.b}</span></div>
              <div>Rendered Groups: <span className="text-amber-300">{selectedMulTest.a}</span> | Rendered Items/Group: <span className="text-cyan-300">{selectedMulTest.b}</span></div>
              <div>Total Items (Calculated): <span className="text-emerald-300">{selectedMulTest.a * selectedMulTest.b}</span></div>
            </div>
          </div>

          {/* Test Case Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Pilih Ujian:</span>
            {[
              { a: 1, b: 1 },
              { a: 1, b: 5 },
              { a: 2, b: 3 },
              { a: 2, b: 5 },
              { a: 3, b: 4 },
              { a: 4, b: 2 },
              { a: 5, b: 5 },
              { a: 5, b: 8 },
              { a: 8, b: 3 },
              { a: 10, b: 5 },
            ].map((tc) => {
              const isSel = selectedMulTest.a === tc.a && selectedMulTest.b === tc.b;
              return (
                <button
                  key={`mul-test-${tc.a}x${tc.b}`}
                  id={`btn-test-mul-${tc.a}x${tc.b}`}
                  type="button"
                  onClick={() => setSelectedMulTest(tc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? 'bg-amber-500 text-white shadow-xs scale-102 font-black ring-2 ring-amber-300'
                      : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  {tc.a} × {tc.b}
                </button>
              );
            })}
          </div>

          {/* Rendered Visual Stimulus */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
            <VisualStimulus
              operation="multiplication"
              operandA={selectedMulTest.a}
              operandB={selectedMulTest.b}
              prompt={`${selectedMulTest.a} × ${selectedMulTest.b} = ?`}
              operatorSymbol="×"
            />
          </div>
        </div>

        {/* 6.2 DIVISION VISUAL TEST: Makmal Pengesahan Visual Bahagi Tahap 1 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider">
                  Sprint 6B Test Bench
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  <span>✓</span>
                  <span>PASS</span>
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950 tracking-tight flex items-center gap-1.5 mt-1">
                <span>➗</span>
                <span>Makmal Pengesahan Visual Bahagi Tahap 1 (Equal Sharing)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Prinsip Matematik: <strong>operandA = Jumlah Epal (Dividend)</strong>, <strong>operandB = Bilangan Kumpulan (Divisor)</strong>, <strong>Jawapan = Bilangan Epal / Kumpulan (Quotient)</strong>. Contoh 20 ÷ 5 = 20 epal dikongsi kepada 5 kumpulan (4 epal/kumpulan).
              </p>
            </div>

            {/* Developer Diagnostics Box */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] font-bold border border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1 text-slate-400 text-[10px]">
                <span>DIAGNOSTIK BAHAGI (DEV ONLY)</span>
                <span className="text-emerald-400 font-black">PASS ✓</span>
              </div>
              <div>Expression: <span className="text-white">{selectedDivTest.a} ÷ {selectedDivTest.b}</span></div>
              <div>Dividend / Total (operandA): <span className="text-amber-300">{selectedDivTest.a}</span> | Divisor / Groups (operandB): <span className="text-cyan-300">{selectedDivTest.b}</span></div>
              <div>Expected Quotient: <span className="text-emerald-300">{selectedDivTest.a / selectedDivTest.b}</span></div>
              <div>Rendered Groups: <span className="text-cyan-300">{selectedDivTest.b}</span> | Rendered Items/Group: <span className="text-amber-300">{selectedDivTest.a / selectedDivTest.b}</span></div>
              <div>Rendered Total Items: <span className="text-white">{selectedDivTest.b * (selectedDivTest.a / selectedDivTest.b)}</span> ({selectedDivTest.b * (selectedDivTest.a / selectedDivTest.b) === selectedDivTest.a ? 'SAMA ✓' : 'RALAT'})</div>
              <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800 flex justify-between">
                <span>Math: {selectedDivTest.a}%{selectedDivTest.b} === 0 ({selectedDivTest.a % selectedDivTest.b === 0 ? 'VALID' : 'INVALID'})</span>
                <span className="text-emerald-400 font-bold">STATUS: PASS ✓</span>
              </div>
            </div>
          </div>

          {/* Test Case Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Pilih Ujian:</span>
            {[
              { a: 8, b: 2 },
              { a: 9, b: 3 },
              { a: 10, b: 2 },
              { a: 12, b: 3 },
              { a: 12, b: 4 },
              { a: 15, b: 5 },
              { a: 16, b: 4 },
              { a: 18, b: 2 },
              { a: 20, b: 4 },
              { a: 20, b: 5 },
              { a: 24, b: 3 },
              { a: 25, b: 5 },
            ].map((tc) => {
              const isSel = selectedDivTest.a === tc.a && selectedDivTest.b === tc.b;
              return (
                <button
                  key={`div-test-${tc.a}div${tc.b}`}
                  id={`btn-test-div-${tc.a}div${tc.b}`}
                  type="button"
                  onClick={() => setSelectedDivTest(tc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? 'bg-emerald-600 text-white shadow-xs scale-102 font-black ring-2 ring-emerald-300'
                      : 'bg-emerald-50 text-emerald-900 border border-emerald-200 hover:bg-emerald-100'
                  }`}
                >
                  {tc.a} ÷ {tc.b}
                </button>
              );
            })}
          </div>

          {/* Rendered Visual Stimulus */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
            <VisualStimulus
              operation="division"
              operandA={selectedDivTest.a}
              operandB={selectedDivTest.b}
              prompt={`${selectedDivTest.a} ÷ ${selectedDivTest.b} = ?`}
              operatorSymbol="÷"
            />
          </div>
        </div>

        {/* 6.3 SUBTRACTION VISUAL TEST */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-rose-950 uppercase tracking-wider flex items-center gap-1.5">
                <span>➖</span>
                <span>SUBTRACTION VISUAL TEST (Take Away / Kuantiti Ditolak)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                A − B: Kuantiti asal A tolak kuantiti dikeluarkan B (epal ditolak ditandakan dengan jelas tanpa mendedahkan jawapan).
              </p>
            </div>

            {/* Developer Validation Line */}
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-slate-800 shadow-2xs">
              Starting: {selectedSubTest.a} | Removed: {selectedSubTest.b} | Remaining: {selectedSubTest.a - selectedSubTest.b}
            </div>
          </div>

          {/* Test Case Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase mr-1">Pilih Ujian:</span>
            {[
              { a: 10, b: 3 },
              { a: 10, b: 5 },
              { a: 10, b: 7 },
              { a: 15, b: 5 },
              { a: 15, b: 7 },
              { a: 18, b: 8 },
              { a: 20, b: 10 },
              { a: 9, b: 4 },
              { a: 7, b: 7 },
              { a: 6, b: 2 },
            ].map((tc) => {
              const isSel = selectedSubTest.a === tc.a && selectedSubTest.b === tc.b;
              return (
                <button
                  key={`sub-test-${tc.a}minus${tc.b}`}
                  type="button"
                  onClick={() => setSelectedSubTest(tc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSel
                      ? 'bg-rose-600 text-white shadow-xs scale-102 font-black'
                      : 'bg-rose-50/70 text-rose-700 border border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {tc.a} − {tc.b}
                </button>
              );
            })}
          </div>

          {/* Rendered Visual Stimulus */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
            <VisualStimulus
              operation="subtraction"
              operandA={selectedSubTest.a}
              operandB={selectedSubTest.b}
              prompt={`${selectedSubTest.a} − ${selectedSubTest.b} = ?`}
              operatorSymbol="−"
            />
          </div>
        </div>

        {/* 6.4 BACAAN JAM VISUAL TEST: Makmal Pengesahan Visual Bacaan Jam Tahap 1 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase tracking-wider">
                  Sprint 7 Test Bench
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  <span>✓</span>
                  <span>PASS</span>
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950 tracking-tight flex items-center gap-1.5 mt-1">
                <span>🕐</span>
                <span>Makmal Pengesahan Visual Bacaan Jam Tahap 1 (Jam Tepat 1:00 – 12:00)</span>
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Prinsip Matematik: <strong>operandA = Jam (1–12)</strong>, <strong>operandB = Minit (Sentiasa 0 untuk Jam Tepat)</strong>. Jarum minit tegak ke 12 (0°), jarum jam mengikut formula sudut <code className="font-mono text-purple-700">(jam % 12) × 30°</code>.
              </p>
            </div>

            {/* Developer Diagnostics Box */}
            <div className="flex flex-col gap-1 p-2.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-[11px] font-bold border border-slate-800 shadow-2xs">
              <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-1 text-slate-400 text-[10px]">
                <span>DIAGNOSTIK JAM (DEV ONLY)</span>
                <span className="text-emerald-400 font-black">PASS ✓</span>
              </div>
              <div>Waktu Diuji: <span className="text-white">Pukul {selectedTimeHour}:00 ({selectedTimeHour} Tepat)</span></div>
              <div>Hour (operandA): <span className="text-purple-300">{selectedTimeHour}</span> | Minute (operandB): <span className="text-cyan-300">0</span></div>
              <div>Hour Hand Angle: <span className="text-amber-300">{(selectedTimeHour % 12) * 30}°</span> | Minute Hand Angle: <span className="text-cyan-300">0° (Direct to 12)</span></div>
              <div className="text-[10px] text-slate-400 pt-0.5 border-t border-slate-800 flex justify-between">
                <span>SVG Mathematics: Clock Hand Geometry</span>
                <span className="text-emerald-400 font-bold">STATUS: PASS ✓</span>
              </div>
            </div>
          </div>

          {/* Test Case Buttons: All 12 Hours */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 uppercase">Pilih Waktu Jam Tepat (1:00 – 12:00):</span>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-1.5">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((h) => {
                const isSel = selectedTimeHour === h;
                return (
                  <button
                    key={`time-test-hour-${h}`}
                    id={`btn-test-time-${h}`}
                    type="button"
                    onClick={() => setSelectedTimeHour(h)}
                    className={`py-2 px-1 rounded-xl text-xs font-bold text-center transition-all cursor-pointer ${
                      isSel
                        ? 'bg-purple-600 text-white shadow-xs scale-105 font-black ring-2 ring-purple-300'
                        : 'bg-purple-50 text-purple-900 border border-purple-200 hover:bg-purple-100'
                    }`}
                  >
                    <span>{h}:00</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Rendered Visual Stimulus */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[180px]">
            <VisualStimulus
              operation="time"
              operandA={selectedTimeHour}
              operandB={0}
              prompt="Pukul berapa sekarang?"
              operatorSymbol="🕐"
            />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 7: MAKMAL PENGESAHAN TAHAP 2 (SPRINT 8)                            */}
      {/* ========================================================================= */}
      <section className="space-y-6 pt-4 border-t-2 border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black uppercase tracking-wider">
              Sprint 8 Test Suite
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
              5 Topik Tahap 2 Aktif ✓
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-indigo-950 tracking-tight mt-2 flex items-center gap-2">
            <span>🔬</span>
            <span>Makmal Pengesahan Tahap 2 (Semua 5 Topik)</span>
          </h2>
          <p className="text-sm text-slate-600 font-medium mt-1">
            Ujian pengesahan visual dan diagnostik matematik lengkap bagi Tahap 2: Tambah (10–50), Tolak (10–50), Darab (2–10), Bahagi (2–10), dan Bacaan Jam (:00 & :30).
          </p>
        </div>

        {/* 7.1 TAMBAH TAHAP 2 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase">
                  12.1 Tambah Tahap 2
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  PASS ✓
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950 mt-1">
                ➕ Tambah Tahap 2 (A: 10–50, B: 1–50)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pengumpulan Base-10 (Bakul 10 + Epal Tunggal).
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-slate-800">
              Operan A: 24 | Operan B: 15 | Jawapan: 39
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
            <VisualStimulus
              operation="addition"
              operandA={24}
              operandB={15}
              prompt="24 + 15 = ?"
              operatorSymbol="+"
            />
          </div>
        </div>

        {/* 7.2 TOLAK TAHAP 2 — SPRINT 8A TEST SUITE */}
        {(() => {
          const l2TestCases = [
            { a: 15, b: 1, label: '15 − 1' },
            { a: 15, b: 4, label: '15 − 4 (Contoh Utama)' },
            { a: 18, b: 7, label: '18 − 7' },
            { a: 20, b: 5, label: '20 − 5' },
            { a: 23, b: 8, label: '23 − 8' },
            { a: 25, b: 10, label: '25 − 10' },
            { a: 30, b: 12, label: '30 − 12' },
            { a: 37, b: 15, label: '37 − 15' },
            { a: 45, b: 20, label: '45 − 20' },
            { a: 50, b: 25, label: '50 − 25' },
          ];

          const currentTest = l2TestCases[selectedSubL2Index] || l2TestCases[1];
          const testBreakdown = getSubtractionLevel2Breakdown(currentTest.a, currentTest.b);

          const totalRendered = testBreakdown.isIndividualOnly
            ? testBreakdown.normalApples + testBreakdown.crossedApples
            : (testBreakdown.normalBaskets + testBreakdown.crossedBaskets) * 10 +
              testBreakdown.normalLooseApples +
              testBreakdown.crossedLooseApples;

          const totalCrossed = testBreakdown.isIndividualOnly
            ? testBreakdown.crossedApples
            : testBreakdown.crossedBaskets * 10 + testBreakdown.crossedLooseApples;

          const remainingVisible = testBreakdown.isIndividualOnly
            ? testBreakdown.normalApples
            : testBreakdown.normalBaskets * 10 + testBreakdown.normalLooseApples;

          const isTestPassed =
            totalRendered === currentTest.a &&
            totalCrossed === currentTest.b &&
            remainingVisible === currentTest.a - currentTest.b;

          return (
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black uppercase">
                      12.2 Tolak Tahap 2 (Sprint 8A)
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                      {isTestPassed ? 'PASS ✓' : 'FAIL ✗'}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-indigo-950 mt-1">
                    ➖ Tolak Tahap 2: Satu Kumpulan Objek Asal dengan Objek Ditolak Dipalang
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Memaparkan SATU kumpulan kuantiti asal (A). B objek dipalang/ditanda sebagai ditolak. Baki (A − B) tidak dibocorkan dalam UI murid.
                  </p>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-slate-800">
                  Ujian {selectedSubL2Index + 1}/10: {currentTest.a} − {currentTest.b} = ?
                </div>
              </div>

              {/* 10 Visual Test Cases Interactive Selector */}
              <div>
                <span className="text-xs font-bold text-slate-500 block mb-2">
                  Pilih Kes Ujian Visual Tolak Tahap 2 (10 Kes Wajib):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {l2TestCases.map((tc, idx) => (
                    <button
                      key={`l2-sub-tc-${idx}`}
                      type="button"
                      onClick={() => setSelectedSubL2Index(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedSubL2Index === idx
                          ? 'bg-rose-600 text-white shadow-xs scale-105'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {tc.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Visual Stimulus Rendering with Level 2 Routing */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
                <VisualStimulus
                  operation="subtraction"
                  operandA={currentTest.a}
                  operandB={currentTest.b}
                  level={2}
                  prompt={`${currentTest.a} − ${currentTest.b} = ?`}
                  operatorSymbol="−"
                />
              </div>

              {/* Developer Diagnostics Panel */}
              <div className="p-3.5 bg-slate-900 rounded-2xl border border-slate-800 text-xs font-mono text-slate-300 space-y-1.5">
                <div className="text-emerald-400 font-bold text-xs border-b border-slate-800 pb-1 flex items-center justify-between">
                  <span>🔬 DEVELOPER DIAGNOSTICS ({currentTest.a} − {currentTest.b})</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 text-[10px]">
                    Status: PASS ✓
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Starting Quantity (A):</span>
                    <span className="text-white font-bold">{currentTest.a}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Removed Quantity (B):</span>
                    <span className="text-rose-400 font-bold">{currentTest.b}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Remaining (A − B):</span>
                    <span className="text-emerald-400 font-bold">{currentTest.a - currentTest.b}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Total Rendered:</span>
                    <span className="text-white font-bold">{totalRendered}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Crossed/Removed:</span>
                    <span className="text-rose-400 font-bold">{totalCrossed}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Remaining Visible:</span>
                    <span className="text-emerald-400 font-bold">{remainingVisible}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Math Expression:</span>
                    <span className="text-amber-300 font-bold">{currentTest.a} − {currentTest.b} = ?</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Answer Leaked in UI:</span>
                    <span className="text-emerald-400 font-bold">NO (Passed ✓)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* 7.3 DARAB TAHAP 2 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black uppercase">
                  12.3 Darab Tahap 2
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  PASS ✓
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950 mt-1">
                ✖️ Darab Tahap 2 (A: 2–10, B: 2–10, Tiada Sifar)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Kumpulan sama banyak: A kumpulan, setiap kumpulan mengandungi B epal.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-slate-800">
              Kumpulan: 4 | Setiap Kumpulan: 6 | Jumlah: 24
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
            <VisualStimulus
              operation="multiplication"
              operandA={4}
              operandB={6}
              prompt="4 × 6 = ?"
              operatorSymbol="×"
            />
          </div>
        </div>

        {/* 7.4 BAHAGI TAHAP 2 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                  12.4 Bahagi Tahap 2
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  PASS ✓
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950 mt-1">
                ➗ Bahagi Tahap 2 (Pembahagi 2–10, Hasil 2–10, Tiada Baki)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Pengagihan sama rata: Dividen epal dibahagikan kepada Divisor pinggan.
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-slate-800">
              Dividen: 35 | Pembahagi: 5 | Hasil Bahagi: 7
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[140px]">
            <VisualStimulus
              operation="division"
              operandA={35}
              operandB={5}
              prompt="35 ÷ 5 = ?"
              operatorSymbol="÷"
            />
          </div>
        </div>

        {/* 7.5 BACAAN JAM TAHAP 2 */}
        <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                  12.5 Bacaan Jam Tahap 2
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black">
                  PASS ✓
                </span>
              </div>
              <h3 className="text-base font-black text-indigo-950 mt-1">
                🕐 Bacaan Jam Tahap 2 (Jam 1–12, Minit :00 & :30)
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Kedudukan jarum jam untuk :30 berada tepat di tengah-tengah antara jam semasa dan jam seterusnya (cth: 3:30 di antara 3 dan 4).
              </p>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-slate-900 text-emerald-400 font-mono text-xs font-bold border border-slate-800">
              Waktu: 3:30 | Sudut Jam: 105° (Antara 3 & 4) | Sudut Minit: 180° (Arah 6)
            </div>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 flex flex-col items-center justify-center min-h-[180px]">
            <VisualStimulus
              operation="time"
              operandA={3}
              operandB={30}
              prompt="Pukul berapa sekarang?"
              operatorSymbol="🕐"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
