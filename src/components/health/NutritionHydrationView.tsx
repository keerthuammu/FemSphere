import React, { useState } from 'react';
import { Droplet, Plus, Utensils, CheckCircle, Apple, Coffee, Moon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function NutritionHydrationView() {
  const { waterGlasses, addWaterGlass } = useApp();
  const [isLogMealOpen, setIsLogMealOpen] = useState(false);
  const [activeMealType, setActiveMealType] = useState('Breakfast');
  const [mealDescription, setMealDescription] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');

  const [meals, setMeals] = useState([
    { type: 'Breakfast', name: 'Greek Yogurt, Chia Seeds, Raspberries & Walnuts', calories: 340, protein: '22g', carbs: '28g', fat: '14g' },
    { type: 'Lunch', name: 'Quinoa Bowl with Wild Salmon, Avocado & Steamed Greens', calories: 560, protein: '38g', carbs: '44g', fat: '22g' },
    { type: 'Snack', name: 'Almonds, Dark Chocolate (85%) & Green Tea', calories: 190, protein: '6g', carbs: '14g', fat: '12g' },
    { type: 'Dinner', name: 'Roasted Turkey Breast, Sweet Potato & Asparagus', calories: 480, protein: '42g', carbs: '36g', fat: '11g' },
  ]);

  const handleAddMeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (mealDescription.trim()) {
      setMeals(prev => [
        ...prev,
        {
          type: activeMealType,
          name: mealDescription,
          calories: parseInt(caloriesInput) || 300,
          protein: '20g',
          carbs: '30g',
          fat: '10g',
        },
      ]);
      setMealDescription('');
      setCaloriesInput('');
      setIsLogMealOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Hydration Tracker */}
      <div className="bg-gradient-to-br from-sky-50 via-white to-purple-50 dark:from-slate-850 dark:via-slate-850 dark:to-sky-950/20 p-5 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <Droplet className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Hydration Tracker
              </h2>
              <p className="text-[11px] text-sky-700 dark:text-sky-300 font-medium">
                Goal: 2.0 Liters (~8 standard glasses of water)
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-1 text-right">
            <span className="text-2xl font-extrabold text-sky-700 dark:text-sky-300 tabular-nums">
              {waterGlasses}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 8</span>
          </div>
        </div>

        {/* 8 Glasses Visual Row */}
        <div className="grid grid-cols-8 gap-1.5 pt-1">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isFilled = idx < waterGlasses;
            return (
              <button
                key={idx}
                onClick={addWaterGlass}
                className={`h-11 rounded-xl flex items-center justify-center transition-all ${
                  isFilled
                    ? 'bg-sky-500 text-white shadow-xs scale-105'
                    : 'bg-white dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-200 dark:border-slate-700 hover:border-sky-400'
                }`}
                title={`Glass ${idx + 1}`}
              >
                <Droplet className={`w-4 h-4 ${isFilled ? 'fill-current' : ''}`} />
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500 dark:text-slate-400">
          <span>{waterGlasses * 250} ml logged today</span>
          <button
            onClick={addWaterGlass}
            className="text-sky-600 dark:text-sky-400 font-bold hover:underline"
          >
            + Add Glass
          </button>
        </div>
      </div>

      {/* Macronutrient Balance Card */}
      <div className="bg-white dark:bg-slate-850 p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Daily Macronutrient Target
            </h3>
            <p className="text-[11px] text-slate-400">
              Caloric intake: 1,570 / 1,950 kcal
            </p>
          </div>
          <button
            onClick={() => setIsLogMealOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 text-purple-700 dark:text-purple-300 text-xs font-bold border border-purple-200 dark:border-purple-800 flex items-center gap-1 min-h-[44px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Meal</span>
          </button>
        </div>

        {/* 3 Macro Bars */}
        <div className="grid grid-cols-3 gap-2.5 pt-1">
          <div className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60">
            <span className="text-[10px] uppercase font-bold text-rose-700 dark:text-rose-300">Protein</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">108g</p>
            <div className="w-full bg-rose-200 dark:bg-rose-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-rose-500 h-full w-[85%] rounded-full"></div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">85% of 125g goal</span>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/60">
            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-300">Carbs</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">122g</p>
            <div className="w-full bg-amber-200 dark:bg-amber-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-amber-500 h-full w-[65%] rounded-full"></div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">65% of 190g goal</span>
          </div>

          <div className="p-3 rounded-xl bg-purple-50/60 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/60">
            <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">Healthy Fat</span>
            <p className="text-lg font-bold text-slate-900 dark:text-white tabular-nums">59g</p>
            <div className="w-full bg-purple-200 dark:bg-purple-900 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-purple-500 h-full w-[90%] rounded-full"></div>
            </div>
            <span className="text-[9px] text-slate-400 mt-1 block">90% of 65g goal</span>
          </div>
        </div>
      </div>

      {/* Meal Cards */}
      <div className="bg-white dark:bg-slate-850 p-4 sm:p-5 rounded-2xl border border-purple-100/70 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Today's Meals
        </h3>

        <div className="space-y-2">
          {meals.map((meal, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-purple-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-purple-600 dark:text-purple-300 shrink-0 mt-0.5">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-300">
                      {meal.type}
                    </span>
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {meal.calories} kcal
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {meal.name}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span>P: {meal.protein}</span>
                    <span>·</span>
                    <span>C: {meal.carbs}</span>
                    <span>·</span>
                    <span>F: {meal.fat}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Meal Modal */}
      {isLogMealOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-purple-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Log Meal Nutrition
              </h3>
              <button onClick={() => setIsLogMealOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddMeal} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Meal Category
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {['Breakfast', 'Lunch', 'Snack', 'Dinner'].map(t => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setActiveMealType(t)}
                      className={`py-1.5 rounded-lg text-xs font-semibold border ${
                        activeMealType === t
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Foods / Meal Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Avocado Toast with Poached Eggs"
                  value={mealDescription}
                  onChange={e => setMealDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                  Estimated Calories (kcal)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 420"
                  value={caloriesInput}
                  onChange={e => setCaloriesInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-purple-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md min-h-[44px]"
              >
                Save Meal Log
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
