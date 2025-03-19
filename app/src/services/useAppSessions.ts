import { createJSONStorage, persist } from "zustand/middleware";
import { createWithEqualityFn } from "zustand/traditional";

interface SessionStorageData {
  id: string;
  docked: boolean;
}
interface State {
  sessionIds: Record<string, SessionStorageData>;
}

interface Actions {
  setSessionIds: (sessionIds: Record<string, SessionStorageData>) => void;
  setDocked: (sessionId: string, docked: boolean) => void;
}

const useAppSessionStore = createWithEqualityFn(
  persist<State & Actions>(
    (set) => ({
      sessionIds: {},
      setSessionIds: (sessionIds) => set({ sessionIds }),
      setDocked: (sessionId, docked) =>
        set((state) => ({
          sessionIds: {
            ...state.sessionIds,
            [sessionId]: { ...state.sessionIds[sessionId], docked },
          },
        })),
    }),
    {
      name: "sk-ai-sv-corner-sessions",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useAppSessions = (appSession: string) => {
  const [sessionIds, setSessionIds, setStoreDocked] = useAppSessionStore(
    (state) => [state.sessionIds, state.setSessionIds, state.setDocked]
  );
  const sessionId = sessionIds[appSession]?.id || "";
  const docked = sessionIds[appSession]?.docked ?? true;

  const setSessionId = (sessionId) => {
    setSessionIds({
      ...sessionIds,
      [appSession]: { id: sessionId, docked: docked ?? true },
    });
  };

  const setDocked = (docked: boolean) => {
    setStoreDocked(appSession, docked);
  };

  return { sessionId, setSessionId, docked, setDocked };
};
