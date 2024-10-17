import React from "react";
import { Assistant } from "../assistant/assistant.component";
import type { AssistantProps } from "../assistant/assistant.component";
import { ServerSideApp } from "../serverside-app/serverside-app.component";

export interface ClientAppProps extends AssistantProps {
  isEditing: boolean;
}
export const ClientApp: React.FC<ClientAppProps> = ({
  isEditing,
  assistant,
  ...rest
}) => {
  return isEditing ? (
    <ServerSideApp assistant={assistant} options={rest.options} />
  ) : (
    <Assistant assistant={assistant} {...rest} />
  );
};
