import { Autocomplete, Box, Select, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";
import { useGetIdentity } from "@refinedev/core";  
import { FieldValues } from "react-hook-form";
import { useParams } from "react-router-dom";

export const AssetEdit: React.FC<IResourceComponentsProps> = () => {
  const { data: user } = useGetIdentity<User>();
  const { id } = useParams<{ id: string }>();
  const {
    handleSubmit,
    refineCore: { queryResult, onFinish,formLoading },
    register,
    control,
    formState: { errors },
  } = useForm<IAsset>({mode: "onChange"});

  const submitHandler = async (data: FieldValues) => {
    
    await onFinish({...data, id, email: user?.email});
  };

  const assetsData = queryResult?.data?.data;
  const { autocompleteProps: assetTypeAutocompleteProps } = useAutocomplete({
    resource: "types",
    defaultValue: assetsData?.type
  });

  const { autocompleteProps: sectorAutocompleteProps } = useAutocomplete({
    resource: "sectors",
    defaultValue: assetsData?.sector

  });
  const { autocompleteProps: areaAutocompleteProps } = useAutocomplete({
    resource: "areas",
    defaultValue: assetsData?.area

  });
  return (
    <Edit isLoading={formLoading} saveButtonProps={{ onClick: handleSubmit(submitHandler) }}>
      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column" }}
        autoComplete="off"
      >
        <TextField
          {...register("title", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.title}
          helperText={(errors as any)?.title?.message}
          margin="normal"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          type="text"
          label={"Title"}
          name="title"
        />
        <TextField
          {...register("value", {
            required: "This field is required",
          })}
          error={!!(errors as any)?.value}
          helperText={(errors as any)?.value?.message}
          margin="normal"
          fullWidth
          required
          InputLabelProps={{ shrink: true }}
          type="number"
          label={"Value"}
          name="value"
        />
        <TextField
          {...register("amount")}
          error={!!(errors as any)?.amount}
          helperText={(errors as any)?.amount?.message}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          type="number"
          label={"Amount"}
          name="amount"
        />
        <TextField
          {...register("ticker")}
          error={!!(errors as any)?.ticker}
          helperText={(errors as any)?.content?.ticker}
          margin="normal"
          fullWidth
          InputLabelProps={{ shrink: true }}
          label={"Ticker"}
          name="ticker"
        />

        <Controller
          control={control}
          name={"type._id"}
          rules={{ required: "This field is required" }}
          defaultValue={assetsData?.type}
          render={({ field }) => (
            <Autocomplete
              {...assetTypeAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value._id);
              }}
              getOptionLabel={(item) => {
                return (
                  assetTypeAutocompleteProps?.options?.find((p) => {
                    const itemId =
                      typeof item === "object"
                        ? item?._id?.toString()
                        : item?.toString();
                    const pId = p?._id?.toString();
                    return itemId === pId;
                  })?.title ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) => {
                const optionId = option?._id?.toString();
                const valueId =
                  typeof value === "object"
                    ? value?._id?.toString()
                    : value?.toString();
                return value === undefined || optionId === valueId;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label={"Type"}
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.tyep?._id}
                  helperText={(errors as any)?.type?._id?.message}
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name={"sector._id"}
          rules={{ required: "This field is required" }}
          defaultValue={assetsData?.sector}
          render={({ field }) => (
            <Autocomplete
              {...sectorAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value._id);
              }}
              getOptionLabel={(item) => {
                return (
                  sectorAutocompleteProps?.options?.find((p) => {
                    const itemId =
                      typeof item === "object"
                        ? item?._id?.toString()
                        : item?.toString();
                    const pId = p?._id?.toString();
                    return itemId === pId;
                  })?.title ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) => {
                const optionId = option?._id?.toString();
                const valueId =
                  typeof value === "object"
                    ? value?._id?.toString()
                    : value?.toString();
                return value === undefined || optionId === valueId;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Sector"}
                  required
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.sector?._id}
                  helperText={(errors as any)?.sector?._id?.message}
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name={"area._id"}
          rules={{ required: "This field is required" }}
          defaultValue={assetsData?.area}
          render={({ field }) => (
            <Autocomplete
              {...areaAutocompleteProps}
              {...field}
              onChange={(_, value) => {
                field.onChange(value._id);
              }}
              getOptionLabel={(item) => {
                return (
                  areaAutocompleteProps?.options?.find((p) => {
                    const itemId =
                      typeof item === "object"
                        ? item?._id?.toString()
                        : item?.toString();
                    const pId = p?._id?.toString();
                    return itemId === pId;
                  })?.title ?? ""
                );
              }}
              isOptionEqualToValue={(option, value) => {
                const optionId = option?._id?.toString();
                const valueId =
                  typeof value === "object"
                    ? value?._id?.toString()
                    : value?.toString();
                return value === undefined || optionId === valueId;
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={"Area"}
                  margin="normal"
                  required
                  variant="outlined"
                  error={!!(errors as any)?.area?._id}
                  helperText={(errors as any)?.area?._id?.message}
                />
              )}
            />
          )}
        />
      </Box>
    </Edit>
  );
};
interface IAsset {
  title: string;
  value: number;
  amount: number;
  ticker: string;
  type:string;
  sector:string;
  area:string;
}
type User = {
  email: string;
};