import mongoose from "mongoose";

type ConnectionObject={
  isConnected?:number
}

const connection:ConnectionObject={}

export async function dbConnect():Promise<void>{
  if(connection.isConnected){
    console.log("Already connected")
    return
  }
  try {
    const db=await mongoose.connect(process.env.DATABASE_URL!);
    connection.isConnected=db.connections[0].readyState
  //  console.log(db.connections)
    console.log("db connected")
  }catch (err){
    console.error(err);
    process.exit();
  }
}