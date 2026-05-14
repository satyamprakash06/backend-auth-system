import "dotenv/config"
import app from "./src/app.js"
import connectDB from "./src/common/config/db.js";

const PORT = process.env.PORT || 5000

const start = async () =>{
    // connect to data base
    await connectDB()

    app.listen(PORT , ()=>{
        console.log(`server is running at ${PORT} in ${process.env.NODE_ENV} mode`)
    })
}

start().catch((err) =>{
    console.error("failed to start server", err)
    process.exit(1)
})