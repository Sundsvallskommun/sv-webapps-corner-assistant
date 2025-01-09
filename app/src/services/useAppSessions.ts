import { createJSONStorage, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

interface State {
  sessionIds: Record<string, string>;
}

interface Actions {
  setSessionIds: (sessionIds: Record<string, string>) => void;
}

const useAppSessionStore = createWithEqualityFn(
  persist<State & Actions>(
    (set) => ({
      sessionIds: {},
      setSessionIds: (sessionIds) => set({ sessionIds }),
    }),
    {
      name: "sk-ai-sv-sessions",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useAppSessions = (appSession: string) => {
  const [sessionIds, setSessionIds] = useAppSessionStore((state) => [
    state.sessionIds,
    state.setSessionIds,
  ]);

  const setSessionId = (sessionId) => {
    setSessionIds({
      ...sessionIds,
      [appSession]: sessionId,
    });
  };

  const sessionId = sessionIds[appSession] || "";

  return { sessionId, setSessionId };
};
