import CryptoJS from "crypto-js";
function DecryptFunction() {
    try{
        const userdetails=sessionStorage.getItem('candidatedetails')
        console.log('this is dec fun tt l')
        if(userdetails){
            
            const encryptionsalting=new Date()
            //const encryptionsalting=process.env.REACT_APP_key
            const decryptionByte=CryptoJS.AES.decrypt(userdetails,encryptionsalting.toDateString())
            const validtoken=decryptionByte.toString(CryptoJS.enc.Utf8);
            const data=JSON.parse(validtoken)
            const accessToken=data.accessToken
            const memberID=data.candidateDetail
            console.log('this is accestoken & memberid',accessToken,memberID)
            console.log('this is candidate details token',validtoken)
            return data
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

export default DecryptFunction