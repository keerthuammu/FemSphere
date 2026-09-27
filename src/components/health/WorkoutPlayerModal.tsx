import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Flame,
  Clock,
  Sparkles,
  Trophy,
  CheckCircle2,
  Activity
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function WorkoutPlayerModal() {
  const { isWorkoutOpen, setIsWorkoutOpen } = useApp();

  const exercises = [
    { name: 'Pelvic Floor & Core Activation', reps: '15 Reps', duration: 45, target: 'Pelvic rehabilitation' },
    { name: 'Cat-Cow Spinal Articulation', reps: '12 Cycles', duration: 45, target: 'Thoracic & lumbar mobility' },
    { name: 'Gentle Glute Bridges', reps: '15 Reps (3s pause)', duration: 50, target: 'Posterior chain stability' },
    { name: 'Low-Impact Side Lunges', reps: '10 Per Side', duration: 40, target: 'Adductor mobility & balance' },
    { name: 'Restorative Child’s Pose Breathwork', reps: 'Hold & Breathe', duration: 60, target: 'Parasympathetic recovery' },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [secondsRemaining, setSecondsRemaining] = useState(exercises[0].duration);
  const [caloriesBurned, setCaloriesBurned] = useState(38);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying && !isCompleted && isWorkoutOpen) {
      timer = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            // Next exercise or finish
            if (currentIdx < exercises.length - 1) {
              setCurrentIdx(c => c + 1);
              setCaloriesBurned(cal => cal + 18);
              return exercises[currentIdx + 1].duration;
            } else {
              setIsCompleted(true);
              setIsPlaying(false);
              return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentIdx, isCompleted, isWorkoutOpen]);

  if (!isWorkoutOpen) return null;

  const currentExercise = exercises[currentIdx];
  const progressPct = ((currentIdx + 1) / exercises.length) * 100;

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSecondsRemaining(exercises[currentIdx + 1].duration);
    } else {
      setIsCompleted(true);
      setIsPlaying(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(prev => prev - 1);
      setSecondsRemaining(exercises[currentIdx - 1].duration);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-md h-[92vh] max-h-[740px] bg-slate-900 text-white rounded-3xl p-5 flex flex-col justify-between relative overflow-hidden shadow-2xl border border-purple-500/20">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">
              FemSphere Movement Player
            </span>
            <h3 className="text-sm font-bold text-white">
              Hormonal Balance & Pelvic Mobility
            </h3>
          </div>
          <button
            onClick={() => setIsWorkoutOpen(false)}
            className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Workout Complete Screen */}
        {isCompleted ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-500 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-purple-500/30">
              <Trophy className="w-10 h-10 animate-bounce" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Workout Complete 🎉
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Outstanding effort! Your digital twin is updating metabolic recovery signals.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 w-full my-3">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Total Duration</span>
                <span className="text-lg font-bold text-white">18 mins</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Active Calories</span>
                <span className="text-lg font-bold text-rose-400">142 kcal</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Exercises</span>
                <span className="text-lg font-bold text-white">5 Completed</span>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 block">Twin Synchrony</span>
                <span className="text-lg font-bold text-emerald-400">+5 Wellness</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsCompleted(false);
                setIsWorkoutOpen(false);
              }}
              className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-lg transition-all min-h-[44px]"
            >
              Finish & Return to Dashboard
            </button>
          </div>
        ) : (
          <>
            {/* Active Exercise Avatar / Visualizer */}
            <div className="flex-1 flex flex-col items-center justify-center my-3 text-center">
              {/* Exercise Avatar Container */}
              <div className="relative w-48 h-48 rounded-full bg-gradient-to-b from-purple-900/60 to-slate-800 border-2 border-purple-500/40 flex items-center justify-center shadow-inner overflow-hidden mb-4">
                <div className="absolute inset-0 bg-purple-500/10 animate-pulse"></div>
                {/* Visual stylized pose illustration */}
                <div className="text-center z-10">
                  <Activity className="w-16 h-16 text-purple-400 mx-auto stroke-[1.5] animate-pulse" />
                  <span className="text-[10px] text-purple-300 font-semibold uppercase mt-2 block">
                    Form Guidance
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[11px] text-purple-400 font-semibold">
                  Exercise {currentIdx + 1} of {exercises.length}
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {currentExercise.name}
                </h2>
                <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-1">
                  <span>{currentExercise.reps}</span>
                  <span aria-hidden="true">·</span>
                  <span>{currentExercise.target}</span>
                </div>
              </div>

              {/* Big Countdown Timer */}
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-5xl font-extrabold text-white tabular-nums tracking-tight">
                  {secondsRemaining}
                </span>
                <span className="text-sm font-semibold text-slate-400">sec</span>
              </div>

              <div className="flex items-center gap-2 mt-2 text-xs text-rose-400">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{caloriesBurned} kcal burned</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-purple-500 to-rose-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              ></div>
            </div>

            {/* Media Controls */}
            <div className="flex items-center justify-center gap-6 py-2">
              <button
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="w-12 h-12 rounded-full bg-slate-800 disabled:opacity-30 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
                title="Previous Exercise"
              >
                <SkipBack className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPlaying(prev => !prev)}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all"
                title={isPlaying ? 'Pause' : 'Resume'}
              >
                {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-slate-800 text-white flex items-center justify-center hover:bg-slate-700 transition-colors"
                title="Next Exercise"
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>

            {/* End Workout Button */}
            <button
              onClick={() => {
                setIsCompleted(true);
                setIsPlaying(false);
              }}
              className="w-full mt-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors min-h-[44px]"
            >
              End Workout Early
            </button>
          </>
        )}
      </div>
    </div>
  );
}
