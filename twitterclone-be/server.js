const  express =require("express")
const mongoose=require("mongoose")
const cors =require("cors")
require("dotenv").config()
const UserRouter=require("./routes/Auth")
const TweetRouter=require("./routes/Tweet")
const MulterRouter=require("./routes/multer")
const app=express()
app.use(cors())
app.use(express.json())

const Url=process.env.Mongo_url
// console.log(Url)

global.__basedir = __dirname;

app.use(UserRouter)
app.use(TweetRouter)
app.use(MulterRouter)

mongoose.connect(Url)
.then(()=>{
    console.log("Database Connected")
    app.listen(8080)
})
.catch(err=>console.log(err))

