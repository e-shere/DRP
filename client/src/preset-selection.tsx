import React from "react";
import { DataGrid, GridRowId, GridSelectionModel, GridColDef } from "@mui/x-data-grid";
import Radio from "@mui/material/Radio";
import Style from "./style";
import Button from '@mui/material/Button';
import { Tooltip } from "@mui/material";
import { triggerMessageToExtension } from "./scripts";

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
      description:
        'The id of the preset you are submitting',
      width: 150
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
      width: 150
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
      <p className="table-title">Your saved presets:</p>
      <DataGrid 
        className="style-table" 
        rows={rows}
        columns={columns}
        autoHeight
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelectionModel: GridSelectionModel) => {
          setSelectionModel(newSelectionModel);
        }}
      />
      <Button className="style-submission" onClick={(e) => {
        triggerMessageToExtension(e, styles[(Number(selectedRow[0].id) - 1)])
      }}
      variant="contained" style={{width:500, height: 50, fontSize: 20, font: "Courier New (monospace)"}}>Submit preset to extension</Button>
    </div>
  );
}
