import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bot, Zap, Cpu, Play, CheckCircle2, Sliders, Shield, Sparkles } from 'lucide-react';

interface BotTraderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRunBotRound?: () => void;
  theme?: 'dark' | 'light';
}

export const BotTraderModal: React.FC<BotTraderModalProps> = ({
  isOpen,
  onClose,
  onRunBotRound,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [botAggressiveness, setBotAggressiveness] = useState<'conservative' | 'balanced' | 'turbo'>('balanced');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResults, setSimResults] = useState<{ wins: number; profit: number } | null>(null);

  const runSimulation = () => {
    setIsSimulating(true);
    setSimResults(null);
    setTimeout(() => {
      setIsSimulating(false);
      setSimResults({
        wins: botAggressiveness === 'turbo' ? 8 : botAggressiveness === 'balanced' ? 6 : 5,
        profit: botAggressiveness === 'turbo' ? 140 : botAggressiveness === 'balanced' ? 85 : 45,
      });
    }, 1200);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ duration: 0.2 }}
            className={`relative z-10 w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
              isDark ? 'bg-[#121927] border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Header */}
            <div className={`p-4 sm:p-5 flex items-center justify-between border-b ${
              isDark ? 'border-slate-800 bg-[#0b101b]' : 'border-slate-100 bg-slate-50'
            }`}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#0070f3] text-white flex items-center justify-center shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold text-base sm:text-lg leading-tight ${
                    isDark ? 'text-slate-100' : 'text-slate-900'
                  }`}>AI Trivia Assistant</h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>Algorithmic fast-execution & trivia hints</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6 space-y-4">
              <div>
                <label className={`block text-xs font-bold mb-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  Risk & Speed Execution Strategy
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['conservative', 'balanced', 'turbo'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setBotAggressiveness(mode)}
                      className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                        botAggressiveness === mode
                          ? 'bg-[#0070f3] text-white border-[#0070f3] shadow-md font-bold'
                          : isDark ? 'bg-[#151d2c] border-slate-800 text-slate-400 hover:text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="text-xs capitalize font-bold">{mode}</div>
                      <div className="text-[10px] mt-0.5 opacity-80">
                        {mode === 'conservative' ? '92% Safety' : mode === 'balanced' ? 'Balanced' : 'High Yield'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bot Simulation Feedback */}
              <div className={`p-4 rounded-xl border ${
                isDark ? 'bg-[#0b101b] border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className={`font-bold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Signal Engine Accuracy</span>
                  <span className="font-extrabold text-emerald-500">89.4%</span>
                </div>
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                  <div className="bg-[#0070f3] h-full w-[89.4%]" />
                </div>
              </div>

              {simResults && (
                <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${
                  isDark ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-emerald-50 border-emerald-300 text-emerald-800'
                }`}>
                  <span>Simulation Complete: {simResults.wins}/10 Correct</span>
                  <span className="text-sm">+KSh {simResults.profit} Yield</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex items-center justify-between ${
              isDark ? 'border-slate-800 bg-[#0b101b]' : 'border-slate-100 bg-slate-50'
            }`}>
              <button
                onClick={runSimulation}
                disabled={isSimulating}
                className={`py-2.5 px-4 rounded-xl border font-bold text-xs cursor-pointer transition-colors ${
                  isDark
                    ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200'
                    : 'border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                {isSimulating ? 'Analyzing...' : 'Run Simulation'}
              </button>

              <button
                onClick={() => {
                  if (onRunBotRound) onRunBotRound();
                  onClose();
                }}
                className="py-2.5 px-5 rounded-xl bg-[#0070f3] hover:bg-[#0060df] text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-colors"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Launch Assistant Mode</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
