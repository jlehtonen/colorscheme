import { useEffect, useState } from "react";
import { Themes, ThemeSettings } from "./config.js";

const inferTheme = (themes: Themes) => {
  const defaultTheme = Object.keys(themes)[0];
  if (typeof window === "undefined") {
    return defaultTheme;
  }
  const root = window.document.documentElement;
  const theme = Object.entries(themes).find((pair) => {
    return root.classList.contains(pair[1].class);
  });

  if (theme !== undefined) {
    return theme[0];
  }

  return defaultTheme;
};

const replaceThemeClass = (newTheme: string, themes: Themes) => {
  const classes = Object.values(themes).map((theme) => theme.class);
  const element = window.document.documentElement;
  const oldClasses = [...element.classList.values()];
  const oldNonThemeClasses = oldClasses.filter(
    (cls) => !Object.values(classes).includes(cls)
  );
  const newClasses = [...oldNonThemeClasses, themes[newTheme].class];
  const newClassListString = newClasses.join(" ");
  element.className = newClassListString;
};

const saveThemeSetting = (theme: string, storageKey: string) => {
  window.localStorage.setItem(storageKey, theme);
};

const getNextTheme = (themName: string, themes: Themes) => {
  const themeNames = Object.keys(themes);
  const index = themeNames.indexOf(themName);
  const nextIndex = (index + 1) % themeNames.length;
  return themeNames[nextIndex];
};

export const useTheme = (settings: ThemeSettings) => {
  const [theme, setTheme] = useState(inferTheme(settings.themes));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const root = window.document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(inferTheme(settings.themes));
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, [settings.themes]);

  useEffect(() => {
    document
      .querySelector("meta[name='theme-color']")
      ?.setAttribute(
        "content",
        settings.themes[theme].color ?? Object.values(settings.themes)[0].color
      );
  }, [theme, settings.themes]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const toggleTheme = (newTheme?: string) => {
    const actualNewTheme = newTheme ?? getNextTheme(theme, settings.themes);
    replaceThemeClass(actualNewTheme, settings.themes);
    saveThemeSetting(actualNewTheme, settings.storageKey);
  };

  return {
    theme: loading
      ? null
      : {
          name: theme,
          type: settings.themes[theme].type,
          nextTheme: getNextTheme(theme, settings.themes),
        },
    toggleTheme,
  };
};
