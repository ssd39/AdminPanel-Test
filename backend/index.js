require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken');
const cors = require('cors')
const makeid =  require('./utils').makeid;

const app = express()
const port = 4000
app.use(express.json());

//To allow only one session of admin user
let user_session_key = "";

let categories = [{name:"car",images:["/car1.png","/car2.png","/car3.png"]},{name:"bike",images:["/bike1.png","/bike2.png"]},{name:"truck",images:["/truck1.png"]}];

function VerifyJwt(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(403).json({sucess:false, reason: 'Access Token Required'})
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.session_key!=user_session_key){
        res.status(403).json({sucess:false, reason: 'Invalid Access Token'})
        return;
    }
    next()
}
app.use(cors())
app.get('/categories/:filterStr?', VerifyJwt,(req,res)=>{
    let filterStr = req.params.filterStr;
    let result = categories;
    if(filterStr){
        result = categories.filter((item)=>{
            let name = item.name;
            return name.includes(filterStr)
        })
    }
    res.json({sucess:true,data:{
        categories:result
    }})
})

app.post('/auth', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if(username && password){
    if(username==process.env.ADMIN_USERNAME && password==process.env.ADMIN_PASSWORD){
        let session_key = makeid(6);
        let jwt_token = jwt.sign({session_key}, process.env.JWT_SECRET,{expiresIn: '1d'});
        user_session_key = session_key;
        res.json({sucess:true , data :{ jwt_token}});
    }else{
        res.status(403).json({sucess:false, reason: "Wrong Username Or Password!" })
    }
  }else{      
    res.status(403).json({sucess:false, reason: "Username and Password both are required!" })
  }
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})