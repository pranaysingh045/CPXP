
const handlerPagination=({data,currentpage,setCurrentPage})=>{
    const rowperpage=5
    console.log('this is pagination code',data,currentpage)
   // const currentpages=currentpage //1 send first time
    const lastIndex=rowperpage *currentpage
    const startIndex=lastIndex-rowperpage
    const totalpage=Math.ceil(data.length/rowperpage)
    const pagenationItem=[]
    for(let i=1;i<=totalpage;i++){
        pagenationItem.push(
            <li key={i} className={`page-item ${currentpage===i?'active':''}`} >
                <a className="page-link" onClick={()=>setCurrentPage(i)} href="#">{i}
                </a>
            </li>
        );


    }
    console.log('this is pagination code return',data,totalpage)
    // const displaydata=data.slice(startIndex,lastIndex)
    return {pagenationItem,totalpage}

}

const handlerPaginationData=(data,currentpage)=>{
    const rowperpage=5
   // const currentpages=currentpage //1 send first time
    const lastIndex=rowperpage *currentpage
    const startIndex=lastIndex-rowperpage
    const displaydata=data.slice(startIndex,lastIndex)
    
    return displaydata
}
export {handlerPagination,handlerPaginationData}