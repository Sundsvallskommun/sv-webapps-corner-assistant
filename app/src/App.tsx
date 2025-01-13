import {
  AssistantInfo,
  AssistantSettings,
  setAssistantStoreName,
  useAssistantStore,
} from "@sk-web-gui/ai";
import {
  ColorSchemeMode,
  defaultTheme,
  extendTheme,
  GuiProvider,
} from "@sk-web-gui/react";
import { Suspense, useEffect, useMemo, useState } from "react";
import { Assistant } from "./components/Assistant";

function App({
  user,
  hash,
  assistantId,
}: {
  user?: string | null;
  hash?: string | null;
  assistantId?: string | null;
}) {
  const [setSettings, settings, setInfo, setApiBaseUrl, setStream, options] =
    useAssistantStore((state) => [
      state.setSettings,
      state.settings,
      state.setInfo,
      state.setApiBaseUrl,
      state.setStream,
      state.options,
    ]);

  const [loaded, setLoaded] = useState<boolean>(false);

  const defaultColors = [
    "warning",
    "error",
    "success",
    "info",
    "vattjom",
    "juniskar",
    "bjornstigen",
    "gronsta",
  ];

  useEffect(() => {
    setAssistantStoreName("sk-ai-sv-corner-assistant");

    if (import.meta.env.DEV) {
      const settings: AssistantSettings = {
        user: user || "",
        assistantId: assistantId || "",
        hash: hash || "",
        app: import.meta.env.VITE_APPLICATION,
      };

      const info: AssistantInfo = {
        name: import.meta.env.VITE_ASSISTANT_NAME || "Hörnassistenten",
        shortName: "AI",
        title: "Sundsvalls AI-assistent.",
        description: {
          default:
            "Fråga assistenten om sådant du behöver veta som medarbetare på Sundsvalls kommun.",
          en: "The AI assistant can answer your questions in multiple languages.",
        },
        avatar: `${import.meta.env.VITE_BASE_PATH}assets/assistanticon.png`,
      };

      setStream(import.meta.env.VITE_STREAM_DEFAULT);
      setApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

      setSettings(settings);
      setInfo(info);
    }

    setLoaded(true);
  }, [user, hash, assistantId, setSettings, setInfo, setStream, setApiBaseUrl]);

  const getPosition = (position: string) => {
    const incomingPosition = options?.positions?.[position];
    if (incomingPosition) {
      return incomingPosition === "0" ? "0px" : incomingPosition;
    } else {
      return "0px";
    }
  };

  useEffect(() => {
    if (options?.css) {
      const rootElement = document.getElementById("sk-corner-assistant");
      const isShadow = rootElement.getAttribute("data-shadow") === "true";
      const firstChild = rootElement.firstChild as HTMLElement;

      const styleroot = isShadow ? firstChild?.shadowRoot : firstChild;

      const style = document?.createElement("style");
      style.textContent = options.css;
      styleroot?.insertBefore(style, styleroot.lastChild);
      styleroot?.appendChild(style);
    }
  }, [options?.css]);

  const theme = useMemo(
    () =>
      extendTheme({
        spacing: {
          ...defaultTheme.spacing,
          assistanttop: getPosition(options?.positions?.top),
          assistantbottom: getPosition(options?.positions?.bottom),
          assistantleft: getPosition(options?.positions?.left),
          assistantright: getPosition(options?.positions?.right),
        },
        fontFamily: {
          ...defaultTheme.fontFamily,
          DEFAULT: options?.fontface?.DEFAULT
            ? (options.fontface?.DEFAULT as string)
            : defaultTheme.fontFamily.DEFAULT,
          header: options?.fontface?.header
            ? (options.fontface.header as string)
            : defaultTheme.fontFamily.DEFAULT,
        },
        screens: {
          ...defaultTheme.screens,
          ismobile:
            options?.ismobile || defaultTheme.screens?.["medium-device-max"],
        },
        colorSchemes: {
          light: {
            ...defaultTheme.colorSchemes.light,
            colors: {
              ...defaultTheme.colorSchemes.light.colors,

              header: {
                background: defaultColors.includes(
                  options?.colors?.header?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.color}-surface-primary-DEFAULT)`
                  : options?.colors?.header?.color === "black"
                  ? "var(--sk-colors-primitives-gray-900)"
                  : options?.colors?.header?.background?.light ||
                    "var(--sk-colors-primitives-gray-900)",

                text: {
                  primary:
                    defaultColors.includes(options?.colors?.header?.color) ||
                    options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-lightest)"
                      : options?.colors?.header?.text?.primary?.light ||
                        "var(--sk-colors-primitives-gray-lightest)",
                  secondary:
                    defaultColors.includes(options?.colors?.header?.color) ||
                    options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-200)"
                      : options?.colors?.header?.text?.primary?.light ||
                        "var(--sk-colors-primitives-gray-200)",
                },
              },

              bubble: {
                surface: defaultColors.includes(options?.colors?.bubble?.color)
                  ? `var(--sk-colors-${options?.colors?.bubble?.color}-surface-accent-DEFAULT)`
                  : options?.colors?.bubble?.surface?.light ||
                    `var(--sk-colors-vattjom-surface-accent-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-${options?.colors?.bubble?.color}-surface-accent-hover)`
                  : options?.colors?.bubble?.["surface-hover"]?.light ||
                    `var(--sk-colors-vattjom-surface-accent-hover)`,
                text: defaultColors.includes(options?.colors?.bubble?.color)
                  ? `var(--sk-colors-dark-secondary)`
                  : options?.colors?.bubble?.text?.light ||
                    `var(--sk-colors-dark-secondary)`,
              },
              menu: {
                background:
                  !defaultColors.includes(options?.colors?.header?.color) &&
                  options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-DEFAULT)"
                    : "var(--sk-colors-inverted-tertiary-surface-DEFAULT)",
                "background-hover":
                  !defaultColors.includes(options?.colors?.header?.color) &&
                  options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-hover)"
                    : "var(--sk-colors-inverted-tertiary-surface-hover)",
                foreground:
                  !defaultColors.includes(options?.colors?.header?.color) &&
                  options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-dark-secondary)"
                    : "var(--sk-colors-inverted-dark-secondary)",
              },
              newquest: {
                surface: defaultColors.includes(
                  options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.newquest?.color}-surface-primary-DEFAULT)`
                  : `var(--sk-colors-vattjom-surface-primary-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.newquest?.color}-surface-primary-hover)`
                  : `var(--sk-colors-vattjom-surface-primary-hover)`,
                text: defaultColors.includes(
                  options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.newquest?.color}-text-secondary)`
                  : `var(--sk-colors-vattjom-text-secondary)`,
                "text-hover": "var(--sk-colors-light-primary)",
              },
            },
          },

          dark: {
            ...defaultTheme.colorSchemes.dark,
            colors: {
              ...defaultTheme.colorSchemes.dark.colors,
              header: {
                background: defaultColors.includes(
                  options?.colors?.header?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.color}-surface-primary-DEFAULT)`
                  : options?.colors?.header?.color === "black"
                  ? "var(--sk-colors-primitives-gray-100)"
                  : options?.colors?.header?.background?.dark ||
                    "var(--sk-colors-primitives-gray-100)",

                text: {
                  primary:
                    defaultColors.includes(options?.colors?.header?.color) ||
                    options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-900)"
                      : options?.colors?.header?.text?.primary?.dark ||
                        "var(--sk-colors-primitives-gray-900)",
                  secondary:
                    defaultColors.includes(options?.colors?.header?.color) ||
                    options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-700)"
                      : options?.colors?.header?.text?.primary?.dark ||
                        "var(--sk-colors-primitives-gray-700)",
                },
              },
              bubble: {
                surface: defaultColors.includes(options?.colors?.bubble?.color)
                  ? `var(--sk-colors-${options?.colors?.bubble?.color}-surface-accent-DEFAULT)`
                  : options?.colors?.bubble?.surface ||
                    `var(--sk-colors-vattjom-surface-accent-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-${options?.colors?.bubble?.color}-surface-accent-hover)`
                  : options?.colors?.bubble?.["surface-hover"]?.dark ||
                    `var(--sk-colors-vattjom-surface-accent-hover)`,
                text: defaultColors.includes(options?.colors?.bubble?.color)
                  ? `var(--sk-colors-dark-secondary)`
                  : options?.colors?.bubble?.text?.dark ||
                    `var(--sk-colors-dark-secondary)`,
              },
              menu: {
                background:
                  !defaultColors.includes(options?.colors?.header?.color) &&
                  options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-DEFAULT)"
                    : "var(--sk-colors-inverted-tertiary-surface-DEFAULT)",
                "background-hover":
                  !defaultColors.includes(options?.colors?.header?.color) &&
                  options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-hover)"
                    : "var(--sk-colors-inverted-tertiary-surface-hover)",
                foreground:
                  !defaultColors.includes(options?.colors?.header?.color) &&
                  options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-dark-secondary)"
                    : "var(--sk-colors-inverted-dark-secondary)",
              },
              newquest: {
                surface: defaultColors.includes(
                  options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.newquest?.color}-surface-primary-DEFAULT)`
                  : `var(--sk-colors-vattjom-surface-primary-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.newquest?.color}-surface-primary-hover)`
                  : `var(--sk-colors-vattjom-surface-primary-hover)`,
                text: defaultColors.includes(
                  options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${options?.colors?.header?.newquest?.color}-text-secondary)`
                  : `var(--sk-colors-vattjom-text-secondary)`,
                "text-hover": "var(--sk-colors-light-primary)",
              },
            },
          },
        },
      }),
    //eslint-disable-next-line
    [settings]
  );

  return (
    <GuiProvider
      theme={theme}
      htmlFontSize={import.meta.env.DEV ? 10 : options?.fontbase || 16}
      colorScheme={options?.colorscheme || ColorSchemeMode.System}
    >
      <Suspense fallback="loading">{loaded && <Assistant />}</Suspense>
    </GuiProvider>
  );
}

export default App;
