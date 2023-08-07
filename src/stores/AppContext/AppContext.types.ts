import { Octokit } from "@octokit/rest";

export interface AppContextData {
    octokitRef: React.MutableRefObject<Octokit | null> | null;
    setOctokit?: (octokit: Octokit) => void;
}