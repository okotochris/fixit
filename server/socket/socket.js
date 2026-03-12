function socketSetup(io){
    io.on('connection', socket=>{
        console.log(socket.id);
        socket.on("message", message=>{
            console.log(message);
        })
    })
}

module.exports = socketSetup;