import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface Props {
    open: boolean
    handleClose: () => void
    text: string 
    autoHideDuration?: null | number
    severity?: "success" | "error" | "warning" | "info",
    verticalAnchor?: "top" | "bottom",
    horizontalAnchor?: "center" | "left" | "right"
}

export default function CustomizedSnackbars({
    open, 
    handleClose, 
    text, 
    autoHideDuration=null,
    severity="success",
    verticalAnchor="top",
    horizontalAnchor="center"
}: Props) {

  return (
      <Snackbar open={open} 
      autoHideDuration={autoHideDuration} 
      onClose={handleClose}
      anchorOrigin={{vertical: verticalAnchor, horizontal: horizontalAnchor}}
      >
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {text}
        </Alert>
      </Snackbar>
  );
}
