import React from "react";
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import { GeneralTypes } from "@/utils/generalTypes";

const CustomTextField = styled(TextField)(({ theme }) => ({
    '& label.Mui-focused': {
      color: theme.palette.secondary
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: theme.palette.secondary,
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderRadius: 7,
        borderColor: theme.palette.primary.dark,
        // background: theme.palette.secondary.light,
      },
      '&:hover fieldset': {
        borderColor: theme.palette.secondary,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.secondary,
      },
    },
  }))

  type Props = {
    name: string
    id: string
    value: any
    onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void
    placeholder: string
    title: string
    xs?: number
    md?: number
    error?: any
    type?: string
    variant?: "outlined"
    readOnly?: boolean
    multiline?: boolean
    required?: boolean
    onClickHandler?: ()=>void 
    ref?: any
    onBlurHandler?: ()=>void
    size?: "small" | "medium"
    textWeight?: number
    textColor?: string
    textVariant?: GeneralTypes["textVariant"]
  }

export default function FormCol({
  name,
  id,
  value,
  onChangeHandler,
  placeholder,
  title,
  xs,
  md,
  error,
  type,
  variant="outlined",
  readOnly=false,
  multiline=false,
  required=true,
  onClickHandler,
  ref=null,
  onBlurHandler,
  size="small",
  textWeight=600,
  textColor="primary",
  textVariant="subtitle1"
}: Props) {
  return (
    <Grid size={{xs: xs, md: md}}>
        <Typography variant={textVariant} sx={{mb: 0.5}} color={textColor} fontWeight={textWeight}>
          {title}
        </Typography>
        <CustomTextField
        variant={variant}
        size={`${size}`}
        error={error ? true : false}
        helperText={error && error}
        fullWidth
        type={type}
        id={id}
        name={name}
        required={required}
        multiline={multiline}
        minRows={4}
        value={value}
        onChange={onChangeHandler}
        onClick={onClickHandler}
        placeholder={placeholder}
        ref={ref}
        onBlur={onBlurHandler}
        InputProps={{
            readOnly: readOnly,
          }}
        />
    </Grid>
  );
}
