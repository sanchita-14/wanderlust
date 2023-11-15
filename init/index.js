
require('dotenv').config();
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing.js");
let mongoUrl=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log ("Connected")
})
.catch((err)=>{console.log(err)
})

async function main(){
    await mongoose.connect(mongoUrl)
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((object)=>({...object,owner:"6543b996eb24ef9fb1157bb0"}))
    await Listing.insertMany(initData.data);
    console.log("DB is initialised")
}

initDB();