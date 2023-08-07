import { ColDef } from "ag-grid-community";

export const gitPrColDefs: ColDef[] = [
  {
    headerName: "#",
    valueFormatter: (param) => {
        return String((param.node?.rowIndex ?? 0) + 1)
    },
    width: 50
  },
  {
    headerName: "Pull Request",
    field: "html_url",
    flex: 1,
    tooltipField: 'html_url'
  },
  {
    headerName: "Assignee",
    field: "assignee",
    valueFormatter: (param) => {
        return param.value.login
    },
    sortable: true,
    sort: 'asc'
  },
];
