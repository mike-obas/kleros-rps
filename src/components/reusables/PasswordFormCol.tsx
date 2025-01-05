import React from "react";
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from "@mui/material/Typography";
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormHelperText from '@mui/material/FormHelperText';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { GeneralTypes } from "@/utils/generalTypes";

const CustomTextField = styled(FormControl)(({ theme }) => ({
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
    showPassword?: boolean
    disableShowPassword?: boolean
    onClickHandler?: ()=>void 
    handleClickShowPassword?: ()=>void 
    handleMouseDownPassword?: ()=>void 
    ref?: any
    onBlurHandler?: ()=>void
    size?: "small" | "medium"
    textWeight?: number
    textColor?: string
    textVariant?: GeneralTypes["textVariant"]
  }

export default function PasswordFormCol({
  name,
  id,
  value,
  onChangeHandler,
  placeholder,
  title,
  xs,
  md,
  error,
  size="small",
  showPassword=false,
  disableShowPassword=true,
  handleClickShowPassword,
  handleMouseDownPassword,
  readOnly=false,
  type="text",
  multiline=false,
  required=true
}: Props) {
  return (
    <Grid size={{xs: xs, md: md}}>
        <Typography variant="subtitle1" sx={{mb: 0.5}} fontWeight={600}>
          {title}
        </Typography>
        <CustomTextField sx={{ minWidth: 120 }} size={size} fullWidth error={error ? true : false} variant="outlined">
          <OutlinedInput
            id={id}
            placeholder={placeholder}
            type={showPassword ? type : 'password'}
            name={name}
            required={required}
            readOnly={readOnly}
            multiline={multiline}
            minRows={4}
            value={value}
            onChange={onChangeHandler}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                    disabled={disableShowPassword}
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        <FormHelperText>{error && error}</FormHelperText>
        </CustomTextField>
    </Grid>
  );
}
