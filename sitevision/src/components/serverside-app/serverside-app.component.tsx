import type { AssistantInfo } from "@sk-web-gui/ai";
import * as React from "react";
import {
  AssistantDummie,
  type Options,
} from "../assistant-dummie/assistant-dummie.component";

export interface ServerSideAppProps {
  assistant: AssistantInfo;
  options: Options;
}

export const ServerSideApp: React.FC<ServerSideAppProps> = ({
  assistant,
  options,
}) => {
  return (
    <div>
      <AssistantDummie assistant={assistant} options={options} />
    </div>
  );
};
