import { Themes, ThemeSettings, ThemeType, themeTypes } from "./config.js";

const getDefaultTheme = (themeType: ThemeType, themes: Themes) => {
  return Object.keys(themes).find((theme) => themes[theme].type === themeType);
};

const getScript = (settings: ThemeSettings) => `
(function (){
  const getInitialTheme = () => {
    const persistedColorPreference = window.localStorage.getItem("${
      settings.storageKey
    }");

    if (persistedColorPreference !== null) {
      return persistedColorPreference;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
    if (prefersDark.matches) {
      return "${getDefaultTheme(themeTypes.dark, settings.themes)}";
    }

    return "${getDefaultTheme(themeTypes.light, settings.themes)}";
  }

  const theme = getInitialTheme();
  const themes = ${JSON.stringify(settings.themes)};
  const root = document.documentElement;
  root.classList.add(themes[theme].class);

  document
  .querySelector("meta[name='theme-color']")
  .setAttribute("content", themes[theme].color);
})();
`;

export interface ThemeScriptProps {
  settings: ThemeSettings;
}

export const ThemeScript = ({ settings }: ThemeScriptProps) => {
  const defaultColor = Object.values(settings.themes)[0].color;
  return (
    <>
      <meta name="theme-color" content={defaultColor} />
      <script
        dangerouslySetInnerHTML={{
          __html: getScript(settings),
        }}
      />
    </>
  );
};
