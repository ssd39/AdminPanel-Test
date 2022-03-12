import { useEffect, useState } from "react";
import {
    Navigate
  } from "react-router-dom";
import config from "../config";

function Login(){
    const [username,setUsername]=useState("")
    const [password,setPassword]=useState("")
    const [isLoggedIn, setLogin] = useState(false)

    useEffect(()=>{
        let jwt_token = localStorage.getItem("jwtToken")
        if(jwt_token){
          setLogin(true)
        }
    },[])

    return(
        <div style={{display:'flex',justifyContent:'center',alignItems:'center', flex:1, flexDirection:'column'}}>
            {isLoggedIn && <Navigate to="/dashboard" />}
            <span>Username</span>
            <input onInput={(evt)=>{
                const val = evt.target.value;
                setUsername(val)
            }} value={username}/>
            <span>Password</span>
            <input value={password} type={'password'} onInput={(evt)=>{
                const val = evt.target.value;
                setPassword(val)
            }}/>
            <button onClick={async ()=>{
                if(username && password){
                    let res = await fetch(`${config.api}/auth`,{
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },                      
                        body: JSON.stringify({username, password})
                    })
                    res = await res.json()
                    if(!res.sucess){
                        alert(res.reason)
                        return
                    }
                    let jwt_token = res.data.jwt_token
                    localStorage.setItem('jwtToken',jwt_token)
                    setLogin(true)
                }else{
                    alert('Please input username and password')
                }
            }}>Login</button>
        </div>
    )
}

export default Login;