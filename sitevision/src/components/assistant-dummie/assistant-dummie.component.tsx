import { AIModuleHeader, type AssistantInfo } from "@sk-web-gui/ai";
import React from "react";
import styles from "./assistant-dummie.styling.scss";
import { Avatar } from "@sk-web-gui/react";
import type { DefaultColor } from "../../common/defaultColors";

interface Color {
  light: string;
  dark: string;
}
export interface Options {
  fontface: Record<string, string>;
  colors: {
    header?: {
      color: string;
      background?: Color;
      text?: {
        primary?: Color;
        secondary?: Color;
      };
      menu: string;
    };
    bubble?: {
      color: string;
      surface?: Color;
      "surface-hover"?: Color;
      text?: Color;
    };
  };
  assistant: {
    color?: DefaultColor;
    showTitle?: boolean;
  };
  positions: {
    top: string;
    bottom: string;
    left: string;
    right: string;
  };
  title?: string;
  subtitle?: string;
  fontbase?: number;
}

interface AssistantDummieProps {
  assistant: AssistantInfo;
  options: Options;
}

export const AssistantDummie: React.FC<AssistantDummieProps> = ({
  assistant,
  options,
}) => {
  const [isClient, setIsClient] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsClient(!!window && !!document);
  }, []);

  const getHeaderBackground = (color: string) => {
    switch (color) {
      case "black":
        return "#2f2f3c";
      case "vattjom":
        return "#005595";
      case "juniskar":
        return "#A90074";
      case "bjornstigen":
        return "#5B1F78";
      case "gronsta":
        return "#00733B";
      case "custom":
        return options.colors?.header?.background?.light || "#2f2f3c";
      default:
        return "#2f2f3c";
    }
  };

  const getHeaderTextPrimary = (color: string) => {
    switch (color) {
      case "custom":
        return options.colors?.header?.text?.primary?.light || "#ffffff";
      default:
        return "#ffffff";
    }
  };
  const getHeaderTextSecondary = (color: string) => {
    switch (color) {
      case "custom":
        return options.colors?.header?.text?.secondary?.light || "#e5e5e5";
      default:
        return "#e5e5e5";
    }
  };

  const headerstyle = {
    "--sk-header-background": getHeaderBackground(
      options.colors?.header?.color || "black"
    ),
    "--sk-header-text-primary": getHeaderTextPrimary(
      options.colors?.header?.color || "black"
    ),
    "--sk-header-text-secondary": getHeaderTextSecondary(
      options.colors?.header?.color || "black"
    ),
    "--sk-header-menu-foreground":
      options.colors?.header?.color === "custom" &&
      options?.colors?.header?.menu === "dark"
        ? "#444450"
        : "#e5e5e5",
    "--sk-header-menu-background":
      options.colors?.header?.color === "custom" &&
      options?.colors?.header?.menu === "dark"
        ? "rgba(28, 28, 40, 0.08)"
        : "rgba(255, 255, 255, 0.2)",
    "--sk-header-menu-background-hover":
      options.colors?.header?.color === "custom" &&
      options?.colors?.header?.menu === "dark"
        ? "rgba(28, 28, 40, 0.1)"
        : "rgba(255, 255, 255, 0.3)",
  } as React.CSSProperties;

  const avatar = (
    <Avatar
      initials={assistant.shortName || "AI"}
      imageElement={
        typeof assistant.avatar !== "string" ? assistant.avatar : undefined
      }
      imageUrl={
        typeof assistant.avatar === "string" ? assistant.avatar : undefined
      }
      color={options?.assistant?.color || "vattjom"}
    />
  );

  return (
    <div
      className={styles["sk-ai-module"]}
      data-fullscren={false}
      data-docked={true}
      style={{
        fontFamily: options.fontface.DEFAULT,
        bottom: options.positions.bottom || "0px",
        right: options.positions.right || "0px",
        fontSize: `${options?.fontbase ? (16 / options.fontbase) * 16 : 16}px`,
      }}
    >
      <div className="sk-ai-module-content">
        <div className="sk-ai-module-content-row sk-ai-module-content-row-main">
          {isClient && (
            <AIModuleHeader
              assistant={assistant}
              fullscreen={false}
              docked={true}
              style={headerstyle}
              title={options?.title}
              subtitle={options?.subtitle}
              avatar={avatar}
            />
          )}
        </div>
      </div>
    </div>
  );
};