"use client";
import React, { useState, useReducer, useEffect } from "react";
import CustomButton from "@/components/reusables/CustomButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid2";
import { inputReducer, loadingReducer } from "@/components/reusables/reducers";
import { GeneralTypes } from "@/utils/generalTypes";
import NotificationModal from "./reusables/NotificationModal";
import { convertToNumber, convertToPlainNumber, getErrorMsg, getTimeFromOnChain } from "@/utils/filterEntries";
import { getItem } from "@/utils/localStorage";
import { decrypt } from "@/utils/crypting";
import Divider from "@mui/material/Divider";
import { BrowserProvider, Contract, solidityPackedKeccak256, parseEther } from "ethers";
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
  rewardLoading: false,
  timeCashOutLoading: false,
  player2MoveLoading: false,
  notificationModal: false,
  noMetaMask: false,
  connected: false,
  openAlert: false,
  txLink: "",
  successMsg: ""
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

  const connectWallet = async () => {
    // @ts-ignore
    if (typeof window.ethereum !== "undefined") {
        // @ts-ignore
        const provider = new BrowserProvider(window.ethereum)

      try {
        const getDetails = getItem("gameDetails")
        if(!getDetails?.customContractAddress || !getDetails?.customSecretPin) throw {error: {message: "Please provide a valid contract address and secret pin (salt)."}}
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
        updateMultipleInput(readData)
        startLoading("preLoading", false)
    }
 }

 useEffect(()=> {
  if(loading.connected) {getContractDetails()}
 }, [loading.connected])

    const closeModal = (event?: GeneralTypes["onChange"], reason?: string) => {
      if (reason !== "backdropClick") {
        startLoading("notificationModal", false)
        startLoading("buttonLoading", false)
      }
    }

     const getSalt = async () => {
        const getDetails = getItem("gameDetails")
        if(getDetails?.customSecretPin) { 
            const customSecretPin = await decrypt(getDetails?.customSecretPin)
            return { customSecretPin }
         }
         return null
     }

    const revealPlayer1Move = async () => { 
      const moves = [0, 1, 2, 3, 4, 5]
      const saltObj = await getSalt()
        if(saltObj) { 
        const salt = saltObj?.customSecretPin
        const result = moves.filter((value: number) => {
        const currentMove = solidityPackedKeccak256([ "uint8", "uint256" ], [ value, BigInt(`${salt}`) ])
        return currentMove === input.c1Hash
      })
      updateInput("c1", result[0])
      return result[0]
    }
    }

    const getWinner = async () => { 
      const c1 = input.c1
      const c2 = input.c2
      const possibleWinsForC1: number[]  = moves[c1 as keyof typeof moves].winsAgainst
      const player1Wins = possibleWinsForC1.includes(c2)
      return player1Wins ? "Player 1" : "Player 2"
    }


  const rewardWinner = async () => {
    startLoading("rewardLoading", true);
    setErrors({})
    const { customContractAddress } = input
    try {
      const saltObj = await getSalt()
      if(!saltObj) throw {error: {message: "Please provide a valid secret pin (salt)."}}
      const c1 = input.c1
      if(c1 < 1 || input.c2 < 1) throw {error: {message: "Both players must play before reward can be granted."}}
      const salt = saltObj?.customSecretPin
      const winner = await getWinner()

      // @ts-ignore
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const activeWalletAddress = await signer.getAddress()
      if(activeWalletAddress !== input.j1) throw {error: {message: "Please switch wallet account to Player 1."}}
      const contract = new Contract(customContractAddress, rpsAbi, signer);
      const player1Move = c1
      const transactionResponse = await contract.solve(player1Move, BigInt(`${salt}`));
      const tx = await transactionResponse.hash
      await provider.once(tx, async (transactionReceipt) => {
        //const confirmation = transactionReceipt.confirmations
      startLoading("txLink", `https://sepolia.etherscan.io/tx/${tx}`)
      startLoading("successMsg", `Congratulations to ${winner} for winning ${input.stake * 2} ETH. Check your wallet to see reward. Follow this link to view on sepolia etherscan: `)
      startLoading("rewardLoading", false);
      startLoading("notificationModal", true)
      return getContractDetails()
      });

    } catch (errs: any) {
      startLoading("rewardLoading", false);
      const errMsg = getErrorMsg(JSON.stringify(errs))
        setErrors({...errors, errMsg})
        startLoading("openAlert", true)
    }
  };

  const timeCashOut = async () => {
    startLoading("timeCashOutLoading", true);
    setErrors({})
    const { customContractAddress } = input
    try {
      const c1 = input.c1
      if(c1 > 0 && input.c2 > 0) throw {error: {message: "Both players have played. Use the Grant Reward button."}}

      // @ts-ignore
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const activeWalletAddress = await signer.getAddress()
      if(activeWalletAddress !== input.j1) throw {error: {message: "Please switch wallet account to Player 1."}}
      const contract = new Contract(customContractAddress, rpsAbi, signer);
      const transactionResponse = await contract.j2Timeout();
      const tx = await transactionResponse.hash
      await provider.once(tx, (transactionReceipt) => {
        //const confirmation = transactionReceipt.confirmations
      startLoading("txLink", `https://sepolia.etherscan.io/tx/${tx}`)
      startLoading("successMsg", `You have successfully cashed back your staked amount (${input.stake} ETH). Follow this link to view on sepolia etherscan: `)
      startLoading("timeCashOutLoading", false);
      startLoading("notificationModal", true)
      return getContractDetails()
      });

    } catch (errs: any) {
      startLoading("timeCashOutLoading", false);
      const errMsg = getErrorMsg(JSON.stringify(errs))
        setErrors({...errors, errMsg})
        startLoading("openAlert", true)
    }
  };

  const player2MoveSelection = async (player2Move: number) => {
    startLoading("player2MoveLoading", true);
    setErrors({})
    const { customContractAddress } = input
    try {
      if(!input.c1Hash || input.c1Hash === "") throw {error: {message: "Player 1 must have played before you can join the game."}}
      // @ts-ignore
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const activeWalletAddress = await signer.getAddress()
      const ethAmount = parseEther(`${input.stake}`);
      if(activeWalletAddress !== input.j2) throw {error: {message: "Please switch wallet account to Player 2."}}
      const contract = new Contract(customContractAddress, rpsAbi, signer);
      const transactionResponse = await contract.play(player2Move, {
        value: ethAmount,
      })
      const tx = await transactionResponse.hash
      const moveText = moves[player2Move as keyof typeof moves].text
      await provider.once(tx, async (transactionReceipt) => {
        //const confirmation = await transactionReceipt.confirmations
      startLoading("txLink", `https://sepolia.etherscan.io/tx/${tx}`)
      startLoading("successMsg", `Congratulations, you have staked ${input.stake} ETH to play ${moveText}. Player 1 move is now revealed below. Follow this link to view on sepolia etherscan: `)
      startLoading("player2MoveLoading", false);
      updateInput("c2", player2Move);
      await revealPlayer1Move()
      return startLoading("notificationModal", true)
      });

    } catch (errs: any) {
      startLoading("player2MoveLoading", false);
      const errMsg = getErrorMsg(JSON.stringify(errs))
        setErrors({...errors, errMsg})
        startLoading("openAlert", true)
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
      0: { text: "Null", winsAgainst: [], icon: <RockIcon /> },
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

    const bothHasPlayed = input.c1Hash !== "" && input.c2 > 0
    const shouldUpdateGameDetails = input.c1Hash !== "" && input.stake === 0

    useEffect(()=> {
      let timeoutId: any;
      if(shouldUpdateGameDetails){
        setErrors({errMsg: "Provide another salt and smart contract address to play another round."})
         timeoutId = setTimeout(() => {
          startLoading("openAlert", true)
        }, 2000);
      }
      return () => clearTimeout(timeoutId);
     }, [shouldUpdateGameDetails])
    
    useEffect(()=> {
      if(input.c2 > 0) { revealPlayer1Move() }
     }, [input.c2])

    const getSelectedMovesNumber =  [input.c1, input.c2]

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
              {loading.connected && !loading.preLoading && 
              <Typography variant="subtitle1" color="success">{connectedWalletText}</Typography>
              }
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
            text="Grant Reward"
            textVariant="subtitle1"
            mt={1}
            loading={loading.rewardLoading}
            height={40}
            disabledOnly={!bothHasPlayed || input.stake === 0}
            onClickHandler={rewardWinner}
            textColor={"secondary"}
            fullWidthOnSm
        />
        </Grid>
        <Grid size={{xs: 12, sm: 6}}>
            <CustomButton
            text="Time Out Cashback"
            textVariant="subtitle1"
            mt={1}
            loading={loading.timeCashOutLoading}
            height={40}
            disabledOnly={!timeHasPassed() || input.stake === 0}
            onClickHandler={timeCashOut}
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
            disabled={bothHasPlayed || loading.player2MoveLoading || timeHasPassed()}
            variant="filled" 
            sx={(theme) => ({
              padding: "0px 4px",
              backgroundColor: theme.vars.palette.secondary.light,
              '& .MuiChip-label': {
                color: theme.vars.palette.primary.main,
              }
            })} 
            onClick={() => player2MoveSelection(item)}
            />
            </Grid>))}
            {loading.player2MoveLoading &&
            <Grid size={12} sx={{ py: 1, position: "relative" }}>
            <CircularProgress />
          </Grid>}
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
          {getSelectedMovesNumber.map((item: number, index: number) => (<Grid key={item}>
          <Chip 
            icon={moves[item as keyof typeof moves].icon}
            label={`${moves[item as keyof typeof moves].text} (Player ${index + 1})`} 
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
              <Typography sx={{mt: 6}} variant="h6" color="error" fontWeight={500}>
            {"Provide another salt and smart contract address to play another round."}
      </Typography>} 
        </Box>
        
        : ""

      }
      
      </Box> 


    <NotificationModal
    subText={loading.successMsg}
    link={loading.txLink}
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
