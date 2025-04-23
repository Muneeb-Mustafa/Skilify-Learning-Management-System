import mongoose from "mongoose";

const ConnectDB = async()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)        
        console.log(`Connected to Mongodb database ${connect.connection.host}`)
    } catch (error) {
        console.log(`Error in Mongodb ${error}`)
    }
}
export default ConnectDB;