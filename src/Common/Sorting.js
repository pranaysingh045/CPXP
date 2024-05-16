const handlerSortinfFun=(data,sortOrder,keyname)=>{
    if(!data && data.length===0) return []

    const sortData=[...data];
    sortData.sort((a,b)=>{
        if(sortOrder==='asc'){
            return a[keyname]-b[keyname]
        }
        else{
            return b[keyname]-a[keyname]
        }
    });

    //here we will reset data and other value later

    return sortData

}
export {handlerSortinfFun}