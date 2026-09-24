import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Globe, Check, Sparkles, Phone } from 'lucide-react';
import { CountryInfo } from '../types';
import { COUNTRIES_DATA } from '../data/countriesData';

export interface SpecifiedCountryInfo extends CountryInfo {
  flagUrl?: string;
  providerKeys?: string[];
}

export const ALLOWED_SPECIFIED_COUNTRIES: SpecifiedCountryInfo[] = [
  {
    code: 'BJ',
    name: 'Benin',
    flag: '🇧🇯',
    flagUrl: 'https://flagcdn.com/w80/bj.png',
    dialCode: '+229',
    currency: 'CFA',
    currencyCode: 'XOF',
    paymentMethod: 'Moov Africa / MTN MoMo',
    providerKeys: ['moov', 'mtn']
  },
  {
    code: 'BF',
    name: 'Burkina Faso',
    flag: '🇧🇫',
    flagUrl: 'https://flagcdn.com/w80/bf.png',
    dialCode: '+226',
    currency: 'CFA',
    currencyCode: 'XOF',
    paymentMethod: 'Moov Africa',
    providerKeys: ['moov']
  },
  {
    code: 'CM',
    name: 'Cameroon',
    flag: '🇨🇲',
    flagUrl: 'https://flagcdn.com/w80/cm.png',
    dialCode: '+237',
    currency: 'FCFA',
    currencyCode: 'XAF',
    paymentMethod: 'MTN MoMo / Orange Money',
    providerKeys: ['mtn', 'orange']
  },
  {
    code: 'CI',
    name: "Cote d'Ivoire",
    flag: '🇨🇮',
    flagUrl: 'https://flagcdn.com/w80/ci.png',
    dialCode: '+225',
    currency: 'CFA',
    currencyCode: 'XOF',
    paymentMethod: 'Moov Africa / MTN MoMo / Orange Money',
    providerKeys: ['moov', 'mtn', 'orange']
  },
  {
    code: 'CD',
    name: 'Democratic Republic of Congo',
    flag: '🇨🇩',
    flagUrl: 'https://flagcdn.com/w80/cd.png',
    dialCode: '+243',
    currency: 'FC',
    currencyCode: 'CDF',
    paymentMethod: 'Airtel Money / Orange Money / Vodacom',
    providerKeys: ['airtel', 'orange', 'vodacom']
  },
  {
    code: 'CD',
    name: 'Democratic Republic of Congo',
    flag: '🇨🇩',
    flagUrl: 'https://flagcdn.com/w80/cd.png',
    dialCode: '+243',
    currency: '$',
    currencyCode: 'USD',
    paymentMethod: 'Airtel Money / Orange Money / Vodacom',
    providerKeys: ['airtel', 'orange', 'vodacom']
  },
  {
    code: 'GA',
    name: 'Gabon',
    flag: '🇬🇦',
    flagUrl: 'https://flagcdn.com/w80/ga.png',
    dialCode: '+241',
    currency: 'FCFA',
    currencyCode: 'XAF',
    paymentMethod: 'Airtel Money',
    providerKeys: ['airtel']
  },
  {
    code: 'GH',
    name: 'Ghana',
    flag: '🇬🇭',
    flagUrl: 'https://flagcdn.com/w80/gh.png',
    dialCode: '+233',
    currency: 'GH₵',
    currencyCode: 'GHS',
    paymentMethod: 'AT Money / MTN MoMo / Telecel Cash',
    providerKeys: ['at', 'mtn', 'telecel']
  },
  {
    code: 'KE',
    name: 'Kenya',
    flag: '🇰🇪',
    flagUrl: 'https://flagcdn.com/w80/ke.png',
    dialCode: '+254',
    currency: 'KSh',
    currencyCode: 'KES',
    paymentMethod: 'M-PESA',
    providerKeys: ['mpesa']
  },
  {
    code: 'MW',
    name: 'Malawi',
    flag: '🇲🇼',
    flagUrl: 'https://flagcdn.com/w80/mw.png',
    dialCode: '+265',
    currency: 'MK',
    currencyCode: 'MWK',
    paymentMethod: 'Airtel Money / TNM Mpamba',
    providerKeys: ['airtel', 'tnm']
  },
  {
    code: 'MZ',
    name: 'Mozambique',
    flag: '🇲🇿',
    flagUrl: 'https://flagcdn.com/w80/mz.png',
    dialCode: '+258',
    currency: 'MT',
    currencyCode: 'MZN',
    paymentMethod: 'Vodacom M-Pesa',
    providerKeys: ['vodacom']
  },
  {
    code: 'NG',
    name: 'Nigeria',
    flag: '🇳🇬',
    flagUrl: 'https://flagcdn.com/w80/ng.png',
    dialCode: '+234',
    currency: '₦',
    currencyCode: 'NGN',
    paymentMethod: 'No active provider',
    providerKeys: ['none']
  },
  {
    code: 'CG',
    name: 'Republic of the Congo',
    flag: '🇨🇬',
    flagUrl: 'https://flagcdn.com/w80/cg.png',
    dialCode: '+242',
    currency: 'FCFA',
    currencyCode: 'XAF',
    paymentMethod: 'Airtel Money / MTN MoMo',
    providerKeys: ['airtel', 'mtn']
  },
  {
    code: 'RW',
    name: 'Rwanda',
    flag: '🇷🇼',
    flagUrl: 'https://flagcdn.com/w80/rw.png',
    dialCode: '+250',
    currency: 'FRw',
    currencyCode: 'RWF',
    paymentMethod: 'Airtel Money / MTN MoMo',
    providerKeys: ['airtel', 'mtn']
  },
  {
    code: 'SN',
    name: 'Senegal',
    flag: '🇸🇳',
    flagUrl: 'https://flagcdn.com/w80/sn.png',
    dialCode: '+221',
    currency: 'CFA',
    currencyCode: 'XOF',
    paymentMethod: 'Free Money / Orange Money',
    providerKeys: ['free', 'orange']
  },
  {
    code: 'SL',
    name: 'Sierra Leone',
    flag: '🇸🇱',
    flagUrl: 'https://flagcdn.com/w80/sl.png',
    dialCode: '+232',
    currency: 'Le',
    currencyCode: 'SLE',
    paymentMethod: 'Orange Money',
    providerKeys: ['orange']
  },
  {
    code: 'UG',
    name: 'Uganda',
    flag: '🇺🇬',
    flagUrl: 'https://flagcdn.com/w80/ug.png',
    dialCode: '+256',
    currency: 'USh',
    currencyCode: 'UGX',
    paymentMethod: 'Airtel Money / MTN MoMo',
    providerKeys: ['airtel', 'mtn']
  },
  {
    code: 'TZ',
    name: 'United Republic of Tanzania',
    flag: '🇹🇿',
    flagUrl: 'https://flagcdn.com/w80/tz.png',
    dialCode: '+255',
    currency: 'TSh',
    currencyCode: 'TZS',
    paymentMethod: 'Airtel Money / Halopesa / Tigo Pesa / Vodacom',
    providerKeys: ['airtel', 'halopesa', 'tigo', 'vodacom']
  },
  {
    code: 'ZM',
    name: 'Zambia',
    flag: '🇿🇲',
    flagUrl: 'https://flagcdn.com/w80/zm.png',
    dialCode: '+260',
    currency: 'ZK',
    currencyCode: 'ZMW',
    paymentMethod: 'Airtel Money / MTN MoMo / Zamtel',
    providerKeys: ['airtel', 'mtn', 'zamtel']
  }
];

export const ALL_AVAILABLE_COUNTRIES: SpecifiedCountryInfo[] = (() => {
  const map = new Map<string, SpecifiedCountryInfo>();
  for (const c of ALLOWED_SPECIFIED_COUNTRIES) {
    map.set(c.code, c);
  }
  for (const c of COUNTRIES_DATA) {
    if (!map.has(c.code)) {
      map.set(c.code, {
        ...c,
        flagUrl: `https://flagcdn.com/w80/${c.code.toLowerCase()}.png`,
      });
    }
  }
  return Array.from(map.values());
})();

interface CountrySelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountryCode: string;
  onSelectCountry: (country: CountryInfo) => void;
  countries?: CountryInfo[];
  theme?: 'dark' | 'light';
  title?: string;
}

const POPULAR_CODES = ['KE', 'UG', 'TZ', 'NG', 'GH', 'RW', 'ZA', 'CI', 'CD', 'ZM', 'GB', 'US'];

export const CountrySelectModal: React.FC<CountrySelectModalProps> = ({
  isOpen,
  onClose,
  selectedCountryCode,
  onSelectCountry,
  countries,
  theme = 'dark',
  title = 'Select Country & Dial Code',
}) => {
  const isDark = theme === 'dark';
  const [searchQuery, setSearchQuery] = useState('');
  const [imgErrorCodes, setImgErrorCodes] = useState<Record<string, boolean>>({});

  const countryList = useMemo(() => {
    return countries && countries.length > 0 ? (countries as SpecifiedCountryInfo[]) : ALL_AVAILABLE_COUNTRIES;
  }, [countries]);

  const filteredCountries = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return countryList;
    return countryList.filter((c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.dialCode.toLowerCase().includes(q) ||
      c.currency.toLowerCase().includes(q) ||
      (c.currencyCode && c.currencyCode.toLowerCase().includes(q)) ||
      (c.paymentMethod && c.paymentMethod.toLowerCase().includes(q))
    );
  }, [searchQuery, countryList]);

  const popularCountries = useMemo(() => {
    return countryList.filter((c) => POPULAR_CODES.includes(c.code));
  }, [countryList]);

  const renderProviderBadges = (country: SpecifiedCountryInfo) => {
    const keys = country.providerKeys || [];
    if (!keys.length || keys.includes('none')) {
      return <span className="text-[11px] text-slate-400 font-medium italic">No active provider</span>;
    }

    return (
      <div className="flex items-center gap-1.5 flex-wrap justify-end">
        {keys.map((key, idx) => {
          switch (key) {
            case 'moov':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-[#0B4B8A] text-white flex items-center gap-1 font-bold text-[10px] sm:text-xs shadow-xs border border-white/20">
                  <svg className="w-3 h-3 fill-amber-300 shrink-0" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z"/></svg>
                  <span>Moov Africa</span>
                </span>
              );

            case 'mtn':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-[#FFCC00] text-slate-950 flex items-center gap-1 font-black text-[10px] sm:text-xs shadow-xs border border-amber-400">
                  <span className="w-3 h-3 rounded-full bg-slate-950 text-[#FFCC00] text-[8px] flex items-center justify-center font-black">M</span>
                  <span>MoMo</span>
                </span>
              );

            case 'airtel':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-white border border-red-200 text-red-600 flex items-center gap-1 font-bold text-[10px] sm:text-xs shadow-xs">
                  <svg className="w-3.5 h-3.5 fill-red-600 shrink-0" viewBox="0 0 24 24"><path d="M12 2A10 10 0 1022 12 10 10 0 0012 2zm0 14a4 4 0 114-4 4 4 0 01-4 4z"/></svg>
                  <span className="font-extrabold tracking-tight text-red-600">airtel money</span>
                </span>
              );

            case 'orange':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-black border border-slate-700 text-white flex items-center gap-1 font-bold text-[10px] sm:text-xs shadow-xs">
                  <svg className="w-3.5 h-3.5 fill-orange-500 shrink-0" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>
                  <span className="text-white font-extrabold text-[10px]">Orange <span className="text-orange-500">Money</span></span>
                </span>
              );

            case 'vodacom':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-white border border-rose-200 text-rose-600 flex items-center gap-1 font-extrabold text-[10px] sm:text-xs shadow-xs">
                  <svg className="w-3.5 h-3.5 fill-rose-600 shrink-0" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                  <span className="text-rose-600">vodacom</span>
                </span>
              );

            case 'mpesa':
              return (
                <span key={idx} className="h-6 px-2.5 rounded bg-white border border-emerald-300 text-emerald-600 flex items-center gap-1 font-black text-[10px] sm:text-xs shadow-xs">
                  <span className="text-emerald-600 tracking-tighter">M-PESA</span>
                </span>
              );

            case 'at':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-[#1B2B4C] text-white flex items-center gap-1 font-extrabold text-[10px] sm:text-xs shadow-xs border border-white/20">
                  <span className="text-sky-400 font-black">at</span>
                  <span>Money</span>
                </span>
              );

            case 'telecel':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-white border border-red-300 text-red-600 flex items-center gap-1 font-bold text-[10px] sm:text-xs shadow-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 text-white text-[7px] flex items-center justify-center font-black">t</span>
                  <span className="text-slate-900 font-extrabold">telecel <span className="text-red-600">cash</span></span>
                </span>
              );

            case 'tnm':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-[#008751] text-white flex items-center gap-1 font-extrabold text-[10px] sm:text-xs shadow-xs border border-emerald-600">
                  <span>tnm</span>
                </span>
              );

            case 'tigo':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-[#002B66] text-white flex items-center gap-1 font-black text-[10px] sm:text-xs shadow-xs border border-white/20">
                  <span>tiGO</span>
                </span>
              );

            case 'halopesa':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-[#FF6600] text-white flex items-center gap-1 font-extrabold text-[10px] sm:text-xs shadow-xs">
                  <span>halopesa</span>
                </span>
              );

            case 'zamtel':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-[#009639] text-white flex items-center gap-1 font-extrabold text-[10px] sm:text-xs shadow-xs border border-emerald-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-white text-[#009639] text-[7px] flex items-center justify-center font-black">Z</span>
                  <span>Zamtel</span>
                </span>
              );

            case 'free':
              return (
                <span key={idx} className="h-6 px-2 rounded bg-rose-600 text-white flex items-center gap-1 font-black text-[10px] sm:text-xs shadow-xs">
                  <span>Free Money</span>
                </span>
              );

            default:
              return null;
          }
        })}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          className="w-full max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--card)] text-[var(--text-primary)] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] transition-all"
        >
          {/* Header */}
          <div className="p-4 border-b border-[var(--border)] bg-[var(--surface)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[var(--accent)] text-white flex items-center justify-center text-sm font-bold shadow-2xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base leading-tight text-[var(--text-primary)]">{title}</h3>
                <p className="text-[11px] font-medium text-[var(--text-muted)]">Select your country for local mobile money & currency</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all cursor-pointer active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-3 border-b border-[var(--border)] bg-[var(--card)]">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--accent-text)]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search country, dial code or currency (e.g. Kenya, +254, XOF, KES, NGN)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] text-xs font-semibold focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[var(--accent-text)] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Popular Pills */}
            {!searchQuery && (
              <div className="mt-2.5">
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--accent-text)] mb-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[var(--accent-text)]" />
                  <span>Popular Regions</span>
                </div>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
                  {popularCountries.map((c, idx) => (
                    <button
                      key={`${c.code}-${idx}`}
                      onClick={() => {
                        onSelectCountry(c);
                        onClose();
                      }}
                      className={`px-2.5 py-1 rounded-xl border text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer active:scale-95 ${
                        selectedCountryCode === c.code
                          ? 'bg-[var(--accent)] text-white border-[var(--accent)] shadow-xs'
                          : 'bg-[var(--surface)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50'
                      }`}
                    >
                      <span className="text-sm">{c.flag}</span>
                      <span>{c.name}</span>
                      <span className="opacity-70 text-[10px] font-mono">{c.dialCode}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Table Header Columns */}
          <div className="px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface)] grid grid-cols-12 gap-2 text-[11px] font-black uppercase tracking-wider text-[var(--text-muted)]">
            <div className="col-span-5 flex items-center gap-1">
              <span>Country</span>
              <span className="text-[10px] text-[var(--accent-text)] font-black">↑</span>
            </div>
            <div className="col-span-2 text-center">
              <span>Currency</span>
            </div>
            <div className="col-span-5 text-right">
              <span>Active Providers</span>
            </div>
          </div>

          {/* Country List Rows */}
          <div className="p-2.5 overflow-y-auto flex-1 space-y-2 custom-scrollbar">
            {filteredCountries.length === 0 ? (
              <div className="p-8 text-center text-xs text-[var(--text-muted)]">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-40 text-[var(--accent-text)]" />
                <p className="font-semibold">No countries matching "{searchQuery}"</p>
                <p className="text-[11px] mt-1 opacity-70">Try searching by country name, currency or dial code.</p>
              </div>
            ) : (
              filteredCountries.map((country, idx) => {
                const isSelected = selectedCountryCode === country.code;
                const rowKey = `${country.code}-${country.currencyCode}-${idx}`;
                const hasImgError = imgErrorCodes[rowKey];

                return (
                  <button
                    key={rowKey}
                    onClick={() => {
                      onSelectCountry(country);
                      onClose();
                    }}
                    className={`w-full p-3 rounded-xl border grid grid-cols-12 gap-2 items-center text-left transition-all cursor-pointer active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[var(--accent-soft)] border-[var(--accent)] text-[var(--text-primary)] ring-1 ring-[var(--accent)]/50 shadow-xs'
                        : 'bg-[var(--card)] border-[var(--border)] hover:bg-[var(--surface-hover)] hover:border-[var(--accent)]/40 text-[var(--text-primary)] shadow-2xs'
                    }`}
                  >
                    {/* Country Flag & Name */}
                    <div className="col-span-5 flex items-center gap-3 min-w-0">
                      {country.flagUrl && !hasImgError ? (
                        <img
                          src={country.flagUrl}
                          alt={country.name}
                          onError={() => setImgErrorCodes(prev => ({ ...prev, [rowKey]: true }))}
                          className="w-7 h-5 object-cover rounded-sm shrink-0 border border-black/20 shadow-2xs"
                        />
                      ) : (
                        <span className="text-2xl shrink-0 leading-none drop-shadow-xs">{country.flag}</span>
                      )}
                      <div className="min-w-0">
                        <span className="font-extrabold text-xs sm:text-sm truncate block">{country.name}</span>
                        <span className="text-[10px] font-mono font-bold block text-[var(--accent-text)]">{country.dialCode}</span>
                      </div>
                    </div>

                    {/* Currency */}
                    <div className="col-span-2 text-center">
                      <span className="px-2.5 py-1 rounded-lg border border-[var(--accent)]/30 bg-[var(--accent-soft)] text-[var(--accent-text)] text-[11px] sm:text-xs font-mono font-black inline-block">
                        {country.currencyCode || country.currency}
                      </span>
                    </div>

                    {/* Active Providers */}
                    <div className="col-span-5 flex items-center justify-end">
                      {renderProviderBadges(country)}
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-[var(--border)] bg-[var(--surface)] text-center text-[11px] font-bold flex items-center justify-center gap-2 text-[var(--text-muted)]">
            <Globe className="w-3.5 h-3.5 text-[var(--accent-text)]" />
            <span>Supported across all African regions and global payment gateways</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


