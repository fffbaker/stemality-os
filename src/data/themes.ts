// ==========================================
// STEMALITY OS - 10 Aesthetic Themes Engine
// Coding, Robotics, Artificial Intelligence & Game Development
// ==========================================

import { ThemeConfig, AestheticThemeId } from '../types';

export const AESTHETIC_THEMES: ThemeConfig[] = [
  {
    id: 'emerald',
    name: 'Emerald Cyberpunk',
    tagline: 'Futuristic neon terminal with vivid emerald and teal glow',
    primaryColor: '#10b981',
    secondaryColor: '#14b8a6',
    bgGradient: 'from-[#051310] via-[#081b17] to-[#030a08]',
    cardBg: 'bg-[#061c16]/75 border-emerald-500/30',
    borderAccent: 'border-emerald-500',
    glowClass: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    previewSwatches: ['#10b981', '#14b8a6', '#064e3b', '#030a08']
  },
  {
    id: 'indigo',
    name: 'Midnight Indigo & Violet',
    tagline: 'Deep space cosmos with luminous electric indigo and violet',
    primaryColor: '#6366f1',
    secondaryColor: '#a855f7',
    bgGradient: 'from-[#0a0c27] via-[#10133b] to-[#060718]',
    cardBg: 'bg-[#121644]/75 border-indigo-500/30',
    borderAccent: 'border-indigo-500',
    glowClass: 'shadow-[0_0_25px_rgba(99,102,241,0.25)]',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    previewSwatches: ['#6366f1', '#a855f7', '#312e81', '#060718']
  },
  {
    id: 'cyan',
    name: 'Quantum Cyan',
    tagline: 'Laser holographic optics with electric cyan and turquoise',
    primaryColor: '#06b6d4',
    secondaryColor: '#3b82f6',
    bgGradient: 'from-[#041624] via-[#082238] to-[#020b12]',
    cardBg: 'bg-[#092b45]/75 border-cyan-500/30',
    borderAccent: 'border-cyan-500',
    glowClass: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
    badgeClass: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    previewSwatches: ['#06b6d4', '#3b82f6', '#164e63', '#020b12']
  },
  {
    id: 'amber',
    name: 'Solar Flare & Amber',
    tagline: 'High-energy fusion reactor with radiant gold and warm amber',
    primaryColor: '#f59e0b',
    secondaryColor: '#fbbf24',
    bgGradient: 'from-[#1c1204] via-[#2a1b06] to-[#0e0902]',
    cardBg: 'bg-[#2b1c07]/75 border-amber-500/30',
    borderAccent: 'border-amber-500',
    glowClass: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    previewSwatches: ['#f59e0b', '#fbbf24', '#78350f', '#0e0902']
  },
  {
    id: 'synthwave',
    name: 'Synthwave Sunset',
    tagline: '80s retro-arcade neon with hot magenta, violet, and cyan',
    primaryColor: '#ec4899',
    secondaryColor: '#8b5cf6',
    bgGradient: 'from-[#220722] via-[#2f0c33] to-[#110313]',
    cardBg: 'bg-[#350d3a]/75 border-pink-500/30',
    borderAccent: 'border-pink-500',
    glowClass: 'shadow-[0_0_25px_rgba(236,72,153,0.25)]',
    badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    previewSwatches: ['#ec4899', '#8b5cf6', '#06b6d4', '#110313']
  },
  {
    id: 'crimson',
    name: 'Crimson Protocol',
    tagline: 'Tactical security operations with vivid scarlet and crimson alert',
    primaryColor: '#ef4444',
    secondaryColor: '#f43f5e',
    bgGradient: 'from-[#200609] via-[#2d090f] to-[#100204]',
    cardBg: 'bg-[#320a11]/75 border-red-500/30',
    borderAccent: 'border-red-500',
    glowClass: 'shadow-[0_0_25px_rgba(239,68,68,0.25)]',
    badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30',
    previewSwatches: ['#ef4444', '#f43f5e', '#7f1d1d', '#100204']
  },
  {
    id: 'obsidian',
    name: 'Deep Space Obsidian',
    tagline: 'Stealth minimalist monochromatic matte carbon with titanium lines',
    primaryColor: '#94a3b8',
    secondaryColor: '#e2e8f0',
    bgGradient: 'from-[#030712] via-[#0b0f19] to-[#000207]',
    cardBg: 'bg-[#0f172a]/75 border-slate-700/50',
    borderAccent: 'border-slate-500',
    glowClass: 'shadow-[0_0_25px_rgba(148,163,184,0.2)]',
    badgeClass: 'bg-slate-700/30 text-slate-200 border-slate-600/50',
    previewSwatches: ['#94a3b8', '#e2e8f0', '#334155', '#030712']
  },
  {
    id: 'aurora',
    name: 'Aurora Borealis',
    tagline: 'Shimmering polar lights with celestial greens, blues, and violet',
    primaryColor: '#14b8a6',
    secondaryColor: '#8b5cf6',
    bgGradient: 'from-[#03191f] via-[#09222c] to-[#010c10]',
    cardBg: 'bg-[#0c2a36]/75 border-teal-500/30',
    borderAccent: 'border-teal-500',
    glowClass: 'shadow-[0_0_25px_rgba(20,184,166,0.25)]',
    badgeClass: 'bg-teal-500/15 text-teal-300 border-teal-500/30',
    previewSwatches: ['#14b8a6', '#06b6d4', '#8b5cf6', '#010c10']
  },
  {
    id: 'rosegold',
    name: 'Rose Gold Luxe',
    tagline: 'Prestige executive salon with warm blush gold and dark espresso',
    primaryColor: '#fb7185',
    secondaryColor: '#f59e0b',
    bgGradient: 'from-[#1e0e13] via-[#2b131c] to-[#0f0609]',
    cardBg: 'bg-[#2f1420]/75 border-rose-400/30',
    borderAccent: 'border-rose-400',
    glowClass: 'shadow-[0_0_25px_rgba(251,113,133,0.25)]',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-400/30',
    previewSwatches: ['#fb7185', '#f59e0b', '#881337', '#0f0609']
  },
  {
    id: 'titanium',
    name: 'Clean Tech Titanium (Daylight)',
    tagline: 'Ultra-crisp high contrast daylight studio with deep sapphire accents',
    primaryColor: '#2563eb',
    secondaryColor: '#059669',
    bgGradient: 'from-[#f1f5f9] via-[#e2e8f0] to-[#f8fafc]',
    cardBg: 'bg-white/80 border-slate-300 shadow-lg text-slate-900',
    borderAccent: 'border-blue-600',
    glowClass: 'shadow-[0_0_25px_rgba(37,99,235,0.2)]',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
    previewSwatches: ['#2563eb', '#059669', '#cbd5e1', '#ffffff']
  }
];

export const getThemeById = (id: AestheticThemeId): ThemeConfig => {
  return AESTHETIC_THEMES.find(t => t.id === id) || AESTHETIC_THEMES[0];
};

export const applyAestheticTheme = (themeId: AestheticThemeId) => {
  const theme = getThemeById(themeId);
  const root = document.documentElement;

  // Set data-theme attribute
  root.setAttribute('data-theme', themeId);

  // Set CSS custom variables
  root.style.setProperty('--theme-primary', theme.primaryColor);
  root.style.setProperty('--theme-secondary', theme.secondaryColor);

  // If titanium (light mode), adjust dark class
  if (themeId === 'titanium') {
    root.classList.remove('dark');
  } else {
    root.classList.add('dark');
  }
};
