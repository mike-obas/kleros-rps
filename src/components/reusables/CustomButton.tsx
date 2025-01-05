import React from 'react'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CircularProgress from "./CircularProgress"
import { useTheme } from "@mui/material/styles"
import { GeneralTypes } from "@/utils/generalTypes";

interface Props {
    text: string | any
    textColor?: string
    textVariant: GeneralTypes["textVariant"]
    loading: boolean
    disabledOnly?: boolean
    height?: number | string
    padding?: string | null
    onClickHandler: () => void
    disableElevation?: boolean
    buttonVariant?: GeneralTypes["buttonVariant"]
    backgroundColor?: GeneralTypes["color"] | any
    startIcon?: React.ReactNode | null
    endIcon?: React.ReactNode | null
    mt?: number
    borderRadius?: number
    fullWidth?: boolean
    fullWidthOnSm?: boolean
    fontWeight?: number
}

function CustomButton({
    text,
    textColor="primary",
    textVariant="subtitle2",
    loading,
    disabledOnly,
    height=40,
    padding=null,
    onClickHandler,
    disableElevation=false,
    buttonVariant="contained",
    backgroundColor="primary",
    fullWidth=true,
    startIcon=null,
    endIcon=null,
    mt=2,
    borderRadius=1.5,
    fullWidthOnSm=false,
    fontWeight=500
}: Props) {

    const theme  = useTheme()

  return (
    <Button 
    disabled={loading || disabledOnly}
    disableElevation ={disableElevation}
    fullWidth={fullWidth}
    onClick={onClickHandler}
    //color={backgroundColor}
    startIcon={startIcon}
    endIcon={endIcon}
    sx={{
        backgroundColor: backgroundColor,
        position: 'relative',
        mt: mt, borderRadius: borderRadius, 
        padding:  padding ? padding : "12px 20px",
        height: height,
        width: fullWidthOnSm ? {xs: '100%', md: '100%'} : 'auto',
        "&:disabled": {
            //backgroundColor: 'rgba(0,0,0,0.5)',
           //color: theme.palette.secondary.light0,
        }
    }} 
    variant={buttonVariant}
    >
         <Typography variant={textVariant} color={textColor}
        fontWeight={fontWeight} textTransform="initial" lineHeight={1.2}>
            {text}
        </Typography>
        { loading && <CircularProgress /> }
    </Button>
  )
}

export default CustomButton