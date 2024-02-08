import {messagesModel} from '../dbManagers/models/messages.models.js';

export default class Message {
    constructor(){
        console.log("Working Message with DB");
    }

getAll = async () => {
    const messages = await messagesModel.find().lean();
    return messages;

}
save = async (message) => {
    const result = await messagesModel.create(message);
    return result;
}

}

