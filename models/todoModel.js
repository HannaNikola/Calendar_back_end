
import mongoose from "mongoose"
import {Schema, model} from "mongoose";


const todoSchema = new mongoose.Schema({
    title:{
        type: String,
        required:[true, 'Set title for todo'],
        trim: true
    },
    description:{
        type: String,
        default: ''
    },
    isImportant:{
      type: Boolean,
      default: false
    },
    isCompleted:{
        type: Boolean,
        default: false
    },
    end:{
        type:Date,
        required: [true, 'Set end date for todo'] 
    },
    allDay: {
        type: Boolean
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: [true, 'Event reference is required']
    },
    repeat: {
        type: String,
        enum: ['none', 'daily', 'weekday', 'weekend'], 
        default: 'none'
    },
    reminder:{
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
    
},{versionKey: false, timestamps: true});

todoSchema.virtual('isOverdue').get(function(){
    return this.end && new Date(this.end) < new Date() && !this.isCompleted;
})
todoSchema.set('toJSON', { virtuals: true });
todoSchema.set('toObject', { virtuals: true });

const Todo = model('todo', todoSchema)

export default Todo;


