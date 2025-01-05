'use client';
import { responsiveFontSizes, createTheme } from "@mui/material/styles";

let theme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'class'
},
  colorSchemes: {
    light: {
      palette: {
          primary: {
              main: "#000000",
            },
          secondary: {
              main: "#ffffff"
            }
      },
    },
    dark: {
      palette: {
        primary: {
              main: "#ffffff",
            },
          secondary: {
              main: "#000000",
            }
      },
    },
  },
  typography: {
    fontFamily: 'var(--font-roboto)',
  }
});
export default theme = responsiveFontSizes(theme);


