


const express=require("express");
require('dotenv').config()
const app=express();
const port=process.env.PORT || 9000;

const mongoose=require("mongoose");
const path=require("path")
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate")
const ExpressError=require("./utils/ExpressError.js")
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require('connect-flash');
const passport=require("passport");
const localStrategy=require("passport-local");
const User=require("./models/user.js")
const userRouter=require("./routes/user.js")
const listingsRouter=require("./routes/listing.js")
const reviewsRouter=require("./routes/review.js");
const { error } = require('console');
let dbUrl=process.env.ATLASDB_URL

const store=MongoStore.create({
    mongoUrl:dbUrl,
    secret:process.env.SECRET,

    touchAfter:24*3600,
});

store.on("error",()=>{
    console.log("Error in mongo session store!",error);
})

const sessionOptions={
    secret:process.env.SECRET ,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now()+7*24*60*1000,
        maxAge:7*24*60*1000,
        httpOnly:true
    },
    store:MongoStore.create({
        mongoUrl:process.env.ATLASDB_URL,
        autoRemove:"disabled"
        // touchAfter:24*3600,
    },
    function (error){
        console.log(err||"Connection established with MongoStore")
    }
     
    ),
    
};




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

//to save and unsave(delete) info of user in and after a session

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user; 
    next();
})

app.use(methodOverride("_method"))
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"/public")))

main().then(()=>{
    console.log ("Connected")
}).catch((err)=>{console.log(err)})

async function main(){
    await mongoose.connect(dbUrl)
}


//index-route

app.use("/listings",listingsRouter);

//REVIEWS
app.use("/listings/:id/reviews",reviewsRouter)

//signup
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError (404,"PAGE NOT FOUND"))
})

app.use((err,req,res,next)=>{
   let{statusCode=500,message="Something went wrong!"}=err;
   res.status(statusCode).render("error.ejs",{err})
})

app.listen(port,()=>{
    console.log("Server is listening to port 9000")
})


