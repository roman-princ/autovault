import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ThemeConfig {
  dealershipName: string;
  logoUrl: string | null;
  primaryColor: string; // hex, e.g. "#2563eb"
  secondaryColor: string; // hex, e.g. "#f97316"
  heroTitle: string;
  heroSubtitle: string;
  darkMode: boolean;
}

interface ThemeContextValue extends ThemeConfig {
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  resetTheme: () => void;
  toggleDarkMode: () => void;
}

// ── Defaults ───────────────────────────────────────────────────────────────────

const DEFAULT_THEME: ThemeConfig = {
  dealershipName: "AutoVault",
  logoUrl: null,
  primaryColor: "#2563eb", // hsl(220 80% 50%)
  secondaryColor: "#f97316", // hsl(30 90% 50%)
  heroTitle: "Find Your Perfect Drive",
  heroSubtitle:
    "Browse our curated selection of premium vehicles. Every car is inspected, verified, and ready for you.",
  darkMode: false,
};

const STORAGE_KEY = "whitelabel-theme";

// ── Color helpers ──────────────────────────────────────────────────────────────

function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/** Returns the HSL string format used by the CSS variables: "H S% L%" */
function hexToCSS(hex: string): string {
  const { h, s, l } = hexToHSL(hex);
  return `${h} ${s}% ${l}%`;
}

/** Pick white or black foreground depending on luminance */
function foregroundFor(hex: string): string {
  const { l } = hexToHSL(hex);
  return l > 55 ? "220 25% 10%" : "0 0% 100%";
}

// ── Apply to DOM ───────────────────────────────────────────────────────────────

function applyThemeToDOM(config: ThemeConfig) {
  const root = document.documentElement;
  const primary = hexToCSS(config.primaryColor);
  const accent = hexToCSS(config.secondaryColor);

  root.style.setProperty("--primary", primary);
  root.style.setProperty(
    "--primary-foreground",
    foregroundFor(config.primaryColor),
  );
  root.style.setProperty("--ring", primary);
  root.style.setProperty("--accent", accent);
  root.style.setProperty(
    "--accent-foreground",
    foregroundFor(config.secondaryColor),
  );

  root.classList.toggle("dark", config.darkMode);
}

// ── Context ────────────────────────────────────────────────────────────────────

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<ThemeConfig>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      // Only restore darkMode preference; branding is always loaded from the DB
      const darkMode = stored
        ? ((JSON.parse(stored) as Partial<ThemeConfig>).darkMode ?? false)
        : false;
      return { ...DEFAULT_THEME, darkMode };
    } catch {
      return DEFAULT_THEME;
    }
  });

  useEffect(() => {
    applyThemeToDOM(config);
    // Only persist the user-level darkMode preference to localStorage
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ darkMode: config.darkMode }),
    );
  }, [config]);

  const updateTheme = (updates: Partial<ThemeConfig>) =>
    setConfig((prev) => ({ ...prev, ...updates }));

  const resetTheme = () => setConfig(DEFAULT_THEME);

  const toggleDarkMode = () =>
    setConfig((prev) => ({ ...prev, darkMode: !prev.darkMode }));

  return (
    <ThemeContext.Provider
      value={{ ...config, updateTheme, resetTheme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
