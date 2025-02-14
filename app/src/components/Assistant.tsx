import { AICornerModule, useAssistantStore, useChat } from "@sk-web-gui/ai";
import { Avatar } from "@sk-web-gui/react";
import { useEffect } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useAppSessions } from "../services/useAppSessions";
import { Options } from "../types/shared";

export const Assistant: React.FC = () => {
  const options: Options = useAssistantStore(
    (state) => state.options
  ) as unknown as Options;

  const settings = useAssistantStore((state) => state.settings);

  const info = useAssistantStore((state) => state.info);
  const isMobile = useMediaQuery(
    `screen and (max-width: ${options?.mobileBreakpoint || "1023px"})`
  );
  const rememberSession = options?.rememberSession || false;
  const appSessionId =
    settings?.app +
    (rememberSession ? options?.appSessionId || "default" : "__dont_remember");
  const { sessionId, setSessionId, docked, setDocked } =
    useAppSessions(appSessionId);

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

  useEffect(() => {
    if (!rememberSession || typeof docked !== "boolean") {
      setDocked(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!rememberSession) {
      setSessionId("");
    }
    //eslint-disable-next-line
  }, []);

  const { session, sendQuery, newSession } = useChat({ sessionId });

  useEffect(() => {
    if (session?.id && session.id !== sessionId) {
      setSessionId(session.id);
    }
    //eslint-disable-next-line
  }, [session?.id]);

  const handleDocked = (isdocked: boolean) => {
    setDocked(isdocked);
  };

  return (
    <AICornerModule
      docked={rememberSession ? docked : undefined}
      onOpen={() => (rememberSession ? handleDocked(false) : undefined)}
      onClose={() => (rememberSession ? handleDocked(true) : undefined)}
      onSendQuery={sendQuery}
      onNewSession={newSession}
      onChangeSession={setSessionId}
      session={session}
      isMobile={isMobile}
      questions={options?.questions}
      questionsTitle={options?.questionsTitle}
      showSessionHistory={options?.showHistory}
      title={options?.title}
      subtitle={options?.subtitle}
      disableFullscreen={options?.disableFullscreen}
      readmore={options?.readmore}
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
