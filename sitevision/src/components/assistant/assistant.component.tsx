import type { AssistantInfo, AssistantSettings } from "@sk-web-gui/ai";
import { setAssistantStoreName, useAssistantStore } from "@sk-web-gui/ai";
import * as React from "react";
import type { Options } from "../../types/shared";

export interface AssistantProps {
  assistant: AssistantInfo;
  settings: AssistantSettings;
  shadowdom?: boolean;
  options: Options;
  apiBaseUrl: string;
  stream: boolean;
}

export const Assistant: React.FunctionComponent<AssistantProps> = ({
  assistant,
  settings,
  shadowdom = true,
  options,
  stream,
  apiBaseUrl,
}) => {
  const [
    oldInfo,
    setInfo,
    oldSettings,
    setSettings,
    oldOptions,
    setOptions,
    setStream,
    setApiBaseUrl,
  ] = useAssistantStore((state) => [
    state.info,
    state.setInfo,
    state.settings,
    state.setSettings,
    state.options,
    state.setOptions,
    state.setStream,
    state.setApiBaseUrl,
  ]);

  React.useEffect(() => {
    require("../../../assets/assistant-corner");
    setAssistantStoreName("sk-ai-sv-corner-assistant");
  }, []);

  React.useEffect(() => {
    const info: AssistantInfo = {
      ...oldInfo,
      ...assistant,
    };
    setInfo(info);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assistant, setInfo]);

  React.useEffect(() => {
    setOptions({ ...oldOptions, ...options });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOptions, options]);

  React.useEffect(() => {
    setStream(stream);
  }, [stream, setStream]);

  React.useEffect(() => {
    setApiBaseUrl(apiBaseUrl);
  }, [apiBaseUrl, setApiBaseUrl]);

  React.useEffect(() => {
    if (settings) {
      const newSettings: AssistantSettings = {
        ...oldSettings,
        ...settings,
      };
      setSettings(newSettings);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, setSettings]);

  return (
    <div>
      <div id="sk-corner-assistant" data-shadow={shadowdom} />
    </div>
  );
};
