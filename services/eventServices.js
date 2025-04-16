
import Event from '../models/eventModel.js'


async function listEvents(){
    const data = await Event.find()
    console.log(data)
    return data
}

listEvents()


const eventServices ={
    listEvents
}

export default eventServices