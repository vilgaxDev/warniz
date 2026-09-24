import React from 'react';
import { QuizCategory } from '../types';

interface CategorySidebarProps {
  categories: QuizCategory[];
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  theme?: 'dark' | 'light';
}

export const CategorySidebar: React.FC<CategorySidebarProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const allCategories = [
    { id: 'all', name: 'All Categories', icon: '🌟', subtitle: 'Browse all trivia categories' },
    ...categories,
  ];

  return (
    <div className={`p-4 rounded-2xl border sticky top-24 ${
      isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200'
    }`}>
      <h3 className={`text-sm font-bold uppercase tracking-wider mb-4 ${
        isDark ? 'text-slate-400' : 'text-slate-600'
      }`}>
        Categories
      </h3>

      <div className="space-y-1">
        {allCategories.map((category) => {
          const isSelected = selectedCategory === category.id;
          
          return (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                isSelected
                  ? isDark
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-emerald-600 text-white shadow-lg'
                  : isDark
                    ? 'hover:bg-[#222C3E] text-slate-300 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
              }`}
            >
              <span className="text-lg shrink-0">{category.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{category.name}</div>
                {category.subtitle && (
                  <div className={`text-xs truncate ${isSelected ? 'text-white/70' : isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                    {category.subtitle}
                  </div>
                )}
              </div>
              {isSelected && (
                <div className="w-2 h-2 rounded-full bg-white shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className={`mt-6 pt-6 border-t ${
        isDark ? 'border-[#222C3E]' : 'border-slate-200'
      }`}>
        <div className={`text-xs font-medium mb-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          Available Categories
        </div>
        <div className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
          {categories.length}
        </div>
      </div>
    </div>
  );
};