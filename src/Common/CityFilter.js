import axios from "axios";

const baseUrl=process.env.REACT_APP_API_URL_LOCAL;
const handlerSearchCity=async(searchtext)=>{
    console.log('this is test in city file',searchtext ,'and url',baseUrl)

    if(!baseUrl){
        throw new Error("Base URL is not defined")
    }
    if(!searchtext){
        throw new Error('Search text is required')
    }
    try{
        const data={  
            "name": searchtext,
            "countryId": 0
          }
        const response=await axios.post(`${baseUrl}/City/GetFilterCities/`,data)
        console.log('this is fil page data',response)
        if(response.status===200 && response.data.statusCode===200){

            return response.data.data
        }
        else{
            throw new Error('invalid response from server');
        }

    }
    catch(error){
        console.log('this is error filter pa',error)
        throw new Error('failed to fetch cities');

    }
}

export {handlerSearchCity}