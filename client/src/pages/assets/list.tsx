import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { IResourceComponentsProps, useMany } from "@refinedev/core";
import {
  DateField,
  DeleteButton,
  EditButton,
  List,
  MarkdownField,
  ShowButton,
  useDataGrid,
} from "@refinedev/mui";
import React from "react";

export const AssetsList: React.FC<IResourceComponentsProps> = () => {
  const { dataGridProps } = useDataGrid({
    syncWithLocation: true,
  });

  const { data: typeData, isLoading: typeIsLoading } = useMany({
    resource: "types",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.type?._id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });
  const { data: sectorData, isLoading: sectorIsLoading } = useMany({
    resource: "sectors",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.sector?._id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });
  const { data: areaData, isLoading: areaIsLoading } = useMany({
    resource: "areas",
    ids:
      dataGridProps?.rows
        ?.map((item: any) => item?.area?._id)
        .filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!dataGridProps?.rows,
    },
  });

  const columns = React.useMemo<GridColDef[]>(
    () => [
      {
        field: "title",
        flex: 1,
        headerName: "Title",
        minWidth: 50,
      },
      {
        field: "value",
        flex: 1,
        headerName: "Value",
        minWidth: 30,
      },
      {
        field: "amount",
        flex: 1,
        headerName: "Amount",
        minWidth: 30,
      },
      {
        field: "ticker",
        flex: 1,
        headerName: "Ticker",
        minWidth: 40,
      },
      {
        field: "type",
        flex: 1,
        headerName: "Type",
        minWidth: 50,
        valueGetter: ({ row }) => {
          const value = row?.type;
          return value;
        },
        renderCell: function render({ value }) {
          return typeIsLoading ? (
            <>Loading...</>
          ) : (
            typeData?.data?.find((item) => item._id === value)?.title
          );
        },
      },
      {
        field: "sector",
        flex: 1,
        headerName: "Sector",
        minWidth: 50,
        valueGetter: ({ row }) => {
          const value = row?.sector;
          return value;
        },
        renderCell: function render({ value }) {
          return sectorIsLoading ? (
            <>Loading...</>
          ) : (
            sectorData?.data?.find((item) => item._id === value)?.title
          );
        },
      },
      {
        field: "area",
        flex: 1,
        headerName: "Area",
        minWidth: 50,
        valueGetter: ({ row }) => {
          const value = row?.area;
          return value;
        },
        renderCell: function render({ value }) {
          return areaIsLoading ? (
            <>Loading...</>
          ) : (
            areaData?.data?.find((item) => item._id === value)?.title
          );
        },
      },
      {
        field: "createdAt",
        flex: 1,
        headerName: "Created at",
        minWidth: 50,
        renderCell: function render({ value }) {
          return <DateField value={value} />;
        },
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
    [typeData]
  );

  return (
    <List>
      <DataGrid {...dataGridProps} getRowId={(row) => row._id} columns={columns} autoHeight />
    </List>
  );
};
