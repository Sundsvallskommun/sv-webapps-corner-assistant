import { AICornerModule, useAssistantStore } from "@sk-web-gui/ai";
import { Avatar } from "@sk-web-gui/react";
import { useMediaQuery } from "usehooks-ts";

export const Assistant: React.FC = () => {
  const options = useAssistantStore((state) => state.options);
  const info = useAssistantStore((state) => state.info);
  const isMobile = useMediaQuery(
    `screen and (max-width: ${options?.mobileBreakpoint || "1023px"})`
  );

  const userAvatar = (
    <Avatar
      initials={options?.user?.initials || "DU"}
      color={options?.user?.color || "bjornstigen"}
      imageElement={options?.user?.avatar}
    />
  );

  const assistantAvatar = (
    <Avatar
      initials={info.shortName || "AI"}
      color={options?.assistant?.color || "vattjom"}
      imageElement={typeof info.avatar !== "string" ? info.avatar : undefined}
      imageUrl={typeof info.avatar === "string" ? info.avatar : undefined}
    />
  );

  const systemAvatar = options?.system ? (
    <Avatar
      initials={options?.system?.initials || "AI"}
      color={options?.system?.color || "vattjom"}
      imageElement={options?.system?.avatar}
    />
  ) : (
    assistantAvatar
  );

  return (
    <AICornerModule
      isMobile={isMobile}
      questions={options?.questions}
      questionsTitle={options?.questionsTitle}
      showSessionHistory={options?.showHistory}
      title={options?.title}
      subtitle={options?.subtitle}
      disableFullscreen={options?.disableFullscreen}
      avatars={{
        user: userAvatar,
        assistant: assistantAvatar,
        system: systemAvatar,
      }}
      originTitles={{
        user: {
          title: options?.user?.title || "Du",
          show: options?.user?.showTitle || true,
        },
        assistant: {
          title: info.name,
          show: options?.assistant?.showTitle || true,
        },
        system: {
          title: options?.system?.title || info.name,
          show: options?.system?.showTitle || true,
        },
      }}
    />
  );
};
