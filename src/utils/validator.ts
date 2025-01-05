import { isNumber, isEmpty, containsWhitespace } from "./filterEntries";

const refinedText = (value: any) => {
    const readableText = ((value.replace(/([A-Z])/g, ' $1').trim()));
    //const refinedText = readableText.toUpperCase()
    const refinedText = readableText[0].toUpperCase() + readableText.substring(1);
    return refinedText
}

export const validateInputData = (data: any) => {
    let validationErrors: any = {};
    if(data.customSecretPin && !isNumber(Number(data.customSecretPin))) validationErrors.customSecretPin ="The Salt must be a number"
    Object.entries(data).forEach((value: any) => {
    if(isEmpty(value[1])) validationErrors[value[0]] = `${refinedText(value[0])} is Required`; 
    });
    return{
        validationErrors,
        valid: Object.keys(validationErrors).length === 0 ? true : false
    }
  }