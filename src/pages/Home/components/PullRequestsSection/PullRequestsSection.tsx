import { AgGridReact } from "ag-grid-react";
import clsx from "clsx";
import { useCallback, useContext, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { AppContext } from "../../../../stores";
import { gitPrColDefs } from "./PullRequestsSection.helpers";
import styles from "./PullRequestsSection.module.css";
import { TCommits, TPullRequests } from "./PullRequestsSection.types";

export interface PullRequestsSectionProps {
  onGenerateMessage: (message: string, jiraUrls: string[]) => void;
}

interface FormQueryCommit {
  url: string;
}

const REGEX_JIRA =
  /(http|ftp|https):\/\/(jira.sotatek)([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gm;

const DETECT_PR_MERGED_TXT = "Merge pull request";

export const PullRequestsSection = ({
  onGenerateMessage,
}: PullRequestsSectionProps) => {
  const { octokitRef } = useContext(AppContext);
  const gitPrGridRef = useRef<AgGridReact>(null);
  const { register, getValues } = useForm<FormQueryCommit>({
    defaultValues: {
      url: "",
    },
  });

  const getGridData = useCallback(() => {
    if (!gitPrGridRef.current) return [];
    const pullRequests: TPullRequests = [];
    gitPrGridRef.current.api.forEachNode((node) => {
      pullRequests.push(node.data);
    });

    return pullRequests;
  }, []);

  const generateMessage = useCallback(() => {
    if (!gitPrGridRef.current) return;
    const pullRequests = getGridData();

    const urls: string[] = [];
    const message = [];

    const messageMap: { [key: string]: string[] } = {};
    pullRequests.forEach((pull) => {
      if (!pull.body || !pull.assignee) return;
      const regex = new RegExp(REGEX_JIRA);
      const jiraUrls = pull.body.match(regex) || [];
      if (messageMap.hasOwnProperty(pull.assignee.login)) {
        messageMap[pull.assignee.login].push(...jiraUrls);
      } else {
        messageMap[pull.assignee.login] = jiraUrls;
      }
      urls.push(...jiraUrls);
    });

    for (const assignee in messageMap) {
      const mentionMsg = assignee + "\n" + messageMap[assignee].join("\n");
      message.push(mentionMsg);
    }

    onGenerateMessage(message.join("\n"), urls);
  }, [getGridData, onGenerateMessage]);

  const getCommits = useCallback(async () => {
    try {
      gitPrGridRef.current?.api.showLoadingOverlay();
      // detect url to params
      const { url } = getValues();
      const cells = url.split("/"); // ['https:', '', 'github.com', 'owner', 'repo', 'pull', 'pull number']

      let hasMore = true;
      const commits: TCommits = [];
      let page = 1;

      do {
        const res = await octokitRef?.current?.pulls.listCommits({
          owner: cells[3],
          repo: cells[4],
          pull_number: Number(cells[6]),
          per_page: 100,
          page,
        });
        
        if (res?.data.length) hasMore = false;
        commits.push(...(res?.data || []));
        page++;
      } while (hasMore);

      const mergedCommits = commits.filter((commit) =>
        commit.commit.message.includes(DETECT_PR_MERGED_TXT)
      );

      // get pull request
      const pullRequestsRes = await Promise.all(
        mergedCommits.map((commit) =>
          octokitRef?.current?.request(
            "GET /repos/{owner}/{repo}/commits/{commit_sha}/pulls",
            {
              owner: cells[3],
              repo: cells[4],
              commit_sha: commit.sha,
            }
          )
        )
      );

      const pullRequests = pullRequestsRes.map((res) => res?.data[0]);

      gitPrGridRef.current?.api.setRowData(pullRequests);
      generateMessage();
    } catch (error) {
      console.error(error);
    } finally {
      gitPrGridRef.current?.api.hideOverlay();
    }
  }, [generateMessage, getValues, octokitRef]);

  const openPullRequests = useCallback(() => {
    const pullRequests = getGridData();
    pullRequests.forEach((pull) => {
      window.open(pull.html_url, "_blank");
    });
  }, [getGridData]);

  return (
    <div className={clsx("h-100 d-flex flex-column", styles.container)}>
      <div className="mb-3 d-flex justify-content-between gap-2">
        <Form.Control
          {...register("url")}
          as="input"
          size="sm"
          placeholder="Enter GitHub Pull Request"
          className="rounded-0"
        />
        <Button
          size="sm"
          className="flex-shrink-0 rounded-0"
          onClick={getCommits}
        >
          Get Commits
        </Button>
        <Button
          size="sm"
          variant="outline-dark"
          className="flex-shrink-0 rounded-0"
          onClick={openPullRequests}
        >
          Open GitHub
        </Button>
      </div>
      <div className={clsx("ag-theme-alpine", styles.agGrid)}>
        <AgGridReact
          getRowId={(param) => param.data.id}
          ref={gitPrGridRef}
          headerHeight={30}
          rowHeight={30}
          columnDefs={gitPrColDefs}
          onGridReady={(e) => e.api.hideOverlay()}
        />
      </div>
    </div>
  );
};
