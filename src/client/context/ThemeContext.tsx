/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemePaletteId = 'warm-stone' | 'forest-sage' | 'indigo-ink' | 'terracotta';

export interface ThemeColors {
  id: ThemePaletteId;
  name: string;
  description: string;
  bgApp: string;
  bgSidebar: string;
  bgSurface: string;
  bgSubtle: string;
  border: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentText: string;
  accentLight: string;
  accentGreen: string;
  accentGreenBg: string;
  accentAmber: string;
  accentAmberBg: string;
  badgeGreenBg: string;
  badgeGreenText: string;
  badgeGreenBorder: string;
  previewColor: string;
}

export const THEME_PALETTES: Record<ThemePaletteId, ThemeColors> = {
  // 1. Quanta Signature: Forest & Warm Slate (Refined deep pine emerald accent with warm linen surfaces)
  'forest-sage': {
    id: 'forest-sage',
    name: 'Quanta Pine & Linen',
    description: 'Refined deep pine emerald accent with warm neutral surfaces',
    bgApp: '#F8F7F4',
    bgSidebar: '#EFECE6',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F2EFEB',
    border: '#E5E1D8',
    borderSubtle: '#EFECE5',
    textPrimary: '#18181B',
    textSecondary: '#52525B',
    textMuted: '#71717A',
    accent: '#0F4C3A',
    accentHover: '#0A382A',
    accentText: '#FFFFFF',
    accentLight: '#E8F1EC',
    accentGreen: '#15803D',
    accentGreenBg: '#DCFCE7',
    accentAmber: '#B45309',
    accentAmberBg: '#FEF3C7',
    badgeGreenBg: '#E9F5EC',
    badgeGreenText: '#15803D',
    badgeGreenBorder: '#C8E6C9',
    previewColor: '#0F4C3A',
  },

  // 2. Midnight Indigo & Crisp Pearl (Modern tech-forward luxury, upscale dining)
  'indigo-ink': {
    id: 'indigo-ink',
    name: 'Midnight & Pearl',
    description: 'Deep midnight navy with crisp porcelain tones',
    bgApp: '#F8F9FC',
    bgSidebar: '#EEF1F6',
    bgSurface: '#FFFFFF',
    bgSubtle: '#EEF1F8',
    border: '#E2E6EE',
    borderSubtle: '#EDF0F7',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#64748B',
    accent: '#1E293B',
    accentHover: '#0F172A',
    accentText: '#FFFFFF',
    accentLight: '#EEF2F6',
    accentGreen: '#047857',
    accentGreenBg: '#ECFDF5',
    accentAmber: '#B45309',
    accentAmberBg: '#FEF3C7',
    badgeGreenBg: '#ECFDF5',
    badgeGreenText: '#047857',
    badgeGreenBorder: '#A7F3D0',
    previewColor: '#1E293B',
  },

  // 3. Warm Amber Terracotta (Italian bistro, artisan bakery, specialty coffee)
  'terracotta': {
    id: 'terracotta',
    name: 'Warm Espresso & Terracotta',
    description: 'Rich roasted espresso with warm ochre highlights',
    bgApp: '#FBF9F6',
    bgSidebar: '#F2ECE2',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F4EEE5',
    border: '#E8DFD3',
    borderSubtle: '#F2ECE2',
    textPrimary: '#261E17',
    textSecondary: '#625345',
    textMuted: '#8E7B6C',
    accent: '#8C4420',
    accentHover: '#733516',
    accentText: '#FFFFFF',
    accentLight: '#F7EFE8',
    accentGreen: '#15803D',
    accentGreenBg: '#DCFCE7',
    accentAmber: '#B45309',
    accentAmberBg: '#FEF3C7',
    badgeGreenBg: '#EDF7ED',
    badgeGreenText: '#2E7D32',
    badgeGreenBorder: '#C8E6C9',
    previewColor: '#8C4420',
  },

  // 4. Warm Stone (Classic architectural neutral)
  'warm-stone': {
    id: 'warm-stone',
    name: 'Warm Stone & Charcoal',
    description: 'Minimalist quiet gallery aesthetic with warm stone undertones',
    bgApp: '#F8F7F5',
    bgSidebar: '#EFECE6',
    bgSurface: '#FFFFFF',
    bgSubtle: '#F2EFE9',
    border: '#E7E4DC',
    borderSubtle: '#F2EFE9',
    textPrimary: '#1C1917',
    textSecondary: '#57534E',
    textMuted: '#78716C',
    accent: '#292524',
    accentHover: '#1C1917',
    accentText: '#FFFFFF',
    accentLight: '#F5F4F0',
    accentGreen: '#15803D',
    accentGreenBg: '#DCFCE7',
    accentAmber: '#B45309',
    accentAmberBg: '#FEF3C7',
    badgeGreenBg: '#E9F5EC',
    badgeGreenText: '#15803D',
    badgeGreenBorder: '#C8E6C9',
    previewColor: '#292524',
  },
};

interface ThemeContextType {
  theme: ThemeColors;
  themeId: ThemePaletteId;
  setThemeId: (id: ThemePaletteId) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: THEME_PALETTES['forest-sage'],
  themeId: 'forest-sage',
  setThemeId: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeId, setThemeIdState] = useState<ThemePaletteId>(() => {
    const saved = localStorage.getItem('quanta_color_theme');
    return (saved as ThemePaletteId) || 'forest-sage';
  });

  const setThemeId = (id: ThemePaletteId) => {
    setThemeIdState(id);
    localStorage.setItem('quanta_color_theme', id);
  };

  const theme = THEME_PALETTES[themeId] || THEME_PALETTES['forest-sage'];

  // Apply CSS variables to root document
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-warm', theme.bgApp);
    root.style.setProperty('--surface-warm', theme.bgSurface);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--text-muted', theme.textMuted);
    root.style.setProperty('--border-warm', theme.border);
    root.style.setProperty('--border-subtle', theme.borderSubtle);
    root.style.setProperty('--accent', theme.accent);
    root.style.setProperty('--accent-hover', theme.accentHover);
    root.style.setProperty('--accent-soft', theme.accentLight);

    document.body.style.backgroundColor = theme.bgApp;
    document.body.style.color = theme.textPrimary;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
