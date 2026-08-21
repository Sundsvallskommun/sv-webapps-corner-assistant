import router from "@sitevision/api/common/router";
import appData from "@sitevision/api/server/appData";
// eslint-disable-next-line no-restricted-imports -- Needed to render configured avatar image nodes.
import imageRenderer from "@sitevision/api/server/ImageRenderer";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import properties from "@sitevision/api/server/Properties";
import versionUtil from "@sitevision/api/server/VersionUtil";
import type { AssistantInfo } from "@sk-web-gui/ai";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { ServerSideApp } from "./components/serverside-app/serverside-app.component";
import globalAppData from "@sitevision/api/server/globalAppData";
import type { DefaultColor, Options } from "./types/shared";
import type { ColorSchemeMode } from "@sk-web-gui/react";
import ReactHtmlParser from "react-html-parser";
import { getHash } from "./utils/hash.service";
import {
  getResolvedAppDataBoolean,
  getResolvedAppDataNode,
  getResolvedAppDataValue,
} from "./utils/appDataResolver";
import { defaultColors } from "./common/defaultColors";

router.get("/", (_req, res) => {
  const salt = globalAppData.get("salt") as string;
  const avatar = getResolvedAppDataNode("assistant_avatar");
  const avatarRender = imageRenderer;
  if (avatar) {
    avatarRender.setImage(avatar);
  }
  const assistantName = getResolvedAppDataValue("assistant_name");
  const assistantTitle = getResolvedAppDataValue("assistant_title");
  const assistantDescription = getResolvedAppDataValue("assistant_description");
  const assistantShortName = getResolvedAppDataValue("assistant_shortName");
  const assistantAvatarColor = getResolvedAppDataValue(
    "assistant_avatar_color",
    {
      allowedValues: defaultColors,
    }
  ) as DefaultColor | undefined;
  const userName = getResolvedAppDataValue("user_name");
  const userInitials = getResolvedAppDataValue("user_initials");
  const userAvatarColor = getResolvedAppDataValue("user_avatar_color", {
    allowedValues: defaultColors,
  }) as DefaultColor | undefined;
  const systemName = getResolvedAppDataValue("system_name");
  const systemInitials = getResolvedAppDataValue("system_initials");
  const systemAvatarColor = getResolvedAppDataValue("system_avatar_color", {
    allowedValues: defaultColors,
  }) as DefaultColor | undefined;
  const questionsTitle = getResolvedAppDataValue("questions_title");
  const headerTitle = getResolvedAppDataValue("header_title");
  const headerSubtitle = getResolvedAppDataValue("header_subtitle");
  const readmoreUrl = getResolvedAppDataValue("readmore_url");
  const readmoreDescription =
    getResolvedAppDataValue("readmore_description") || readmoreUrl;
  const localCss = getResolvedAppDataValue("css") || "";
  const resolvedAssistantId = getResolvedAppDataValue("assistantId") || "";
  const resolvedApp = getResolvedAppDataValue("app") || "";
  const resolvedAppSessionId =
    getResolvedAppDataValue("app_session_id") || "";
  const resolvedGroupChat = getResolvedAppDataBoolean("is_group_chat") || false;
  const resolvedRememberSession =
    getResolvedAppDataBoolean("remember_session") || false;
  const resolvedAllowFullscreen =
    getResolvedAppDataBoolean("allow_fullscreen") || false;
  const resolvedShowHistory =
    getResolvedAppDataBoolean("show_history") || false;
  const resolvedShowReferences =
    getResolvedAppDataBoolean("show_references");
  const resolvedUseQuestions =
    getResolvedAppDataBoolean("use_questions") || false;
  const resolvedAssistantShowTitle =
    getResolvedAppDataBoolean("assistant_show_title") || false;
  const resolvedUserShowTitle =
    getResolvedAppDataBoolean("user_show_title") || false;
  const resolvedSystemShowTitle =
    getResolvedAppDataBoolean("system_show_title") || false;

  const assistant: AssistantInfo = {
    name: assistantName || "",
    title: assistantTitle || "",
    description: assistantDescription || "",
    shortName: assistantShortName || "",
    avatar: avatar ? ReactHtmlParser(avatarRender.render())[0] : undefined,
  };

  const version2 = appData.get("version2") as boolean;
  const useQuestions = resolvedUseQuestions;
  const numberOfQuestions = parseInt(appData.get("questions_count") as string);
  const questions = useQuestions
    ? [
        getResolvedAppDataValue("question_1"),
        getResolvedAppDataValue("question_2"),
        getResolvedAppDataValue("question_3"),
        getResolvedAppDataValue("question_4"),
        getResolvedAppDataValue("question_5"),
      ]
        .slice(0, numberOfQuestions)
        .filter((quest): quest is string => Boolean(quest))
    : undefined;
  const resolvedQuestionsTitle = useQuestions ? questionsTitle : undefined;

  const showHistory = resolvedShowHistory;

  const mobileBreakpoint = `${globalAppData.get(
    "mobile_breakpoint"
  )}${globalAppData.get("mobile_breakpoint_unit")}`;

  const assistantOptions = {
    color: assistantAvatarColor,
    showTitle: resolvedAssistantShowTitle,
  };

  const userAvatar = getResolvedAppDataNode("user_avatar");
  const userAvatarRender = imageRenderer;
  if (userAvatar) {
    userAvatarRender.setImage(userAvatar);
  }
  const user = {
    color: userAvatarColor,
    title: userName,
    avatar: userAvatar
      ? ReactHtmlParser(userAvatarRender.render())[0]
      : undefined,
    initials: userInitials,
    showTitle: resolvedUserShowTitle,
  };

  const systemAvatar = getResolvedAppDataNode("system_avatar");
  const systemAvatarRender = imageRenderer;
  if (systemAvatar) {
    systemAvatarRender.setImage(systemAvatar);
  }
  const system =
    appData.get("system_show") === "custom"
      ? {
          color: systemAvatarColor,
          title: systemName,
          avatar: systemAvatar
            ? ReactHtmlParser(systemAvatarRender.render())[0]
            : undefined,
          initials: systemInitials,
          showTitle: resolvedSystemShowTitle,
        }
      : undefined;

  const positions = {
    top: `${globalAppData.get("position_top")}${globalAppData.get(
      "position_top_unit"
    )}`,
    bottom: `${globalAppData.get("position_bottom")}${globalAppData.get(
      "position_bottom_unit"
    )}`,
    left: `${globalAppData.get("position_left")}${globalAppData.get(
      "position_left_unit"
    )}`,
    right: `${globalAppData.get("position_right")}${globalAppData.get(
      "position_right_unit"
    )}`,
  };

  const fontbase = parseFloat(globalAppData.get("fontbase") as string);

  const newquest = {
    color: globalAppData.get("header_newquest_color") as DefaultColor,
  };

  const header = {
    color: globalAppData.get("color_header") as string,
    background: {
      light: properties.get(
        globalAppData.get("color_header_background_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        globalAppData.get("color_header_background_dark"),
        "htmlHexValue"
      ) as string,
    },
    text: {
      primary: {
        light: properties.get(
          globalAppData.get("color_header_text_primary_light"),
          "htmlHexValue"
        ) as string,
        dark: properties.get(
          globalAppData.get("color_header_text_primary_dark"),
          "htmlHexValue"
        ) as string,
      },
      secondary: {
        light: properties.get(
          globalAppData.get("color_header_text_secondary_light"),
          "htmlHexValue"
        ) as string,
        dark: properties.get(
          globalAppData.get("color_header_text_secondary_dark"),
          "htmlHexValue"
        ) as string,
      },
    },
    menu: appData.get("header_buttons") as string,
    newquest,
  };

  const bubble = {
    color: globalAppData.get("color_bubble") as string,
    surface: {
      light: properties.get(
        globalAppData.get("color_bubble_surface_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        globalAppData.get("color_bubble_surface_dark"),
        "htmlHexValue"
      ) as string,
    },
    "surface-hover": {
      light: properties.get(
        globalAppData.get("color_bubble_surface_hover_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        globalAppData.get("color_bubble_surface_hover_dark"),
        "htmlHexValue"
      ) as string,
    },
    text: {
      light: properties.get(
        globalAppData.get("color_bubble_text_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        globalAppData.get("color_bubble_text_dark"),
        "htmlHexValue"
      ) as string,
    },
  };

  const useTitles: boolean = appData.get("header_titles") === "custom";
  const css = `${globalAppData.get("css")} ${localCss}`;

  const options = {
    fontface: {
      DEFAULT:
        globalAppData.get("font_default") === "theme"
          ? "var(--env-font-family)"
          : (globalAppData.get("font_default_value") as string),
      header:
        globalAppData.get("font_header") === "theme"
          ? "var(--env-font-family)"
          : (globalAppData.get("font_header_value") as string),
    },
    disableFullscreen: !resolvedAllowFullscreen,
    questions,
    questionsTitle: resolvedQuestionsTitle,
    showHistory,
    showReferences: resolvedShowReferences,
    mobileBreakpoint,
    colors: { header, bubble },
    assistant: assistantOptions,
    user,
    system,
    positions,
    title: useTitles ? headerTitle : undefined,
    subtitle: useTitles ? headerSubtitle : undefined,
    fontbase,
    css,
    colorscheme: globalAppData.get("colorscheme") as
      | ColorSchemeMode
      | undefined,
    rememberSession: resolvedRememberSession,
    appSessionId: resolvedAppSessionId,
    readmore: readmoreUrl
      ? {
          url: readmoreUrl,
          description: readmoreDescription as string,
        }
      : undefined,
  };

  const viewMode = versionUtil.getCurrentVersion();
  const isEditing = viewMode === versionUtil.OFFLINE_VERSION;

  const shadowdom = globalAppData.get("shadowdom") as boolean;

  const useUser = globalAppData.get("use_user") as boolean;
  const currentUser = portletContextUtil.getCurrentUser();

  const username = useUser
    ? (properties.get(currentUser, "name") as string) || ""
    : "";

  const assistantId = resolvedAssistantId;
  const is_group_chat = resolvedGroupChat;
  const app = resolvedApp;
  const stream = globalAppData.get("stream") as boolean;
  const hash = getHash(username, assistantId, app, salt);
  const settings = {
    user: username,
    assistantId,
    app,
    hash,
    is_group_chat,
  };

  res.agnosticRender(
    renderToString(
      <ServerSideApp assistant={assistant} options={options as Options} />
    ),
    {
      assistant,
      settings,
      shadowdom,
      isEditing,
      options,
      version2,
      apiBaseUrl: globalAppData.get("server_url") as string,
      stream,
    }
  );
});
