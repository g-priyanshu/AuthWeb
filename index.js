const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const JWT_SECRET = "jfjrhggghnwjfndkjfndfnejfrnrejnjirgnrigb"
app.use(express.json());

let users = [];

app.get("/", function(req,res){
    res.sendFile(__dirname + "/public/index.html");
})

// app.get("/signup" , function(req,res){
//     let Recived_username = req.body.username;
//     let Recived_password = req.body.password;

//     for(let i =0;i<users.length;i++){
//         if(users[i].username === Recived_username && users[i].password === Recived_password)
//         {
//             res.json({
//                 message : "user is already registred"
//             })

//             return
//         }
//     }

//     users.push(
//         {
//             username : Recived_username,
//             password :  Recived_password
//         })
//     res.json({
//         message : "User sign uped",
//         username : Recived_username,
//         password : Recived_password

//     })

// })




app.post("/signup", function(req, res) {
    let receivedUsername = req.body.username;
    let receivedPassword = req.body.password;

    // Check if user already exists
    const userExists = users.some(user => user.username === receivedUsername);

    if (userExists) {
        res.status(400).json({
            message: "User is already registered"
        });
    } else {
        users.push({
            username: receivedUsername,
            password: receivedPassword
        });
        res.status(201).json({
            message: "User signed up successfully",
            username: receivedUsername
        });
    }
});


function auth(req,res,next)
{
    let token = req.headers.token;
    if(token)
    { 
        const verified = jwt.verify(token,JWT_SECRET);
        req.user = verified;
        next();
    }
    else
    {
        res.send({
            message : "token invalid"
        })
    }

    
}

app.post("/signin", function(req, res) {
    let receivedUsername = req.body.username;
    let receivedPassword = req.body.password;

    // Check if user already exists
    let userExists = users.find(user => user.username === receivedUsername && user.password === receivedPassword) ;

    if (userExists) {
        let token = jwt.sign({username : receivedUsername}, JWT_SECRET); //can use userExists.username too
        
        res.json({
            message: "user signed in succesfully",
            token : token
        });

    } else {
    
        res.status(201).json({
            message: "User not found",
            username: receivedUsername
        });
    }
});


app.get("/me" , auth, function(req, res)
{
    let usernamefromtoken = req.user.username;
    const userfound = users.find(user => user.username === usernamefromtoken);
    if(userfound)
    {
        res.json({
            username : userfound.username,
            password : userfound.password
        })
    }else{
        res.send({
            message : "user not found"
        })
    }
})

app.listen(3000);