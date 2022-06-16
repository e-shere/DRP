import React from "react";
import { DataGrid, GridRowId, GridSelectionModel } from "@mui/x-data-grid";
import Radio from "@mui/material/Radio";
import {TableRow} from "./App";
import Style from "./style";

interface Row {
  id: GridRowId,
  font: string;
  fontSize: number;
  bgColor: string;
}

export default function DataTable(styles: Style[]) {
  const rows: Row[] = [];
  for (let i = 1; i < styles.length + 1; i ++) {
    console.log(`${styles[i - 1]}  style number ${i}`);
    var style: Style = styles[i - 1];
    rows.push({id: i, font: style.font, fontSize: style.fontSize, bgColor: style.bgColor});
  }

  var radioChecked: GridRowId[] = [1];
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