// setting up the backend API 
const express = require('express')
const app = express()

// backend Api already has been declared
app.get("/api",(req,res)=>{
  res.json({"users":["userOne","userTwo","userThree"]})
});

app.listen(5000, ()=> {console.log("server started on port")})

// Next step to display the information to the frontend