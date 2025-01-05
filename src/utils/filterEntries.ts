import { parseEther, formatEther } from "ethers"

export const isEmpty = (data: string) => {
  return !data || data === "";
};

export const isNumber = (data: number) => {
  return Number.isFinite(data);
};


export const convertToNumber = (bigNumber: bigint, decimal=9) => {
  const toNumber = formatEther(bigNumber);
  const toTwoDecPlaces = Number(toNumber).toFixed(decimal);
  return Number(toTwoDecPlaces);
};

export const getTimeFromOnChain = (time: bigint) => {
  const get18DecValue = parseEther(`${time}`);
  const toNumber = formatEther(get18DecValue);
  return new Date(Number(toNumber) * 1000).toJSON();
};

export const convertToPlainNumber = (bigNumber: string) => {
  const toBigNumber = parseEther(`${bigNumber}`);
  const toNumber = formatEther(toBigNumber);
  return Number(toNumber);
};

export const getErrorMsg = (errString: string) => {
  const errObj = JSON.parse(errString)
  return errObj?.shortMessage || errObj?.error?.message || errObj?.info?.error?.message || "Something Went wrong, ensure you have the right access and resources to initiate this action."
}