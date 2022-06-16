import React from "react";
import { DataGrid, GridRowId, GridSelectionModel, GridColDef } from "@mui/x-data-grid";
import Radio from "@mui/material/Radio";
import {TableRow} from "./App";
import Style from "./style";
import Button from '@mui/material/Button';

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


  const columns: GridColDef[] = [
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
      field: 'id',
      headerName: 'ID',
    },
    {
      field: 'font',
      headerName: 'Font',
      description:
        'The type of font used by this present',
      width: 150
    },
    {
      field: 'fontSize',
      headerName: 'Font Size',
      description:
        'The font size used by this preset',
      width: 40
    },
    {
      field: 'bgColor',
      headerName: 'Background Colour',
      description:
        'The background colour set by the extension',
      width: 150
    },
  ];

  return (
    <div className="style-selection">
      <Button className="style-submission" onClick={() => {
        alert('Style submitted to extension!');
        }} 
        variant="contained">Submit Style</Button>
      {/* You have selected style: {selectedRow[0].id}, {selectedRow[0].font} {selectedRow[0].fontSize} {selectedRow[0].bgColor} */}
      <DataGrid 
        className="style-table" 
        rows={rows}
        columns={columns}
        autoHeight
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelectionModel: GridSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: 'primary.light',
          '& .MuiDataGrid-cell:hover': {
            color: 'primary.main',
          },
        }}
      />
    </div>
  );
}