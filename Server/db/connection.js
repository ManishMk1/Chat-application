// index.js or app.js
require('dotenv').config();

const mongoose=require('mongoose');
const url=process.env.DATABASE_URL
mongoose.connect(url).then(()=>console.log("Connected to DB")).catch((e)=>console.log("error",e));