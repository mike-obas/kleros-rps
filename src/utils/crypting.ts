'use server';
import { generateKeyPairSync } from "crypto"
const Cryptr = require('cryptr');

export async function generateKeys() {
    const generated = generateKeyPairSync('rsa', {
     modulusLength: 520,
     publicKeyEncoding: {
         type: 'spki',
         format: 'pem'
     },
     privateKeyEncoding: {
         type: 'pkcs8',
         format: 'pem',
         cipher: 'aes-256-cbc',
         passphrase: ''
     }
 })

 return generated
 }
 
 export const encrypt = async (originText: string) => {
     const cryptr = new Cryptr(`${process.env.PRIVATE_ENC_KEY}`);
     const encryptedString = cryptr.encrypt(originText);
     return encryptedString;
 }

 export const decrypt = async (encText: string) => {
    const cryptr = new Cryptr(`${process.env.PRIVATE_ENC_KEY}`);
    const decryptedString = cryptr.decrypt(encText);
    return decryptedString;
 }