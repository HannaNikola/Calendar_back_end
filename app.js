// AKFuBjJo2epbO0h8
// mongodb+srv://Hanna:<db_password>@cluster0.aqbvhov.mongodb.net/
// "mongodb+srv://Hanna:hZbZwwyED204fgd7@cluster0.2flnruh.mongodb.net/db-contacts?retryWrites=true&w=majority&appName=Cluster0"


import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import './db/db.js'

const app = express()
app.use(cors())
app.use(express.json())

app.listen(2060, ()=>{
    console.log("Server is running. Use our API on port: 2060")
})