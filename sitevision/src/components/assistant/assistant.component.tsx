import type { AssistantInfo, AssistantSettings } from "@sk-web-gui/ai";
import { setAssistantStoreName, useAssistantStore } from "@sk-web-gui/ai";
import * as React from "react";
import type { Options } from "../assistant-dummie/assistant-dummie.component";

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
    setOptions,
    setStream,
    setApiBaseUrl,
  ] = useAssistantStore((state) => [
    state.info,
    state.setInfo,
    state.settings,
    state.setSettings,
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
  }, [assistant, setInfo, oldInfo]);

  React.useEffect(() => {
    setOptions(options);
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
  }, [settings, setSettings, oldSettings]);

  return (
    <div>
      <div id="sk-corner-assistant" data-shadow={shadowdom} />
    </div>
  );
};
