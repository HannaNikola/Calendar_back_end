import mongoose from "mongoose";
import {Schema, model} from "mongoose";

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Set title for event']
    },
    start:{
        type: Date,
        
    },
    end:{
        type:Date,
      
    },
    allDay:{
        type: Boolean,
        
        
    },
    addTask:{
        type:Boolean,
        
    },
    repeat: {
        type: String,
        enum: ['none', 'daily', 'weekday', 'weekend'], 
        default: 'none'
    }
},{versionKey: false, timestamps: true})

 const Event = model('event',eventSchema)

 export default Event



