import mongoose from "mongoose";
import {Schema, model} from "mongoose";

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Set title for event']
    },
    start:{
        type: Date,
        // required: [true, 'Start time important'],
        // match: вариант записи даты
    },
    end:{
        type:Date,
        // required: [true, 'End time important'],
        // match: вариант записи даты 10-15 или 10:15
    },
    allDay:{
        type: Boolean,
        
        
    },
    addTask:{
        type:Boolean,
        
    }
},{versionKey: false, timeseries: true})

 const Event = model('event',eventSchema)

 export default Event



