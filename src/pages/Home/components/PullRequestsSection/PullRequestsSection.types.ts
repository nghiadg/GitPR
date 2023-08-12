import { Octokit } from "@octokit/rest";
import { Endpoints, GetResponseDataTypeFromEndpointMethod } from "@octokit/types";

const octokit = new Octokit()

export type TCommits = GetResponseDataTypeFromEndpointMethod<typeof octokit.pulls.listCommits>

export type TPullRequests = Endpoints['GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls']["response"]["data"]