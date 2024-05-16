import React from 'react'
import Cryptojs from 'crypto-js'
export default function EncryptDecry(encryptiontoken) {
    try{
        if(encryptiontoken){
            const encryptionsalting=new Date()
            const decryptionByte=Cryptojs.AES.decrypt(encryptiontoken,encryptionsalting.toDateString())
            const validtoken=decryptionByte.toString(Cryptojs.enc.Utf8);
            console.log('this is tok',validtoken)
            return validtoken
        }
        else{
            throw new Error('Missing token or encryption key');
        }
    
    }
    catch(err){
        console.log('this is error auth fun',err)
        return null
    }


    
  
}
