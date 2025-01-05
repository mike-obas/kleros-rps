"use client";
import React, { useState, useReducer, useEffect } from "react";
import CustomButton from "@/components/reusables/CustomButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import { inputReducer, loadingReducer } from "@/components/reusables/reducers";
import { GeneralTypes } from "@/utils/generalTypes";
import { validateInputData } from "@/utils/validator";
import NotificationModal from "./reusables/NotificationModal";
import { customErrorObj } from "@/utils/customErrorObj";
import { convertToNumber, convertToPlainNumber, getTimeFromOnChain, rifineErrMsg } from "@/utils/filterEntries";
import { getItem, setItem } from "@/utils/localStorage";
import { decrypt, encrypt, } from "@/utils/crypting";
import Divider from "@mui/material/Divider";
import { BrowserProvider, Contract, solidityPackedKeccak256, keccak256 } from "ethers";
import CustomizedSnackbars from "./reusables/Alert";
import { rpsAbi } from "@/utils/constants";
import CircularProgress from "@/components/reusables/CircularProgress";
import RockIcon from '@mui/icons-material/Icecream';
import PaperIcon from '@mui/icons-material/Description';
import ScissorsIcon from '@mui/icons-material/ContentCut';
import SpockIcon from '@mui/icons-material/Wash';
import LizardIcon from '@mui/icons-material/Toll';
import dayjs from "dayjs";

const initialInput = {
  customSecretPin: "",
  customContractAddress: "",
  connectedWallerAddress: "",
  // contract read details
  j1: "",
  j2: "",
  c1Hash: "",
  c1: 0,
  c2: 0,
  stake: 0,
  TIMEOUT: "",
  lastAction: "",
};

const initialLoadingState = {
  preLoading: true,
  buttonLoading: false,
  notificationModal: false,
  noMetaMask: false,
  connected: false,
  openAlert: false
};

export default function GameConsole() {
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

  const closeAlert = () => startLoading("openAlert", false)

  const getErrorMsg = (errString: string) => {
    const errObj = JSON.parse(errString)
    return errObj?.shortMessage || errObj?.error?.message || errObj?.info?.error?.message
  }

  const connectWallet = async () => {
    // @ts-ignore
    if (typeof window.ethereum !== "undefined") {
        // @ts-ignore
        const provider = new BrowserProvider(window.ethereum)

      try {
        if(!loading.connected){
        const signer = await provider.getSigner();
        const walletAddress = await signer.getAddress()
        updateInput("connectedWallerAddress", walletAddress)
        startLoading("connected", true);
        } else {
            // @ts-ignore
            //window.ethereum.selectedAddress = null
            await window.ethereum.request({
            "method": "wallet_revokePermissions",
            "params": [
              {
                eth_accounts: {}
              }
            ],
            });
            startLoading("connected", false);
            // re-connect
            const signer = await provider.getSigner();
            const walletAddress = await signer.getAddress()
            updateInput("connectedWallerAddress", walletAddress)
            startLoading("connected", true);
        }
      } catch (error: any) {
        const errMsg = getErrorMsg(JSON.stringify(error))
        setErrors({...errors, errMsg})
        startLoading("openAlert", true)
      }
    } else {
      startLoading("noMetaMask", true);
    }
  };

  const getContractDetails = async () => {
    const getDetails = getItem("gameDetails")
    if(getDetails?.customContractAddress) { 
      startLoading("preLoading", true)
        updateInput("customContractAddress", `${getDetails?.customContractAddress}`) 
        // @ts-ignore
        const provider = new BrowserProvider(window.ethereum)
        const signer = await provider.getSigner();
        const contract = new Contract(getDetails?.customContractAddress, rpsAbi, signer);
        const readData = {
          j1: await contract.j1(),
          j2: await contract.j2(),
          c1Hash: await contract.c1Hash(),
          c2: convertToPlainNumber(await contract.c2()),
          stake: convertToNumber(await contract.stake()),
          TIMEOUT: getTimeFromOnChain(await contract.TIMEOUT()),
          lastAction: getTimeFromOnChain(await contract.lastAction()),
      }
        console.log(readData)
        updateMultipleInput(readData)
        startLoading("preLoading", false)
    }
 }

 useEffect(()=> {
  if(loading.connected) {getContractDetails()}
 }, [loading.connected])

    const closeModal = (event?: GeneralTypes["onChange"], reason?: string) => {
      updateInput("c1", 0)
      if (reason !== "backdropClick") {
        startLoading("notificationModal", false)
        startLoading("buttonLoading", false)
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

    const revealPlayer1Move = async () => { 
      const moves = [0, 1, 2, 3, 4, 5]
      const getDetails = getItem("gameDetails")
        if(getDetails?.customSecretPin) { 
        const salt = await decrypt(getDetails?.customSecretPin) 
        const result = moves.filter((value: number) => {
        const currentMove = solidityPackedKeccak256([ "uint8", "uint256" ], [ value, BigInt(`${salt}`) ])
        return currentMove === input.c1Hash
      })
      updateInput("c1", result[0])
      return result[0]
    }
    }


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

  const connectedWallerAddress = input.connectedWallerAddress
  const hasConneted = loading.connected && connectedWallerAddress
  const player1isActive = hasConneted && connectedWallerAddress === input.j1
  const player2isActive = hasConneted && connectedWallerAddress === input.j2
  const activePlayerText = player1isActive ? "Player 1" : player2isActive ? "Player 2" : "Unknown Player"

  const connectedWalletText = hasConneted
    ? `${activePlayerText}: ${connectedWallerAddress.slice(
        0,
        6
      )}...${connectedWallerAddress.slice(connectedWallerAddress.length - 4)} Connected!`
    : ""
    const moves = { // Reference: https://en.wikipedia.org/wiki/Rock_paper_scissors#Additional_weapons
      0: { text: "Null", winsAgainst: [], icon: <></> },
      1: {
        text: "Rock",
        winsAgainst: [3, 5],
        icon: <RockIcon />
      },
      2: {
        text: "Paper",
        winsAgainst: [1, 4],
        icon: <PaperIcon />
      },
      3: {
        text: "Scissors",
        winsAgainst: [2, 5],
        icon: <ScissorsIcon />
      },
      4: {
        text: "Spock",
        winsAgainst: [1, 3],
        icon: <SpockIcon />
      },
      5: {
        text: "Lizard",
        winsAgainst: [2, 4],
        icon: <LizardIcon />
      },
    }
    const movesNumber = [1, 2, 3, 4, 5]
    const selectedMovesNumber = [input.c1, input.c2]

    const getWinner = async () => { 
      const c1 = input.c1
      const c2 = input.c2
      const possibleWinsForC1: number[]  = moves[c1 as keyof typeof moves].winsAgainst
      const player1Wins = possibleWinsForC1.includes(c2)
      return player1Wins ? "Player 1" : "Player 2"
    }

    const bothHasPlayed = input.c1Hash !== "" && input.c2 > 0
    const shouldUpdateGameDetails = input.c1Hash !== "" && input.c2 > 0 && input.stake === 0

    const timeHasPassed = () => {
      if(input.lastAction === "" ) return
      const lastActionTime = dayjs(`${input.lastAction}`).valueOf()
    const TIMEOUT = dayjs(`${input.TIMEOUT}`).valueOf()
    const currentTime = dayjs(new Date().toJSON()).valueOf();
    const timeHasElapsed = currentTime > lastActionTime + TIMEOUT
    return timeHasElapsed
    }

  return (
    <Box>
      <Divider sx={(theme)=> ({borderColor: `${theme.vars.palette.secondary}`, my: 4})} />
          <Grid
            container
            spacing={1}
            sx={{ width: '100%' }}
            rowSpacing={2}
            flex={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={{xs: 12}}>
              <Typography variant="subtitle1" color="success">{connectedWalletText}</Typography>
            <CustomButton
            text={
                loading.noMetaMask
                  ? "Please install Metamask"
                  : loading.connected
                  ? "Switch Account"
                  : "Connect Wallet"
              }
            textVariant="subtitle1"
            mt={1}
            loading={loading.buttonLoading}
            height={40}
            disabledOnly={false}
            onClickHandler={connectWallet}
            textColor={"secondary"}
            fullWidthOnSm
        />
        </Grid>
          </Grid>

          

      
      <Box sx={{mt: 1}}>
      {loading.connected && loading.preLoading ? (
          <Grid container justifyContent="center" sx={{ py: 5, position: "relative" }}>
            <CircularProgress />
          </Grid>
        ) : loading.connected && !loading.preLoading ?

        <Box sx={{pb: 8}}>
          <Typography sx={{mt: 4, mb: 2}} variant="h6" color="primary" fontWeight={500}>
            {"Player 1 Console"}
          </Typography>
          <Grid
            container
            spacing={1}
            sx={{ width: '100%' }}
            rowSpacing={2}
            flex={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid size={{xs: 12, sm: 6}}>
            <CustomButton
            text="Reward Winner"
            textVariant="subtitle1"
            mt={1}
            loading={loading.buttonLoading}
            height={40}
            disabledOnly={!bothHasPlayed}
            onClickHandler={()=>{}}
            textColor={"secondary"}
            fullWidthOnSm
        />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
            <CustomButton
            text="Time Cash Out"
            textVariant="subtitle1"
            mt={1}
            loading={loading.buttonLoading}
            height={40}
            disabledOnly={timeHasPassed()}
            onClickHandler={()=>{}}
            textColor={"secondary"}
            fullWidthOnSm
        />
        </Grid>
          </Grid>


          <Divider sx={(theme)=> ({borderColor: `${theme.vars.palette.secondary}`, my: 3})} />
          {/* Player 2 */}
          <Typography sx={{my: 2}} variant="h6" color="primary" fontWeight={500}>
            {"Player 2 Console"}
          </Typography>

          <Grid
            container
            spacing={1}
            sx={{ width: '100%' }}
            rowSpacing={2}
            flex={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
          {movesNumber.map((item: number) => (<Grid key={item}>
          <Chip 
            icon={moves[item as keyof typeof moves].icon}
            label={`${moves[item as keyof typeof moves].text}`} 
            disabled={bothHasPlayed}
            variant="filled" 
            sx={(theme) => ({
              padding: "0px 4px",
              backgroundColor: theme.vars.palette.secondary.light,
              '& .MuiChip-label': {
                color: theme.vars.palette.primary.main,
              }
            })} 
            onClick={()=>{}}
            />
            </Grid>))}
            </Grid>

          {bothHasPlayed &&
          <Box>
            <Divider sx={(theme)=> ({borderColor: `${theme.vars.palette.secondary}`, my: 3})} />
          <Typography sx={{my: 2}} variant="h6" color="primary" fontWeight={500}>
            {"Selected Moves"}
          </Typography>

          <Grid
            container
            spacing={1}
            sx={{ width: '100%' }}
            rowSpacing={2}
            flex={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
          {selectedMovesNumber.map((item: number, index: number) => (<Grid key={item}>
          <Chip 
            icon={moves[item as keyof typeof moves].icon}
            label={`${moves[item as keyof typeof moves].text} (Player ${index})`} 
            disabled={bothHasPlayed}
            variant="filled" 
            sx={(theme) => ({
              padding: "0px 4px",
              backgroundColor: theme.vars.palette.secondary.light,
              '& .MuiChip-label': {
                color: theme.vars.palette.primary.main,
              }
            })} 
            onClick={()=>{}}
            />
            </Grid>))}
            </Grid>
            </Box>
            }

        {shouldUpdateGameDetails && 
              <Typography sx={{my: 2}} variant="h6" color="error" fontWeight={500}>
            {"You have played the round for the given smart contract address. Update the game details! "}
      </Typography>}
        </Box>
        
        : <></>

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
    <CustomizedSnackbars 
    open={loading.openAlert} 
    handleClose={closeAlert}
    text={errors?.errMsg}
    severity="error"
    verticalAnchor="bottom"
    horizontalAnchor="right"
    />
    </Box>
  );
}
