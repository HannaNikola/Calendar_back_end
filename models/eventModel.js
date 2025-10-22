import mongoose from "mongoose";
import {Schema, model} from "mongoose";

const eventSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Set title for event']
    },
     description:{
        type: String,
        default: ''
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
    isImportant:{
      type: Boolean,
      default: false
    },
    isCompletedTask:{
        type: Boolean,
        default: false
    },
    todoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'todo',
    
  },
    colorEvent:{
        type: String,
        enum:['none', 'home', 'work','isektor'],
        default: 'none'
    },
    repeat: {
        type: String,
        enum: ['none', 'daily', 'workday', 'weekend'], 
        default: 'none'
    },
    reminder: {
    type: {
        triggerBefore: {
            type: String,
            enum: ['30min', '1hour', '1day', 'none'],
            default: 'none'
        },
        notifyAt: {
            type: Date,
            default: null
        },
        notified: {
            type: Boolean,
            default: false
        }
    },
    default: {}, 
    _id: false     
}
},{versionKey: false, timestamps: true})

 const Event = model('event',eventSchema)

 export default Event




