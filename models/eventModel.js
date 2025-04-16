import mongoose from "mongoose";
import {Schema, model} from "mongoose";

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Set title for event']
    },
    start:{
        type: String,
        required: [true, 'Start time important']
    },
    end:{
        type:String,
        required: [true, 'End time important']
    },
    allDay:{
        type: Boolean,
        default: false
    }
})

 const Event = model('Event',eventSchema)

 export default Event
// export default mongoose.model('Events',eventSchema)