export type ThemeType = "light" | "dark";

export const themeTypes = {
  light: "light",
  dark: "dark",
} as const;

export interface Themes {
  [themeName: string]: {
    type: ThemeType;
    class: string;
    color: string;
  };
}

export interface ThemeSettings {
  themes: Themes;
  storageKey: string;
}
