import { AICornerModule } from "@sk-web-gui/ai";
import { ColorSchemeMode } from "@sk-web-gui/react";

export interface Color {
  light: string;
  dark: string;
}

export type DefaultColor = "vattjom" | "juniskar" | "bjornstigen" | "gronsta";

export interface Options {
  css?: string;
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
      newquest?: {
        color?: DefaultColor | string;
      };
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
  appSessionId?: string;
  readmore?: React.ComponentProps<typeof AICornerModule>["readmore"];
  mobileBreakpoint?: string;
  rememberSession?: boolean;
  user?: {
    initials?: string;
    color?: DefaultColor;
    avatar?: React.ReactElement;
    title?: string;
    showTitle?: boolean;
  };
  system?: {
    initials?: string;
    color?: DefaultColor;
    avatar?: React.ReactElement;
    title?: string;
    showTitle?: boolean;
  };
  questions?: string[];
  questionsTitle?: string;
  showHistory?: boolean;
  disableFullscreen?: boolean;
  colorscheme?: ColorSchemeMode;
}
