import type { AssistantInfo, AssistantSettings } from "@sk-web-gui/ai";
import { setAssistantStoreName, useAssistantStore } from "@sk-web-gui/ai";
import * as React from "react";
import type { Options } from "../assistant-dummie/assistant-dummie.component";

export interface AssistantProps {
  assistant: AssistantInfo;
  settings: AssistantSettings;
  shadowdom?: boolean;
  options: Options;
}

export const Assistant: React.FunctionComponent<AssistantProps> = ({
  assistant,
  settings,
  shadowdom = true,
  options,
}) => {
  const [oldInfo, setInfo, oldSettings, setSettings, setOptions] =
    useAssistantStore((state) => [
      state.info,
      state.setInfo,
      state.settings,
      state.setSettings,
      state.setOptions,
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
