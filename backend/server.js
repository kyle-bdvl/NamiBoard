// setting up the backend API 
const express = require('express')
const app = express()
const port =5000;
// backend Api already has been declared
app.get("/api",(req,res)=>{
  res.json({"users":["white\ spsdsdace","Amazing!\ cool\ i\ guess","UserOne","on Restart"]})
});

app.listen(port, ()=> {console.log("server started on port "+port)})

// Next step to display the information to the frontend