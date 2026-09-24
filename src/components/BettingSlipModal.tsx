import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Share2, Copy, Check, Download, Sparkles, Trophy, Clock, Target, CheckCircle2, XCircle } from 'lucide-react';
import domtoimage from 'dom-to-image';

interface QuestionHistoryItem {
  id: string;
  category: string;
  questionText: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  rewardKsh: number;
  timestamp: string;
}

interface BettingSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  playerName: string;
  category: string;
  mode: string;
  questionsCorrect: number;
  totalQuestions: number;
  winnings: number;
  stake: number;
  timestamp: string;
  questions?: QuestionHistoryItem[];
  theme?: 'dark' | 'light';
}

export const BettingSlipModal: React.FC<BettingSlipModalProps> = ({
  isOpen,
  onClose,
  playerName,
  category,
  mode,
  questionsCorrect,
  totalQuestions,
  winnings,
  stake,
  timestamp,
  questions = [],
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const slipRef = useRef<HTMLDivElement>(null);

  // Build share text with question history
  let shareText = `🎯 TrivQuest Betting Slip\n\n👤 Player: ${playerName}\n🏆 Category: ${category}\n⚡ Mode: ${mode}\n📊 Score: ${questionsCorrect}/${totalQuestions}\n💰 Stake: KES ${stake}\n🎁 Winnings: KES ${winnings}\n🕐 ${timestamp}\n`;

  if (questions.length > 0) {
    shareText += `\n📝 Question History:\n`;
    questions.forEach((q, index) => {
      const status = q.isCorrect ? '✅' : '❌';
      shareText += `${status} Q${index + 1}: ${q.questionText.substring(0, 50)}...\n`;
    });
  }

  shareText += `\nPlay on TrivQuest!`;

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'TrivQuest Betting Slip',
          text: shareText,
        });
      } catch (error) {
        console.error('Failed to share:', error);
      }
    } else {
      handleCopyToClipboard();
    }
  };

  const handleDownloadImage = async () => {
    if (!slipRef.current) return;
    
    setDownloading(true);
    try {
      const dataUrl = await domtoimage.toPng(slipRef.current, {
        width: slipRef.current.offsetWidth * 2,
        height: slipRef.current.offsetHeight * 2,
        style: {
          transform: 'scale(2)',
          transformOrigin: 'top left',
        },
        quality: 1,
      });
      
      const link = document.createElement('a');
      link.download = `trivquest-betting-slip-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const accuracy = totalQuestions > 0 ? Math.round((questionsCorrect / totalQuestions) * 100) : 0;
  const isWin = winnings > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`relative w-full max-w-md rounded-2xl border ${
              isDark
                ? 'bg-[#0B0E14] border-[#222C3E] text-white'
                : 'bg-white border-slate-200 text-slate-900'
            } shadow-2xl flex flex-col max-h-[90vh]`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-4 border-b ${isDark ? 'border-[#222C3E]' : 'border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                  }`}>
                    <Trophy className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
                  </div>
                  <div>
                    <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Betting Slip
                    </h3>
                    <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Share your results
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Betting Slip Content */}
            <div ref={slipRef} className={`p-6 space-y-4 flex-1 overflow-y-auto ${isDark ? 'bg-[#0a0f16]' : 'bg-slate-50'}`}>
              {/* Result Badge */}
              <div className={`text-center py-3 rounded-xl ${
                isWin
                  ? 'bg-emerald-500/10 border border-emerald-500/30'
                  : 'bg-red-500/10 border border-red-500/30'
              }`}>
                <div className={`text-2xl font-bold ${isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isWin ? '🎉 YOU WON!' : '😢 GAME OVER'}
                </div>
                <div className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {isWin ? `KES ${winnings}` : 'Better luck next time!'}
                </div>
              </div>

              {/* Stats Grid */}
              <div className={`grid grid-cols-2 gap-3 p-4 rounded-xl ${
                isDark ? 'bg-[#0E121B] border border-[#222C3E]' : 'bg-white border border-slate-200'
              }`}>
                <div className="space-y-1">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    Player
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {playerName}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    Category
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {category}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    Mode
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {mode}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    Accuracy
                  </div>
                  <div className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {accuracy}%
                  </div>
                </div>
              </div>

              {/* Score Details */}
              <div className={`flex items-center justify-between p-4 rounded-xl ${
                isDark ? 'bg-[#0E121B] border border-[#222C3E]' : 'bg-white border border-slate-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-blue-500/20' : 'bg-blue-100'
                  }`}>
                    <Target className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Score
                    </div>
                    <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {questionsCorrect}/{totalQuestions}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Stake
                  </div>
                  <div className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    KES {stake}
                  </div>
                </div>
              </div>

              {/* Timestamp */}
              <div className={`flex items-center gap-2 text-xs ${
                isDark ? 'text-slate-500' : 'text-slate-500'
              }`}>
                <Clock className="w-3 h-3" />
                <span>{timestamp}</span>
              </div>

              {/* Question History */}
              {questions.length > 0 && (
                <div className={`p-4 rounded-xl ${
                  isDark ? 'bg-[#0E121B] border border-[#222C3E]' : 'bg-white border border-slate-200'
                }`}>
                  <div className={`text-xs font-semibold uppercase tracking-wider mb-3 ${
                    isDark ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    Recent Question Audits ({questions.length})
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {questions.map((q, index) => (
                      <div
                        key={q.id}
                        className={`p-3 rounded-lg border ${
                          isDark ? 'bg-[#0a0f16] border-[#222C3E]' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            q.isCorrect
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {q.isCorrect ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <XCircle className="w-3 h-3" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-medium truncate ${
                              isDark ? 'text-white' : 'text-slate-900'
                            }`}>
                              Q{index + 1}: {q.questionText}
                            </div>
                            <div className={`text-xs mt-1 ${
                              isDark ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              <span className={q.isCorrect ? 'text-emerald-400' : 'text-red-400'}>
                                Your answer: {q.userAnswer}
                              </span>
                              {!q.isCorrect && (
                                <span className={`ml-2 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                                  → Correct: {q.correctAnswer}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className={`p-4 border-t ${isDark ? 'border-[#222C3E]' : 'border-slate-200'} space-y-2`}>
              <button
                onClick={handleDownloadImage}
                disabled={downloading}
                className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  downloading
                    ? 'bg-slate-500 cursor-not-allowed text-white'
                    : isDark
                    ? 'bg-[#0E121B] hover:bg-[#141A26] border border-[#222C3E] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900'
                }`}
              >
                {downloading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Download Image
                  </>
                )}
              </button>
              <button
                onClick={handleShare}
                className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isDark
                    ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
                }`}
              >
                <Share2 className="w-4 h-4" />
                Share Betting Slip
              </button>
              <button
                onClick={handleCopyToClipboard}
                className={`w-full py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                  isDark
                    ? 'bg-[#0E121B] hover:bg-[#141A26] border border-[#222C3E] text-white'
                    : 'bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    Copied to Clipboard!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>

            {/* Branding */}
            <div className={`px-4 py-3 text-center border-t ${
              isDark ? 'border-[#222C3E] bg-[#0a0f16]' : 'border-slate-200 bg-slate-50'
            }`}>
              <div className={`flex items-center justify-center gap-2 text-xs ${
                isDark ? 'text-slate-500' : 'text-slate-600'
              }`}>
                <Sparkles className="w-3 h-3" />
                <span>Powered by TrivQuest</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
