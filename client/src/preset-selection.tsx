import React from "react";
import { DataGrid, GridRowId, GridSelectionModel } from "@mui/x-data-grid";
import Radio from "@mui/material/Radio";
import {TableRow} from "./App";
import Style from "./style";



export default function DataTable(styles: Style[]) {
  const rows: TableRow[] = [];
  for (let i = 0; i < styles.length; i ++) {
    rows.push({id: i, style: styles[i]})
  }
  let radioChecked: GridRowId[] = [rows[0].id];
  const [selectionModel, setSelectionModel] = React.useState<GridRowId[]>([]);
  radioChecked = selectionModel;

  const selectedRow = rows.filter((item) => {
    return item.id === selectionModel[0];
  });


  


const columns = [
  {
    field: "radiobutton",
    headerName: "",
    width: 100,
    sortable: false,
    renderCell: (params: any) => (
      <Radio checked={radioChecked[0] === params.id} value={params.id} />
    )
  },
  {
    field: "id",
    headerName: "ID"
  },
  {
    field: "style",
    headerName: "Style",
    width: 150
  },
];

  return (
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelectionModel: GridSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
      />
  );
}