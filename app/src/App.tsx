import {
  AssistantInfo,
  AssistantSettings,
  setAssistantStoreName,
  useAssistantStore,
  useSessions,
} from "@sk-web-gui/ai";
import { defaultTheme, extendTheme, GuiProvider } from "@sk-web-gui/react";
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
  const [setSettings, settings, setInfo] = useAssistantStore((state) => [
    state.setSettings,
    state.settings,
    state.setInfo,
  ]);
  const newSession = useSessions((state) => state.newSession);

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
        stream: import.meta.env.VITE_STREAM_DEFAULT,
        hash: hash || "",
        apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
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

      setSettings(settings);
      setInfo(info);
    }

    newSession();
    setLoaded(true);
  }, [user, hash, assistantId, setSettings, setInfo, newSession]);

  const getPosition = (position: string) => {
    const incomingPosition = settings?.options?.positions?.[position];
    if (incomingPosition) {
      return incomingPosition === "0" ? "0px" : incomingPosition;
    } else {
      return "0px";
    }
  };

  const theme = useMemo(
    () =>
      extendTheme({
        spacing: {
          ...defaultTheme.spacing,
          assistanttop: getPosition(settings?.options?.positions?.top),
          assistantbottom: getPosition(settings?.options?.positions?.bottom),
          assistantleft: getPosition(settings?.options?.positions?.left),
          assistantright: getPosition(settings?.options?.positions?.right),
        },
        fontFamily: {
          ...defaultTheme.fontFamily,
          DEFAULT: settings?.options?.fontface?.DEFAULT
            ? (settings.options.fontface?.DEFAULT as string)
            : defaultTheme.fontFamily.DEFAULT,
          header: settings?.options?.fontface?.header
            ? (settings.options.fontface.header as string)
            : defaultTheme.fontFamily.DEFAULT,
        },
        screens: {
          ...defaultTheme.screens,
          ismobile:
            settings?.options?.ismobile ||
            defaultTheme.screens?.["medium-device-max"],
        },
        colorSchemes: {
          light: {
            ...defaultTheme.colorSchemes.light,
            colors: {
              ...defaultTheme.colorSchemes.light.colors,

              header: {
                background: defaultColors.includes(
                  settings?.options?.colors?.header?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.color}-surface-primary-DEFAULT)`
                  : settings?.options?.colors?.header?.color === "black"
                  ? "var(--sk-colors-primitives-gray-900)"
                  : settings?.options?.colors?.header?.background?.light ||
                    "var(--sk-colors-primitives-gray-900)",

                text: {
                  primary:
                    defaultColors.includes(
                      settings?.options?.colors?.header?.color
                    ) || settings?.options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-lightest)"
                      : settings?.options?.colors?.header?.text?.primary
                          ?.light ||
                        "var(--sk-colors-primitives-gray-lightest)",
                  secondary:
                    defaultColors.includes(
                      settings?.options?.colors?.header?.color
                    ) || settings?.options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-200)"
                      : settings?.options?.colors?.header?.text?.primary
                          ?.light || "var(--sk-colors-primitives-gray-200)",
                },
              },

              bubble: {
                surface: defaultColors.includes(
                  settings?.options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.bubble?.color}-surface-accent-DEFAULT)`
                  : settings?.options?.colors?.bubble?.surface?.light ||
                    `var(--sk-colors-vattjom-surface-accent-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  settings?.options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.bubble?.color}-surface-accent-hover)`
                  : settings?.options?.colors?.bubble?.["surface-hover"]
                      ?.light ||
                    `var(--sk-colors-vattjom-surface-accent-hover)`,
                text: defaultColors.includes(
                  settings?.options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-dark-secondary)`
                  : settings?.options?.colors?.bubble?.text?.light ||
                    `var(--sk-colors-dark-secondary)`,
              },
              menu: {
                background:
                  !defaultColors.includes(
                    settings?.options?.colors?.header?.color
                  ) && settings?.options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-DEFAULT)"
                    : "var(--sk-colors-inverted-tertiary-surface-DEFAULT)",
                "background-hover":
                  !defaultColors.includes(
                    settings?.options?.colors?.header?.color
                  ) && settings?.options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-hover)"
                    : "var(--sk-colors-inverted-tertiary-surface-hover)",
                foreground:
                  !defaultColors.includes(
                    settings?.options?.colors?.header?.color
                  ) && settings?.options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-dark-secondary)"
                    : "var(--sk-colors-inverted-dark-secondary)",
              },
              newquest: {
                surface: defaultColors.includes(
                  settings?.options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.newquest?.color}-surface-primary-DEFAULT)`
                  : `var(--sk-colors-vattjom-surface-primary-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  settings?.options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.newquest?.color}-surface-primary-hover)`
                  : `var(--sk-colors-vattjom-surface-primary-hover)`,
                text: defaultColors.includes(
                  settings?.options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.newquest?.color}-text-secondary)`
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
                  settings?.options?.colors?.header?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.color}-surface-primary-DEFAULT)`
                  : settings?.options?.colors?.header?.color === "black"
                  ? "var(--sk-colors-primitives-gray-100)"
                  : settings?.options?.colors?.header?.background?.dark ||
                    "var(--sk-colors-primitives-gray-100)",

                text: {
                  primary:
                    defaultColors.includes(
                      settings?.options?.colors?.header?.color
                    ) || settings?.options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-900)"
                      : settings?.options?.colors?.header?.text?.primary
                          ?.dark || "var(--sk-colors-primitives-gray-900)",
                  secondary:
                    defaultColors.includes(
                      settings?.options?.colors?.header?.color
                    ) || settings?.options?.colors?.header?.color === "black"
                      ? "var(--sk-colors-primitives-gray-700)"
                      : settings?.options?.colors?.header?.text?.primary
                          ?.dark || "var(--sk-colors-primitives-gray-700)",
                },
              },
              bubble: {
                surface: defaultColors.includes(
                  settings?.options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.bubble?.color}-surface-accent-DEFAULT)`
                  : settings?.options?.colors?.bubble?.surface ||
                    `var(--sk-colors-vattjom-surface-accent-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  settings?.options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.bubble?.color}-surface-accent-hover)`
                  : settings?.options?.colors?.bubble?.["surface-hover"]
                      ?.dark || `var(--sk-colors-vattjom-surface-accent-hover)`,
                text: defaultColors.includes(
                  settings?.options?.colors?.bubble?.color
                )
                  ? `var(--sk-colors-dark-secondary)`
                  : settings?.options?.colors?.bubble?.text?.dark ||
                    `var(--sk-colors-dark-secondary)`,
              },
              menu: {
                background:
                  !defaultColors.includes(
                    settings?.options?.colors?.header?.color
                  ) && settings?.options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-DEFAULT)"
                    : "var(--sk-colors-inverted-tertiary-surface-DEFAULT)",
                "background-hover":
                  !defaultColors.includes(
                    settings?.options?.colors?.header?.color
                  ) && settings?.options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-tertiary-surface-hover)"
                    : "var(--sk-colors-inverted-tertiary-surface-hover)",
                foreground:
                  !defaultColors.includes(
                    settings?.options?.colors?.header?.color
                  ) && settings?.options?.colors?.header?.menu === "dark"
                    ? "var(--sk-colors-dark-secondary)"
                    : "var(--sk-colors-inverted-dark-secondary)",
              },
              newquest: {
                surface: defaultColors.includes(
                  settings?.options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.newquest?.color}-surface-primary-DEFAULT)`
                  : `var(--sk-colors-vattjom-surface-primary-DEFAULT)`,
                "surface-hover": defaultColors.includes(
                  settings?.options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.newquest?.color}-surface-primary-hover)`
                  : `var(--sk-colors-vattjom-surface-primary-hover)`,
                text: defaultColors.includes(
                  settings?.options?.colors?.header?.newquest?.color
                )
                  ? `var(--sk-colors-${settings?.options?.colors?.header?.newquest?.color}-text-secondary)`
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
      htmlFontSize={
        import.meta.env.DEV ? 10 : settings?.options?.fontbase || 16
      }
    >
      <Suspense fallback="loading">{loaded && <Assistant />}</Suspense>
    </GuiProvider>
  );
}

export default App;
