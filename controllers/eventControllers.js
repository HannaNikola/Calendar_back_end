import  eventServices from '../services/eventServices.js'


export const getAllEvents = async (req, res)=>{
    try{
        const data = await eventServices.listEvents()
        // res.send(data).status(200)
        res.json(data).status(200)
    } catch(error){
        res.status
    }
}