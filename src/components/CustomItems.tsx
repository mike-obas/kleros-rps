"use client";
import React, { useState, useReducer, useEffect } from "react";
import CustomStyles from "@/styles/General";
import CustomButton from "@/components/reusables/CustomButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid2";
import FormCol from "@/components/reusables/FormCol";
import { inputReducer, loadingReducer } from "@/components/reusables/reducers";
import { GeneralTypes } from "@/utils/generalTypes";
import { validateInputData } from "@/utils/validator";
import NotificationModal from "./reusables/NotificationModal";
import { customErrorObj } from "@/utils/customErrorObj";
import { rifineErrMsg } from "@/utils/filterEntries";
import { getItem, setItem } from "@/utils/localStorage";
import { decrypt, encrypt, } from "@/utils/crypting";
import PasswordFormCol from "./reusables/PasswordFormCol";
import { useRouter } from "next/navigation";

const initialInput = {
  customSecretPin: "",
  customContractAddress: ""
};

const initialLoadingState = {
  buttonLoading: false,
  notificationModal: false,
};

export default function CustomItems() {
  const initialError: any = {};
  const [input, setInput] = useReducer(inputReducer, initialInput);
  const [errors, setErrors] = useState(initialError);
  const [loading, setLoading] = useReducer(loadingReducer, initialLoadingState);
  const navigate = useRouter()

  const startLoading = (loadingType: string, value: boolean | string) => {
    setLoading({
      type: "setLoading",
      loadingType: loadingType,
      value: value,
    });
  };

  const updateInput = (field: string, value: any) => {
    setInput({
      type: "insertValue",
      field: field,
      fieldValue: value,
    });
  };

  const updateMultipleInput = (values: any) => {
    setInput({
      type: "insertAllValues",
      serverData: values,
    });
  };

  const formHandler = (e: GeneralTypes["onChange"]) => {
    const { name, value } = e.currentTarget || e.target;
    setInput({
      type: "insertValue",
      field: name,
      fieldValue: value,
    });
  };

  const currentLocalItems = async () => {
    const getDetails = getItem("gameDetails")
    if(getDetails?.customSecretPin) { updateInput("customSecretPin", "") }
    if(getDetails?.customContractAddress) { 
        updateInput("customContractAddress", `${getDetails?.customContractAddress}`) 
    }
 }

 useEffect(()=> {
    currentLocalItems()
 }, [])

    const closeModal = (event?: GeneralTypes["onChange"], reason?: string) => {
      if (reason !== "backdropClick") {
        startLoading("notificationModal", false)
        startLoading("buttonLoading", false)
        navigate.refresh()
      }
    }

    const updateGameDetails = async (newPin: string, Newaddr: string) => {
        const encryptedPin = await encrypt(newPin)
        setItem("gameDetails", {customSecretPin: encryptedPin, customContractAddress: Newaddr})
        updateMultipleInput({customSecretPin: "", customContractAddress: Newaddr})
     }

    //  const decryptPinToSee = async () => {
    //     const getDetails = getItem("gameDetails")
    //     if(getDetails?.customSecretPin) { 
    //         console.log(await decrypt(getDetails?.customSecretPin))
    //      }
    //  }

  const submitHandler = async () => {
    startLoading("buttonLoading", true);
    setErrors({})
    const { customContractAddress, customSecretPin } = input
    try {
      const payLoad = { customContractAddress, customSecretPin }
      const { valid, validationErrors } = validateInputData(payLoad);
      if (!valid) throw validationErrors;
      updateGameDetails(customSecretPin, customContractAddress)
      return startLoading("notificationModal", true)
    } catch (errs: any) {
      //const { msgObj } = customErrorObj(errs);
      startLoading("buttonLoading", false);
      setErrors(errs);
    }
  };

  const welcomeMsg = `Welcome to KLEROS RPS Game`

  return (
      <Box>
          <Typography textAlign={"center"} sx={{my: 5}} variant="h6" color="primary" fontWeight={500}>
            {welcomeMsg}
          </Typography>

          <Box>
          <Grid
            container
            spacing={1}
            sx={{ width: '100%' }}
            rowSpacing={2}
            flex={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <PasswordFormCol
              name="customSecretPin"
              id="customSecretPin"
              value={input.customSecretPin}
              onChangeHandler={formHandler}
              placeholder="Secret pin"
              title={"Custom Secret Pin (Salt)"}
              xs={12}
              md={12}
              error={errors?.customSecretPin}
              type={"number"}
              size="small"
              textWeight={500}
            />
            <FormCol
              name="customContractAddress"
              id="customContractAddress"
              value={input.customContractAddress}
              onChangeHandler={formHandler}
              placeholder="Contract Address"
              title={"Custom Contract Address"}
              xs={12}
              md={12}
              error={errors?.customContractAddress}
              type={"text"}
              size="small"
              textWeight={500}
            />
          </Grid>
      </Box>

      <CustomButton
        text="Use Custom Details"
        textVariant="subtitle1"
        loading={loading.buttonLoading}
        height={40}
        disabledOnly={false}
        onClickHandler={submitHandler}
        textColor={"secondary"}
        fullWidthOnSm
      />
      <Box>
      {errors.isError && <Typography 
      sx={{mt: 1}} 
      color="error" 
      variant='caption' 
      fontWeight={600}>
      {rifineErrMsg(errors?.error?.message)}
      </Typography>
      }
      </Box>

    <NotificationModal
    subText={"Game details updated successfully. You can now play another round!"}
    open={loading.notificationModal}
    toggleCustomModal={closeModal}
    handleAction={closeModal}
    buttonText={"Okay"}
    textColor="success"
    />
    </Box>
  );
}
