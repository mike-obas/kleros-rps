import dayjs from "dayjs";
import { parseEther, formatEther } from "ethers"

export const isEmpty = (data: string) => {
  return !data || data === "";
};

export const isString = (data: string) => {
  const regEx = /^[^<>&;]*$/;
  return data.match(regEx);
};

export function containsWhitespace(str: string) {
  return /\s+|[,\/]/g.test(str);
  ///\s+|[,\/]/g
}

export const isEmail = (data: string) => {
  const regEx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return data.match(regEx);
};

export const isNumber = (data: number) => {
  return Number.isFinite(data);
};

export function isNegative(num: number) {
  if (Math.sign(num) === -1) {
    return true;
  }
  return false;
}

export function addComa(withDecimal: boolean, value: number) {
  const addDecimal = Number(value.toFixed(2));
  const removeDecimal = Number(value.toFixed(0));
  return !withDecimal
    ? removeDecimal.toLocaleString("en-US")
    : addDecimal.toLocaleString("en-US");
}

export const rifineErrMsg = (string: string) => {
  if (typeof string !== "string") return;
  const textArr = string.split("_");
  const readableTxtArr = textArr.map(
    (item) => item[0].toUpperCase() + item.substring(1).toLowerCase()
  );
  return readableTxtArr.join(" ");
};

export const toQueryString = (params: any) => {
  const qs = new URLSearchParams(params);
  return qs.toString();
};

export const countryText = (countryValue: any) => {
  const countyArr = countryValue.split("=");
  const countryTxt =
    countyArr[0].toUpperCase() + countyArr[0].substring(1).toLowerCase();
  return countryTxt;
};

// export function readTimeInSec(text) {
//   const wpm = 225;
//   const words = text.trim().split(/\s+/).length;
//   const time = Math.ceil(words / wpm);
//   return time;
// }

export function readingTime(text: string, wpm: number) {
  const words = text.trim().split(/\s+/).length;
  const timeInMinute = Math.ceil(words / wpm);
  const timeInSec = Math.ceil((words / wpm) * 60);
  const secondsText = timeInSec === 1 ? 'second' : 'seconds';
  const minuteText = timeInMinute === 1 ? 'minute' : 'minutes';
  const getText =
    timeInSec < 60
      ? `${timeInSec} ${secondsText} read`
      : `${timeInMinute} ${minuteText} read`;

  return { timeInSec, timeInMinute, text: getText };
}

export const refineDate = (date: string) => {
  return dayjs(date).format("MMM D, YYYY HH:mm:ss");
};

export const convertToNumber = (bigNumber: bigint, decimal=4) => {
  const toNumber = formatEther(bigNumber);
  const toTwoDecPlaces = Number(toNumber).toFixed(decimal);
  return Number(toTwoDecPlaces);
};

export const getTimeFromOnChain = (time: bigint) => {
  const get18DecValue = parseEther(`${time}`);
  const toNumber = formatEther(get18DecValue);
  return new Date(Number(toNumber) * 1000).toJSON();
};

export const convertToPlainNumber = (bigNumber: bigint) => {
  const toNumber = formatEther(bigNumber);
  return Number(toNumber);
};