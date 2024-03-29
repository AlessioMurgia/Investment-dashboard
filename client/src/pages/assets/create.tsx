import { Autocomplete, Box, MenuItem, Select, TextField } from "@mui/material";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create, useAutocomplete } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import React from "react";
import { Controller } from "react-hook-form";
import { useGetIdentity } from "@refinedev/core";  
import { FieldValues } from "react-hook-form";

export const AssetCreate: React.FC<IResourceComponentsProps> = () => {
  const { data: user } = useGetIdentity<User>();

  const {
    refineCore: { formLoading, onFinish },
    register,
    control,
    formState: { errors },
    handleSubmit
  } = useForm<IAsset>({mode: "onChange"});

  const submitHandler = async (data: FieldValues) => {
        
    await onFinish({...data, email: user?.email});
};

  const { autocompleteProps: assetTypeAutocompleteProps } = useAutocomplete({
    resource: "types",
  });

  const { autocompleteProps: sectorAutocompleteProps } = useAutocomplete({
    resource: "sectors",
  });

  const { autocompleteProps: areaAutocompleteProps } = useAutocomplete({
    resource: "areas",
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={{ onClick: handleSubmit(submitHandler) }}>
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
          required
          fullWidth
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
          defaultValue={null as any}
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
                  label={"Type"}
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.type?._id}
                  helperText={(errors as any)?.type?._id?.message}
                  required
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name={"sector._id"}
          rules={{ required: "This field is required" }}
          defaultValue={null as any}
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
                  margin="normal"
                  variant="outlined"
                  error={!!(errors as any)?.sector?._id}
                  helperText={(errors as any)?.sector?._id?.message}
                  required
                />
              )}
            />
          )}
        />
        <Controller
          control={control}
          name={"area._id"}
          rules={{ required: "This field is required" }}
          defaultValue={null as any}
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
                  variant="outlined"
                  error={!!(errors as any)?.area?._id}
                  helperText={(errors as any)?.area?._id?.message}
                  required
                />
              )}
            />
          )}
        />
      </Box>
    </Create>
  );
};
interface IAsset {
  title: string;
  value: number;
  amount: number;
  ticker: string;
  type: {
    _id: string;
  };
  sector: {
    _id: string;
  };
  area: {
    _id: string;
  };
}
type User = {
  email: string;
};