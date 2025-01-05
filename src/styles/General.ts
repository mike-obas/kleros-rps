import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box"
import type {} from '@mui/material/themeCssVarsAugmentation';

const CustomStyles = {
 FullHeightBox: styled(Box)(({theme}) => ({
  display: "flex", 
  flexDirection: 'column',
  maxWidth: 600, 
  overflowX: "scroll",
  width: "100%", 
  margin: "auto",
  padding: "30px 8px"
 })),

  VerticalItemCard: styled(Paper)(({ theme }) => ({
    backgroundColor: theme.vars.palette.secondary.light,
    width: "100%",
    height: 'auto',
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    borderRadius: theme.shape.borderRadius * 3,
  }))
}

export default CustomStyles