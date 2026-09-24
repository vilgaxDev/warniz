import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search, Filter, X, ChevronRight, Sparkles, TrendingUp, Clock, CheckCircle2, Play, Trophy, Flame, Zap } from 'lucide-react';
import { WalletBar } from '../components/WalletBar';
import { SiteFooter } from '../components/SiteFooter';
import { CategorySidebar } from '../components/CategorySidebar'; // @ts-ignore - TypeScript caching issue, file exists
import { QuizCategory, Question, UserState, UserProfile } from '../types';
import { QUIZ_CATEGORIES, SPEED_MODES } from '../data/quizData';

interface CategoryPageProps {
  userState?: UserState;
  userProfile?: UserProfile;
  theme?: 'dark' | 'light';
}

export default function CategoryPage({
  userState = {
    walletBalance: 0,
    currentWinnings: 0,
    streak: 0,
    maxStreak: 0,
    soundEnabled: true,
    xpPoints: 0,
    totalGamesPlayed: 0,
    totalCorrectAnswers: 0,
  },
  userProfile = {
    id: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    avatar: '',
    joinedDate: '',
    joinDate: '',
    isLoggedIn: false,
    questionsAttempted: 0,
    questionsCorrect: 0,
    totalEarnedKsh: 0,
    quizzesPlayed: 0,
    rank: 0,
    tier: 'STANDARD',
    xp: 0,
    level: 1,
  },
  theme = 'dark',
}: CategoryPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Load user profile from localStorage to get actual login state
  const [actualUserProfile, setActualUserProfile] = useState<UserProfile>(userProfile);

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setActualUserProfile(parsed);
      } catch (e) {
        console.error('Failed to parse user profile:', e);
      }
    }
  }, []);
  const isDark = theme === 'dark';

  // Category state
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<QuizCategory[]>(QUIZ_CATEGORIES);
  
  // Search and filter state (disabled for category view)
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Questions/Subcategories state
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Map URL slug to category ID
  const slugToCategoryId: Record<string, string> = {
    'basketball': 'basketball',
    'football': 'football',
    'general-knowledge': 'general_knowledge',
    'kenya': 'kenya',
    'world-cup': 'world_cup',
    'sports': 'sports',
    'tech': 'tech',
    'finance': 'finance',
    'geopolitics': 'geopolitics',
    'crypto': 'crypto',
    'politics': 'politics',
    'esports': 'esports',
    'entertainment': 'entertainment',
    'trending': 'trending',
  };

  // Map category ID to URL slug
  const categoryIdToSlug: Record<string, string> = Object.fromEntries(
    Object.entries(slugToCategoryId).map(([slug, id]) => [id, slug])
  );

  // Set category from URL
  useEffect(() => {
    if (slug) {
      const categoryId = slugToCategoryId[slug] || slug;
      setSelectedCategory(categoryId);
    } else {
      setSelectedCategory(null); // All categories
    }
  }, [slug]);

  // Fetch subcategories based on category
  useEffect(() => {
    const fetchSubcategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
        
        // Fetch hierarchical categories from public API (no auth required)
        const res = await fetch(`${baseUrl}/api/quiz/categories`, {
          headers: { 
            'Accept': 'application/json'
          }
        });
        
        if (!res.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const data = await res.json();
        const hierarchicalCategories = data.categories || [];
        
        // Fetch question counts for each category
        const categoriesWithCounts = await Promise.all(
          hierarchicalCategories.map(async (cat: any) => {
            try {
              const countRes = await fetch(`${baseUrl}/api/quiz/questions/count?category=${encodeURIComponent(cat.name)}`, {
                headers: { 'Accept': 'application/json' }
              });
              if (countRes.ok) {
                const countData = await countRes.json();
                return { ...cat, questionCount: countData.count || 0 };
              }
            } catch (e) {
              console.error('Failed to fetch question count for', cat.name);
            }
            return { ...cat, questionCount: 0 };
          })
        );
        
        // Filter based on selected category
        let filteredCategories = categoriesWithCounts;
        
        if (selectedCategory && selectedCategory !== 'all') {
          // Find the selected category and get its children
          const selectedCat = hierarchicalCategories.find((cat: any) => cat.slug === selectedCategory);
          if (selectedCat && selectedCat.children) {
            filteredCategories = selectedCat.children;
          } else {
            // If it's a subcategory, show its topics
            const parentCat = hierarchicalCategories.find((cat: any) => 
              cat.children?.some((child: any) => child.slug === selectedCategory)
            );
            if (parentCat) {
              const subcategory = parentCat.children?.find((child: any) => child.slug === selectedCategory);
              filteredCategories = subcategory?.children || [subcategory];
            }
          }
        }

        // Filter by search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filteredCategories = filteredCategories.filter((cat: any) => 
            cat.name.toLowerCase().includes(q) || 
            cat.description.toLowerCase().includes(q)
          );
        }

        // Ensure questionCount is preserved for all categories
        filteredCategories = filteredCategories.map((cat: any) => ({
          ...cat,
          questionCount: cat.questionCount || 0
        }));

        setSubcategories(filteredCategories);
      } catch {
        // Fallback to static quiz categories gracefully
        const fallback = QUIZ_CATEGORIES.map((c) => ({
          ...c,
          questionCount: c.questions?.length || 10,
        }));
        setSubcategories(fallback);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategories();
  }, [selectedCategory, searchQuery]);

  // Handle category selection from sidebar
  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      navigate('/category/all');
    } else {
      const slug = categoryIdToSlug[categoryId] || categoryId;
      navigate(`/category/${slug}`);
    }
  };

  // Handle search
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  // Get current category info
  const currentCategory = selectedCategory 
    ? categories.find(c => c.id === selectedCategory)
    : { id: 'all', name: 'All Categories', icon: '🌟', subtitle: 'Browse all trivia categories' };

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#0B0E14]' : 'bg-slate-50'}`}>
      {/* Header - Increased z-index to ensure visibility */}
      <div className="relative z-50">
        <WalletBar
          userState={userState}
          userProfile={actualUserProfile}
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          selectedSubcategory={selectedCategory || 'all'}
          onSelectSubcategory={handleCategorySelect}
          onOpenNotifications={() => {}}
          unreadCount={0}
          onOpenHowItWorks={() => {}}
          onOpenDailyRewards={() => {}}
          onOpenProfile={() => {}}
          onOpenAuth={() => {}}
          isProfileDropdownOpen={false}
          onToggleProfileDropdown={() => {}}
          onCloseProfileDropdown={() => {}}
          onSelectNav={() => {}}
          onLogout={() => {}}
          onOpenMobileProfile={() => {}}
          onOpenMobileCategories={() => {}}
          onOpenQuizBets={() => {}}
          theme={theme}
          onToggleTheme={() => {}}
          siteConfig={{
            siteName: 'Trivquest',
            headerAnnouncement: '⚡ Win up to 100,000 KES on live speed trivia games!',
            headerAnnouncementEnabled: true,
            headerBadge: 'SPEED TRIVIA (+100 XP)',
            headerCtaText: 'PLAY NOW',
          }}
          onCategoryClick={handleCategorySelect}
          selectedCategoryId={selectedCategory}
          categoryItems={categories.map(c => ({
            id: c.id,
            name: c.name,
            icon: c.icon,
            badge: c.badge,
            gradient: 'from-violet-500 to-purple-600',
          }))}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1600px] mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            <CategorySidebar
              categories={categories}
              selectedCategory={selectedCategory || 'all'}
              onCategorySelect={handleCategorySelect}
              theme={theme}
            />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Category Header */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-3xl shadow-lg">
                  {currentCategory?.icon}
                </div>
                <div>
                  <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentCategory?.name}
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {currentCategory?.subtitle}
                  </p>
                </div>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder={`Search ${currentCategory?.name || 'all'} categories...`}
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm ${isDark ? 'bg-[#121722] border border-[#222C3E] text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30' : 'bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30'} outline-none transition-all`}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => handleSearchChange('')}
                      className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${isDark ? 'bg-[#121722] border border-[#222C3E] text-slate-300 hover:bg-[#222C3E] hover:text-white' : 'bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200'}`}
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>

              {/* Active Filters */}
              {selectedCategory && selectedCategory !== 'all' && (
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Active filter:
                  </span>
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 ${isDark ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                    {currentCategory?.name}
                    <button
                      onClick={() => handleCategorySelect('all')}
                      className="hover:opacity-70"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                </div>
              )}
            </div>

            {/* Questions Grid */}
            {loading ? (
              <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200'}`}>
                <div className="animate-spin w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
                <p className={isDark ? 'text-slate-400' : 'text-slate-600'}>
                  Loading questions...
                </p>
              </div>
            ) : error ? (
              <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200'}`}>
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Retry
                </button>
              </div>
            ) : subcategories.length === 0 ? (
              <div className={`p-8 rounded-2xl border text-center ${isDark ? 'bg-[#182030] border-[#222C3E]' : 'bg-white border-slate-200'}`}>
                <Sparkles className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-slate-600' : 'text-slate-400'}`} />
                <h3 className={`text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  No categories found
                </h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {searchQuery 
                    ? `No categories matching "${searchQuery}" in ${currentCategory?.name || 'all categories'}`
                    : selectedCategory 
                    ? `No subcategories available in ${currentCategory?.name} yet. Click a main category to explore.`
                    : 'No categories available yet.'
                  }
                </p>
                {selectedCategory && selectedCategory !== 'all' && (
                  <button
                    onClick={() => handleCategorySelect('all')}
                    className={`mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors`}
                  >
                    View All Categories
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {subcategories.map((subcategory) => (
                  <div
                    key={subcategory.id}
                    className={`p-5 rounded-2xl border transition-all hover:shadow-lg cursor-pointer ${isDark ? 'bg-[#182030] border-[#222C3E] hover:border-emerald-500/50' : 'bg-white border-slate-200 hover:border-emerald-500'}`}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center text-2xl shrink-0">
                        {subcategory.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-bold text-base mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {subcategory.name}
                        </h4>
                        <p className={`text-xs line-clamp-2 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          {subcategory.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                        <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                          Questions Available
                        </span>
                      </div>
                      <div className={`px-2 py-1 rounded-lg text-xs font-medium ${isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}`}>
                        2X-5X Multipliers
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        // Navigate to home page with category selected to start quiz
                        navigate('/');
                        // Store selected category in localStorage so App.tsx can pick it up
                        localStorage.setItem('selected_category_for_quiz', subcategory.id);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${isDark ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Play {subcategory.name}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter
        theme={theme}
        onOpenHowItWorks={() => {}}
        onOpenLeaderboard={() => {}}
        onOpenDailyRewards={() => {}}
        onOpenDeposit={() => {}}
        onOpenWithdraw={() => {}}
        onSelectCategory={handleCategorySelect}
      />
    </div>
  );
}
