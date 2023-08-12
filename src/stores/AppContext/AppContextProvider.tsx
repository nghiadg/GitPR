import { Octokit } from "@octokit/rest";
import { ReactNode, useCallback, useRef } from "react";
import { AppContext } from "./AppContext";

export interface AppContextProviderProps {
  children?: ReactNode;
}

export const AppContextProvider = ({ children }: AppContextProviderProps) => {
  const octokitRef = useRef<Octokit | null>(null);

  const setOctokit = useCallback((value: Octokit) => {
    octokitRef.current = value;
  }, []);


  return (
    <AppContext.Provider value={{octokitRef, setOctokit}}>
      {children}
    </AppContext.Provider>
  );
};
