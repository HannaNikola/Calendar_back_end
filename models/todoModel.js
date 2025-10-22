
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
    isCompletedTask:{
        type: Boolean,
        default: false
    },
    start:{
        type: Date,
        
    },
    end:{
        type:Date,
        
    },
    allDay: {
        type: Boolean
    },
    addTask:{
        type:Boolean,
        
    },
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        
    },

    

    
},{versionKey: false, timestamps: true});

todoSchema.virtual('isOverdue').get(function(){
    return this.end && new Date(this.end) < new Date() && !this.isCompleted;
})
todoSchema.set('toJSON', { virtuals: true });
todoSchema.set('toObject', { virtuals: true });

const Todo = model('todo', todoSchema)

export default Todo;









