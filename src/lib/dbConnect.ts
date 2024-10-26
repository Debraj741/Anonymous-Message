import mongoose from "mongoose";

// Define types of Connection Object part => (Can skip)
// After Connection which type of object it returns that type define here
// This object is totally optional 

type ConnectionObject = {
    isConnected?: number;
}

// Type of connection variable is ConnectionObject (As it is optional so can initialize with empty otherwise typescript throw error)

const connection : ConnectionObject = {}

// Database always is another continent (User Async , await) as it need time
// Can not be error free / can be failed => so use try catch

// Returned value from database that should be a PROMISE and the value of this PROMISE is whatever so write <void>
async function dbConnect() : Promise<void> {
    // If already database connection established

    if(connection.isConnected){
        console.log("Database Already Connected!!");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "")

        // Print this db , there present connections array ,where present readyState which define Database is ready or not which is a Number and I return it 

        connection.isConnected = db.connections[0].readyState
        console.log("DB Connected SuccessFully!!");
        

    } catch (error) {
        
        console.log("DB Connection Failed!!", error); 

        // As DB is not connected so don't want to run another things
        process.exit(1)
    }
}

export default dbConnect