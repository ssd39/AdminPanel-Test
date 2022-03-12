import { useState, useEffect } from 'react';
import {
    Navigate
  } from "react-router-dom";
import config
 from '../config';
function Dashboard(){
    const [isLoggedIn, setLogin] = useState(true)
    const [filterStr, setFilterStr] = useState("")
    const [catagories, setCatagories] = useState([])
    useEffect(()=>{
        let jwt_token = localStorage.getItem("jwtToken")
        if(!jwt_token){
          setLogin(false)
        }else{
            fetchItems()
        }
    },[])
    
    useEffect(()=>{
        fetchItems()
    },[filterStr])

    let fetchItems = async () => {
        let jwt_token = localStorage.getItem("jwtToken")
        let res = await fetch(`${config.api}/categories/${filterStr}`,{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwt_token}`
            }                     
        })
        res = await res.json()
        if(res.sucess){
            setCatagories(res.data.categories)
        }else{
            localStorage.clear()
        }
    }

    return(<div>
        <div style={{margin:'10px'}}>
            <span>Search:</span>
            <input value={filterStr} onInput={(evt)=>{
                const val = evt.target.value;
                setFilterStr(val)
            }}/>
        </div>
        <div style={{'display':'flex',"flexWrap":'wrap', flexDirection:'column'}}>
            {
                catagories.map((item) =>{
                    return (<div style={{margin:'10px',display:'flex',flexDirection:'column'}}>
                        <span>{item.name}</span>
                        <div>
                           {console.log(item.images)} 
                        {item.images.map((url)=>{
                            return (<img src={url}/>)
                        })
                        }
                        </div>
                    </div>)
                } )
            }
        </div>
        {!isLoggedIn && <Navigate to="/login" />}
    </div>)
}

export default Dashboard;