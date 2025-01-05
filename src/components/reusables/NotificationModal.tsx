import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import CustomButton from './CustomButton';
import DashboardStyles from '@/styles/General';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { GeneralTypes } from '@/utils/generalTypes';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 10
  }
}));

interface Props {
    imageUrl?: string | StaticImport
    title?: string
    subText: string
    link?: string
    open: boolean
    toggleCustomModal: () => void
    handleAction: () => void
    buttonText: string
    textColor: GeneralTypes["color"]
}

function NotificationModal({
    imageUrl, title, link, subText, open, toggleCustomModal, handleAction, buttonText, textColor
}: Props) {

  return (
    <div>
      <BootstrapDialog
        onClose={toggleCustomModal}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="sm"
        fullWidth={true}
      >
         {/* <DialogContent> */}
        
        <DashboardStyles.VerticalItemCard
        elevation={0}
        sx={(theme) => ({ padding: "40px 15px", alignItems: "center" })}
        > 
            {imageUrl ? <Image
                src={imageUrl}
                alt="Notification Icon"
                width={60}
                height={60}
              />
              :
              <CheckCircleIcon color="primary" sx={{fontSize: 80}}/> 
            }
              {title && <Typography color="primary" variant="h6" textAlign={"center"} fontWeight={700} sx={{mt: 2, mb: 0.5}}>
                {title}
                </Typography>
                }
              <Typography 
              variant="subtitle1" 
              color={textColor}
              maxWidth={250}
              lineHeight={1.5}
              mt={title ? 0 : 1}
              textAlign={"center"}
              >
            {subText}
              </Typography>

              {link && 
              <a target="_blank" href={link}>
              Track Tx
            </a>
              }

        <Box sx={{ mt: 2 }}>
          <CustomButton
            text={buttonText}
            textVariant={"subtitle2"}
            height={35}
            loading={false}
            padding="10px 22px"
            disableElevation={true}
            buttonVariant="contained"
            textColor='secondary'
            fullWidth={false}
            onClickHandler={handleAction}
          />
        </Box>
            
        </DashboardStyles.VerticalItemCard>

        {/* </DialogContent> */}
      </BootstrapDialog>
    </div>
  );
}

export default NotificationModal