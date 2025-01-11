"use client";
import React, { useState, useReducer, useEffect } from "react";
import CustomButton from "@/components/reusables/CustomButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import FormCol from "@/components/reusables/FormCol";
import { inputReducer, loadingReducer } from "@/components/reusables/reducers";
import { GeneralTypes } from "@/utils/generalTypes";
import { validateInputData } from "@/utils/validator";
import NotificationModal from "./reusables/NotificationModal";
import { getItem, setItem } from "@/utils/localStorage";
import { encrypt, } from "@/utils/crypting";
import { moves, movesNumber } from "./GameConsole";
import ShortUniqueId from "short-unique-id";
import { Contract, BrowserProvider, parseEther } from "ethers";
import { hasherAbi, hasherAddress, rpsAbi, rpsByteCode } from "@/utils/constants";
import { ContractFactory } from "ethers";
import { getErrorMsg } from "@/utils/filterEntries";
import CustomizedSnackbars from "./reusables/Alert";

const initialInput = {
  customSecretPin: "",
  c1: 0,
  stakeAmount: 0,
  partnerAddress: "",
  customContractAddress: ""
};

const initialLoadingState = {
  buttonLoading: false,
  notificationModal: false,
  openAlert: false
};

export default function CustomItems() {
  const initialError: any = {};
  const [input, setInput] = useReducer(inputReducer, initialInput);
  const [errors, setErrors] = useState(initialError);
  const [loading, setLoading] = useReducer(loadingReducer, initialLoadingState);

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

  const closeAlert = () => startLoading("openAlert", false)

  const currentLocalItems = async () => {
    const getDetails = getItem("gameDetails")
    if(getDetails?.partnerAddress) { 
        updateInput("partnerAddress", `${getDetails?.partnerAddress}`) 
    }
    if(getDetails?.stakeAmount) { 
      updateInput("stakeAmount", Number(getDetails?.stakeAmount)) 
  }
 }

 useEffect(()=> {
    currentLocalItems()
 }, [])

    const closeModal = (event?: GeneralTypes["onChange"], reason?: string) => {
      if (reason !== "backdropClick") {
        startLoading("notificationModal", false)
        startLoading("buttonLoading", false)
        window.location.href = "/"
      }
    }

    const updateGameDetails = async (newPin: string, Newaddr: string, partnerAddress: string, stakeAmount: number) => {
        const encryptedPin = await encrypt(newPin)
        setItem("gameDetails", {
          customSecretPin: encryptedPin, 
          customContractAddress: Newaddr,
          partnerAddress,
          stakeAmount
        })
        updateMultipleInput({partnerAddress, stakeAmount})
        updateInput("c1", 0) 
     }

     const player1MoveSelection = async (player2Move: number) => { 
      updateInput("c1", player2Move) 
     }

  const submitHandler = async () => {
    startLoading("buttonLoading", true);
    setErrors({})
    const { partnerAddress, c1, stakeAmount } = input
    try {
      const uuid = new ShortUniqueId({ length: 18, dictionary: 'number' });
      const customSecretPin = uuid.rnd()
      const payLoad = { partnerAddress, c1, stakeAmount }
      const { valid, validationErrors } = validateInputData(payLoad);
      if (!valid) throw validationErrors;

      // @ts-ignore
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress()
      if(signerAddress === partnerAddress) throw {error: {message: "Please use a different wallet address as a second player."}}

      const contract = new Contract(hasherAddress, hasherAbi, signer);
      const getHashResponse = await contract.hash(input.c1, BigInt(`${customSecretPin}`));
      const hasherTxResult = await getHashResponse
      const factory = new ContractFactory(rpsAbi, rpsByteCode, signer);
      const rpsContract = await factory.deploy(hasherTxResult, partnerAddress, {value: parseEther(`${stakeAmount}`)})
      await rpsContract.waitForDeployment()
      await rpsContract.deploymentTransaction()?.wait()
      const customContractAddress = await rpsContract.getAddress();
      updateGameDetails(customSecretPin, customContractAddress, partnerAddress, stakeAmount)
      return startLoading("notificationModal", true)
    } catch (errs: any) {
      startLoading("buttonLoading", false);
      const errMsg = getErrorMsg(JSON.stringify(errs))
      if(errMsg !== "Unknown Error") {
       setErrors({errMsg})
       startLoading("openAlert", true)
       } else { setErrors(errs) }
    }
  };

  const welcomeMsg = `A Web3 Rock Paper Scissors Game Extension`

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
            <Grid size={12}>
          <Typography variant={"subtitle1"} color={"primary"} fontWeight={500}>
          Choose Move
        </Typography>
        </Grid>
          {movesNumber.map((item: number) => (<Grid key={item}>
          <Chip 
            icon={moves[item as keyof typeof moves].icon}
            label={`${moves[item as keyof typeof moves].text}`} 
            disabled={loading.buttonLoading}
            variant="filled" 
            sx={(theme) => ({
              padding: "0px 4px",
              border: `${input.c1 === item ? "1px" : "0px"} solid lightgrey`,
              backgroundColor: input.c1 === item ? theme.vars.palette.secondary.main  : theme.vars.palette.secondary.light,
              '& .MuiChip-label': {
                color: theme.vars.palette.primary.main,
              }
            })} 
            onClick={() => player1MoveSelection(item)}
            />
            </Grid>))}

            {errors?.c1 && <Grid size={12}>
          <Typography variant={"caption"} color={"error"} fontWeight={500}>
         {"Please Select a Move"}
          </Typography>
          </Grid>}

          <FormCol
              name="stakeAmount"
              id="stakeAmount"
              value={input.stakeAmount}
              onChangeHandler={formHandler}
              placeholder="Stake Amount"
              title={"Stake Amount"}
              xs={12}
              md={12}
              error={errors?.stakeAmount}
              type={"number"}
              size="small"
              textWeight={500}
            /> 

            <FormCol
              name="partnerAddress"
              id="partnerAddress"
              value={input.partnerAddress}
              onChangeHandler={formHandler}
              placeholder="Partner Wallet Address"
              title={"Choose Partner"}
              xs={12}
              md={12}
              error={errors?.partnerAddress}
              type={"text"}
              size="small"
              textWeight={500}
            /> 
          </Grid>
      </Box>

      <CustomButton
        text="Create Game"
        textVariant="subtitle1"
        loading={loading.buttonLoading}
        height={40}
        disabledOnly={false}
        onClickHandler={submitHandler}
        textColor={"secondary"}
        fullWidthOnSm
      />

    <NotificationModal
    subText={"Game created successfully. Your partner can now play!"}
    open={loading.notificationModal}
    toggleCustomModal={closeModal}
    handleAction={closeModal}
    buttonText={"Okay"}
    textColor="success"
    />
     <CustomizedSnackbars
    open={loading.openAlert} 
    handleClose={closeAlert}
    text={`${errors?.errMsg}`}
    severity="error"
    verticalAnchor="bottom"
    horizontalAnchor="right"
    />
    </Box>
  );
}
