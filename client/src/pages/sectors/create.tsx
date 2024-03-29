import { Box, TextField } from "@mui/material";
import { IResourceComponentsProps } from "@refinedev/core";
import { Create } from "@refinedev/mui";
import { useForm } from "@refinedev/react-hook-form";
import { FieldValues } from "react-hook-form";
import { useGetIdentity } from "@refinedev/core";  


export const SectorCreate: React.FC<IResourceComponentsProps> = () => {
    const { data: user } = useGetIdentity<User>();

    const {
        refineCore: { formLoading, onFinish },
        register,
        formState: { errors },
        handleSubmit
    } = useForm<ISector>({mode: "onChange"});

    const submitHandler = async (data: FieldValues) => {
        
        await onFinish({...data, email: user?.email});
    };

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
            InputLabelProps={{ shrink: true }}
            type="text"
            label={"Title"}
            name="title"
            />
        </Box>
        </Create>
    );
};

interface ISector {
    title: string;
  }

type User = {
    email: string;
  };