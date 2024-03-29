import { Box, TextField } from "@mui/material";
import { IResourceComponentsProps } from "@refinedev/core";
import { Edit } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { useGetIdentity } from "@refinedev/core";  
import { FieldValues } from "react-hook-form";
import { useParams } from "react-router-dom";

export const AreaEdit: React.FC<IResourceComponentsProps> = () => {
    const { data: user } = useGetIdentity<User>();
    const { id } = useParams<{ id: string }>();
    const {
        refineCore: { onFinish, formLoading },
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<IArea>({mode: "onChange"});

    const submitHandler = async (data: FieldValues) => {
            
        await onFinish({...data, id, email: user?.email});
    };

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

            
        </Box>
        </Edit>
    );
};

interface IArea {
    title: string;
  }
  type User = {
    email: string;
  };