import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  Paperclip,
  X,
  AlertCircle,
  FileText,
  Heart,
  Moon,
  HelpCircle,
  Volume2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AIChatSheet() {
  const { isAIChatOpen, setIsAIChatOpen, documents, user } = useApp();

  const [messages, setMessages] = useState<
    { id: string; sender: 'user' | 'ai'; text: string; timestamp: string; suggestedQuestions?: string[] }[]
  >([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello ${user.name.split(' ')[0]} 🌸 I am your FemSphere Digital Health Twin AI. I analyze your multi-frequency wearables, cycle biomarkers, and medical records to provide proactive guidance. How can I assist your health journey today?`,
      timestamp: 'Just now',
      suggestedQuestions: [
        'Explain my metabolic panel report',
        'Why am I feeling tired today?',
        'Analyze my sleep architecture',
        'Prepare questions for Dr. Vance',
      ],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isAiThinking, setIsAiThinking] = useState(false);

  if (!isAIChatOpen) return null;

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg = {
      id: `usr_${Date.now()}`,
      sender: 'user' as const,
      text: query,
      timestamp: 'Just now',
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsAiThinking(true);

    // Smart simulated intelligent response generator based on user biometrics & context
    setTimeout(() => {
      let aiReply = '';
      const qLower = query.toLowerCase();

      if (qLower.includes('report') || qLower.includes('metabolic') || qLower.includes('lab')) {
        aiReply = `I reviewed your Comprehensive Metabolic Panel from Mercy Diagnostics (dated June 18). Your Hemoglobin is 13.4 g/dL and Fasting Glucose is 92 mg/dL, both within ideal reference ranges. Your Ferritin is at 38 ng/mL—healthy, but with your history of iron deficiency, continuing your chelated iron with Vitamin C is clinically recommended.`;
      } else if (qLower.includes('tired') || qLower.includes('fatigue')) {
        aiReply = `Based on your synchronized biometrics:
1. Deep sleep was 1h 22m last night (approx 15% lower than baseline).
2. You logged 5 out of 8 water glasses, indicating mild dehydration.
3. You are currently at Cycle Day 14 (Ovulation window), where basal metabolic temperature increases by ~0.3°C, often demanding slightly more carbohydrate fuel. Consider an electrolyte beverage and a 20-minute rest window.`;
      } else if (qLower.includes('sleep') || qLower.includes('architecture')) {
        aiReply = `Your overnight sleep duration was 7h 42m with an overall Sleep Score of 84/100.
• REM Sleep: 1h 38m (optimal for emotional memory processing)
• Deep Sleep: 1h 22m (cellular repair)
• Resting Heart Rate Dip: -8% from daytime baseline.
Recommendation: Your heart rate took 45 minutes to reach its nadir. Avoiding screen exposure 45m before bed will help initiate melatonin synthesis earlier.`;
      } else if (qLower.includes('doctor') || qLower.includes('question') || qLower.includes('prepare')) {
        aiReply = `Here are 3 tailored questions for your upcoming consultation with Dr. Elena Vance:
1. "Given my current ferritin of 38 ng/mL, should I maintain or adjust my 25mg iron bisglycinate dosage?"
2. "Are there any specific glucose screening protocols required for Week 26?"
3. "Are my resting blood pressure trends (118/76 mmHg) optimal for this gestational stage?"`;
      } else {
        aiReply = `I have cross-referenced your query with your Digital Health Twin data (Resting HR: 72 bpm, Day 14 Ovulation, 6,842 steps). Your physiological biomarkers remain well-regulated within safe baseline limits. Continue prioritizing hydration and balanced micro-nutrients today!`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `ai_${Date.now()}`,
          sender: 'ai',
          text: aiReply,
          timestamp: 'Just now',
          suggestedQuestions: ['Ask a follow-up', 'Save to Doctor Notes', 'View Biomarkers'],
        },
      ]);
      setIsAiThinking(false);
    }, 1100);
  };

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInputText('Can you explain my recent ultrasound scan?');
      }, 2000);
    } else {
      setIsRecording(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-lg h-[92vh] max-h-[720px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-purple-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-50/70 via-white to-rose-50/70 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-rose-500 flex items-center justify-center text-white shadow-sm shadow-purple-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  FemSphere AI Health Companion
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              </div>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                Live Multi-Sensor Digital Health Twin Engine
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAIChatOpen(false)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Persistent Safety Notice */}
        <div className="bg-purple-50/80 dark:bg-purple-950/40 px-4 py-2 border-b border-purple-100 dark:border-slate-800 flex items-center gap-2 text-[11px] text-purple-800 dark:text-purple-300">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 text-purple-600 dark:text-purple-400" />
          <span>
            <strong>Medical Notice:</strong> FemSphere provides health information and does not replace professional medical advice.
          </span>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-slate-700">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white rounded-br-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <div
                  className={`text-[9px] mt-1 text-right ${
                    msg.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {/* Suggested Questions Pills */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2 max-w-[90%]">
                  {msg.suggestedQuestions.map((sq, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(sq)}
                      className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-slate-800 hover:bg-purple-100 dark:hover:bg-slate-700 text-purple-700 dark:text-purple-300 text-[11px] font-medium border border-purple-200 dark:border-slate-700 transition-colors text-left min-h-[44px]"
                    >
                      {sq}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {isAiThinking && (
            <div className="flex items-center gap-2 text-xs text-purple-600 dark:text-purple-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin text-purple-500" />
              <span>Analyzing twin biometrics & clinical models...</span>
            </div>
          )}
        </div>

        {/* Voice Recording Banner if Active */}
        {isRecording && (
          <div className="px-4 py-2 bg-rose-50 dark:bg-rose-950/60 border-t border-rose-200 dark:border-rose-900 flex items-center justify-between text-xs text-rose-700 dark:text-rose-300 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
              <span>Listening to your voice prompt... (Speak now)</span>
            </div>
            <button
              onClick={() => setIsRecording(false)}
              className="text-[11px] font-bold underline"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Input Footer */}
        <div className="p-3 border-t border-purple-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={() => handleSend('Explain my latest lab report')}
              title="Attach Medical Report"
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={toggleRecording}
              title="Voice Input"
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                isRecording
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-slate-800'
              }`}
            >
              <Mic className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="Ask about symptoms, reports, sleep..."
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-purple-500 text-slate-800 dark:text-slate-100 min-h-[44px]"
            />

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="w-9 h-9 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-sm shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
