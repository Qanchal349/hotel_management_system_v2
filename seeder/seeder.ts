import room from "@/backend/models/room";
import mongoose from "mongoose";
// import {rooms} from "./data"


// npm run seeder 
const seedRooms = async()=>{
     try {
        await mongoose.connect("mongodb://127.0.0.1:27017/bookit-v2")
        await room.deleteMany();
        console.log("Rooms are deleted")
       // await room.insertMany({rooms});
        console.log("Rooms are inserted")

        process.exit();

     } catch (error) {
        console.log(error)
        process.exit(); 
     }
}


seedRooms();