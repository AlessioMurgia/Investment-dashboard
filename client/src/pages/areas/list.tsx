import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps } from "@refinedev/core";
import {
  DeleteButton,
  EditButton,
  List,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

export const AreasList: React.FC<IResourceComponentsProps> = () => {
  const { dataGridProps } = useDataGrid<IArea>();

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "title",
        flex: 1,
        headerName: "Title",
        minWidth: 200,
      },
      
      {
        field: "actions",
        headerName: "Actions",
        sortable: false,
        renderCell: function render({ row }) {
          return (
            <>
              <EditButton hideText recordItemId={row._id} />
              {/*<ShowButton hideText recordItemId={row._id} />*/}
              <DeleteButton hideText recordItemId={row._id} />
            </>
          );
        },
        align: "center",
        headerAlign: "center",
        minWidth: 80,
      },
    ],
    []
  );

  return (
    <List>
      <DataGrid {...dataGridProps} getRowId={(row) => row._id} columns={columns} autoHeight />
    </List>
  );
};

interface IArea {
  //_id: string;
  title: string;
}
