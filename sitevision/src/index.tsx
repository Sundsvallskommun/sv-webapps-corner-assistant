import router from "@sitevision/api/common/router";
import appData from "@sitevision/api/server/appData";
import imageRenderer from "@sitevision/api/server/ImageRenderer";
import portletContextUtil from "@sitevision/api/server/PortletContextUtil";
import properties from "@sitevision/api/server/Properties";
import versionUtil from "@sitevision/api/server/VersionUtil";
import type { AssistantInfo } from "@sk-web-gui/ai";
import * as React from "react";
import { renderToString } from "react-dom/server";
import ReactHtmlParser from "react-html-parser";
import { ServerSideApp } from "./components/serverside-app/serverside-app.component";
import { getHash } from "./utils/hash.service";
import type { DefaultColor } from "./common/defaultColors";
import globalAppData from "@sitevision/api/server/globalAppData";

router.get("/", (req, res) => {
  const salt = globalAppData.get("salt") as string;
  const avatar = appData.getNode("assistant_avatar");
  const avatarRender = imageRenderer;
  avatarRender.setImage(avatar);

  const assistant: AssistantInfo = {
    name: appData.get("assistant_name") as string,
    title: appData.get("assistant_title") as string,
    description: appData.get("assistant_description") as string,
    shortName: appData.get("assistant_shortName") as string,
    avatar: avatar ? ReactHtmlParser(avatarRender.render())[0] : undefined,
  };

  const useQuestions = appData.get("use_questions") as boolean;
  const numberOfQuestions = parseInt(appData.get("questions_count") as string);
  const questions = useQuestions
    ? [
        appData.get("question_1") as string,
        appData.get("question_2") as string,
        appData.get("question_3") as string,
        appData.get("question_4") as string,
        appData.get("question_5") as string,
      ]
        .slice(0, numberOfQuestions)
        .filter((quest) => !!quest)
    : undefined;
  const questionsTitle = useQuestions
    ? appData.get("questions_title")
    : undefined;

  const showHistory = appData.get("show_history") as boolean;

  const mobileBreakpoint = `${appData.get("mobile_breakpoint")}${appData.get(
    "mobile_breakpoint_unit"
  )}`;

  const assistantOptions = {
    color: appData.get("assistant_avatar_color") as DefaultColor,
    showTitle: appData.get("assistant_show_title") as boolean,
  };

  const userAvatar = appData.getNode("user_avatar");
  const userAvatarRender = imageRenderer;
  userAvatarRender.setImage(userAvatar);
  const user = {
    color: appData.get("user_avatar_color") as DefaultColor,
    title: appData.get("user_name") as string,
    avatar: userAvatar
      ? ReactHtmlParser(userAvatarRender.render())[0]
      : undefined,
    initials: appData.get("user_initials") as string,
    showTitle: appData.get("user_show_title") as boolean,
  };

  const systemAvatar = appData.getNode("system_avatar");
  const systemAvatarRender = imageRenderer;
  systemAvatarRender.setImage(systemAvatar);
  const system =
    appData.get("system_show") === "custom"
      ? {
          color: appData.get("system_avatar_color") as DefaultColor,
          title: appData.get("system_name") as string,
          avatar: systemAvatar
            ? ReactHtmlParser(systemAvatarRender.render())[0]
            : undefined,
          initials: appData.get("system_initials") as string,
          showTitle: appData.get("system_show_title") as boolean,
        }
      : undefined;

  const positions = {
    top: `${appData.get("position_top")}${appData.get("position_top_unit")}`,
    bottom: `${appData.get("position_bottom")}${appData.get(
      "position_bottom_unit"
    )}`,
    left: `${appData.get("position_left")}${appData.get("position_left_unit")}`,
    right: `${appData.get("position_right")}${appData.get(
      "position_right_unit"
    )}`,
  };

  const fontbase = parseFloat(appData.get("fontbase") as string);

  const newquest = { color: appData.get("header_newquest_color") as string };

  const header = {
    color: appData.get("color_header") as string,
    background: {
      light: properties.get(
        appData.get("color_header_background_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        appData.get("color_header_background_dark"),
        "htmlHexValue"
      ) as string,
    },
    text: {
      primary: {
        light: properties.get(
          appData.get("color_header_text_primary_light"),
          "htmlHexValue"
        ) as string,
        dark: properties.get(
          appData.get("color_header_text_primary_dark"),
          "htmlHexValue"
        ) as string,
      },
      secondary: {
        light: properties.get(
          appData.get("color_header_text_secondary_light"),
          "htmlHexValue"
        ) as string,
        dark: properties.get(
          appData.get("color_header_text_secondary_dark"),
          "htmlHexValue"
        ) as string,
      },
    },
    menu: appData.get("header_buttons") as string,
    newquest,
  };

  const bubble = {
    color: appData.get("color_bubble") as string,
    surface: {
      light: properties.get(
        appData.get("color_bubble_surface_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        appData.get("color_bubble_surface_dark"),
        "htmlHexValue"
      ) as string,
    },
    "surface-hover": {
      light: properties.get(
        appData.get("color_bubble_surface_hover_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        appData.get("color_bubble_surface_hover_dark"),
        "htmlHexValue"
      ) as string,
    },
    text: {
      light: properties.get(
        appData.get("color_bubble_text_light"),
        "htmlHexValue"
      ) as string,
      dark: properties.get(
        appData.get("color_bubble_text_dark"),
        "htmlHexValue"
      ) as string,
    },
  };

  const useTitles: boolean = appData.get("header_titles") === "custom";
  const css = appData.get("css") as string;

  const options = {
    fontface: {
      DEFAULT:
        appData.get("font_default") === "theme"
          ? "var(--env-font-family)"
          : (appData.get("font_default_value") as string),
      header:
        appData.get("font_header") === "theme"
          ? "var(--env-font-family)"
          : (appData.get("font_header_value") as string),
    },
    disableFullscreen: !appData.get("allow_fullscreen"),
    questions,
    questionsTitle,
    showHistory,
    mobileBreakpoint,
    colors: { header, bubble },
    assistant: assistantOptions,
    user,
    system,
    positions,
    title: useTitles ? (appData.get("header_title") as string) : undefined,
    subtitle: useTitles
      ? (appData.get("header_subtitle") as string)
      : undefined,
    fontbase,
    css,
    colorscheme: appData.get("colorscheme"),
  };

  const viewMode = versionUtil.getCurrentVersion();
  const isEditing = viewMode === versionUtil.OFFLINE_VERSION;

  const shadowdom = appData.get("shadowdom") as boolean;

  const useUser = appData.get("use_user") as boolean;
  const currentUser = portletContextUtil.getCurrentUser();

  const username = useUser
    ? (properties.get(currentUser, "name") as string) || ""
    : "";

  const assistantId = appData.get("assistantId") as string;
  const app = appData.get("app") as string;
  const stream = appData.get("stream") as boolean;
  const hash = getHash(username, assistantId, app, salt);
  const settings = {
    user: username,
    assistantId,
    app,

    hash,
  };

  res.agnosticRender(
    renderToString(<ServerSideApp assistant={assistant} options={options} />),
    {
      assistant,
      settings,
      shadowdom,
      isEditing,
      options,
      apiBaseUrl: appData.get("server_url") as string,
      stream,
    }
  );
});
