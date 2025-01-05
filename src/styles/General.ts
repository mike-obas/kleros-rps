import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import Grid from "@mui/material/Grid2"
import Button from "@mui/material/Button"
import Card from "@mui/material/Card"
import Image from 'next/image'
import Container from "@mui/material/Container";
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

 PlainFullHeightBox: styled(Box)(({theme}) => ({
  display: "flex", 
  flexDirection: 'column',
  maxWidth: 600, 
  width: "100%", 
  margin: "auto",
  padding: "8px"
 })),

 PageContainer: styled(Container)(({ theme }) => ({
  height: '100%'
})),

CustomTypo: styled(Typography)(({ theme }) => ({
    maxWidth: "50vw",
    [theme.breakpoints.up(600)]: {
      maxWidth: "30vw",
    },
    [theme.breakpoints.up(900)]: {
      maxWidth: "20vw",
    },
    [theme.breakpoints.up(1100)]: {
      maxWidth: "30vw",
    },
  })),
  customMacroTypo: styled(Typography)(({ theme }) => ({
    maxWidth: "80vw",
    [theme.breakpoints.down(300)]: {
      maxWidth: "70vw",
    },
  })),
  CustomMiniTypo: styled(Typography)(({ theme }) => ({
    maxWidth: "30vw",
    [theme.breakpoints.up(950)]: {
      maxWidth: "50vw",
    },
  })),
  CustomMicroTypo: styled(Typography)(({ theme }) => ({
    maxWidth: "10vw",
    [theme.breakpoints.up(350)]: {
      maxWidth: "15vw",
    },
    [theme.breakpoints.up(950)]: {
      maxWidth: "20vw",
    },
  })),

  VerticalItemCard: styled(Paper)(({ theme }) => ({
    backgroundColor: theme.vars.palette.secondary.light,
    width: "100%",
    height: 'auto',
    display: "flex",
    flexDirection: "column",
    padding: "15px",
    borderRadius: theme.shape.borderRadius * 3,
  })),

HorizontalItemCard: styled(Paper)(({ theme }) => ({
    backgroundColor: theme.vars.palette.secondary.light,
    //...theme.applyStyles("dark", {backgroundColor: theme.palette.secondary.light}),
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    textAlign: "center",
    borderRadius: theme.shape.borderRadius * 3,
  })),

  MainHorizontalItemCard: styled(Card)(({ theme }) => ({
    backgroundColor: theme.vars.palette.secondary.light,
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px",
    textAlign: "center",
    borderRadius: theme.shape.borderRadius * 3,
  })),

  PlainHoriCard: styled(Paper)(({ theme }) => ({
    background: theme.vars.palette.secondary.light,
    width: "100%",
    padding: "15px",
    textAlign: "center",
    borderRadius: theme.shape.borderRadius * 3,
  })),

  ReferralBox: styled(Grid)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius * 3,
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: theme.vars.palette.primary.dark,
    padding: "10px"
  })),

  OutlinedButton: styled(Button)(({theme }) => ({
    background: theme.vars.palette.secondary.light,
    textTransform: "initial",
    borderRadius: theme.shape["borderRadius"] * 1.5,
  })),

Image: styled(Image)({
  width: "100%",
  height: "auto",
  objectFit: "contain"
}),

SearchContainer: styled('div')(({ theme }) => ({
  width: "50%",
  height: 40,
  display: "none", 
  padding: "10px 10px 10px 20px",
  background: theme.vars.palette.secondary.light,
  alignItems: 'center',
  borderRadius: theme.shape.borderRadius * 1,
  [theme.breakpoints.down(930)]: { 
    width: "65%",
},
[theme.breakpoints.up(800)]: { 
  display: "flex", 
},
})),

IconContainer: styled(IconButton)(({ theme }) => ({
  padding: 0,
  marginLeft: 15,
  position: 'relative',
  width: 35,
  height: 35,
  borderRadius: theme.shape.borderRadius * 2
})),

ImageContainer: styled(IconButton)(({ theme }) => ({
  padding: 0,
  borderRadius: theme.shape.borderRadius * 2
})),

InfoContainer: styled(IconButton)(({ theme }) => ({
  padding: "6px",
  height: 10,
  width: 10,
  border: `1.5px solid ${theme.vars.palette.primary.dark} `
})),

UploadImageInput: styled('input')(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  cursor: 'pointer',
  visibility:'hidden'
})),

RoundImageContainer: styled(IconButton)(({ theme }) => ({
  padding: 0,
  borderRadius: theme.shape.borderRadius * 10
})),

}

export default CustomStyles