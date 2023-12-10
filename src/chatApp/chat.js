import Message from "../dao/dbManagers/messages.manager.js";
const messageManager= new Message();

let messages = [];


const handleConnection = async (socket, io) => {
    console.log("Nuevo cliente conectado");

    socket.on('authenticate', () =>{

        socket.emit("messageLogs", messages);
    })
    
    socket.on('message', async data => {
        await messageManager.save(data);

        messages = messages.length < 10 ? messages : []; 
        messages.push(data);
        io.emit('messageLogs', messages);
    });

    socket.broadcast.emit('userConnected', {user: 'Nuevo usuario conectado'});

   
}

export default handleConnection;