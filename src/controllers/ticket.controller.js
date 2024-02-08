import {ticketService} from '../services/ticket.services.js'

const generateTicket = async(req, res) => {

    try {
        const {amount, purchaser} = req.body;
        const result = await ticketService(amount,purchaser);
        req.logger.error('successfully generated tickt');
        res.status(201).send({status: 'sucess', payload: result}); 

    } catch (error) {
        console.error('Error generating ticket:', error);
        throw new Error('Error generating ticket');
    }
   

}

export default generateTicket;