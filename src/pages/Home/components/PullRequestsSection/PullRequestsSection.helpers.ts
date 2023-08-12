import { ColDef } from "ag-grid-community";
import { TPullRequests } from "./PullRequestsSection.types";

export const gitPrColDefs: ColDef<TPullRequests[number]>[] = [
  {
    headerName: "#",
    valueFormatter: (param) => {
        return String((param.node?.rowIndex ?? 0) + 1)
    },
    width: 60
  },
  {
    headerName: "Pull Request",
    field: "html_url",
    flex: 1,
    tooltipField: 'html_url'
  },
  {
    headerName: "Title",
    field: "title",
    minWidth: 300,
  },
  {
    headerName: "Assignee",
    field: "assignee.login",
    sortable: true,
    sort: 'asc'
  },
];
