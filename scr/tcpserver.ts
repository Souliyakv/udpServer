import * as net from 'net';
const ip = "0.0.0.0", port = 8080;

export enum ECommand{
    login ='login',
    logout ='logout',
    send = 'send'
}
export interface ISocketData{
    token:string;
    data:any;
    ip:string;
    command:ECommand
}
export class TCPSERVER {
    constructor(){
        
const server = net.createServer(socket => {
    socket.pipe(socket);

    socket.on('data', data => {
        try {
            const d = JSON.parse(data.toString()) as ISocketData;
            // console.log(`Data received from client : ${data.toString()}`);
    
            switch (d.command) {
                case ECommand.login:
                    console.log('LOGIN2');
                    
                    break;
                    case ECommand.logout:
                    console.log('LOGOUT');
                    
                    break;
                    case ECommand.send:
                    console.log('SEND');
                    
                    break;
            
                default:
                    break;
            }
            console.log(data.toString());
            
            socket.write('\n',err=>{
                if(err)console.log('ERROR',err);
                
            });
    
            socket.on('close', data => {
                console.log(`client closed: ${data.toString()}`);
            });  
        } catch (error) {
            console.log(error);
            //socket.destroy();
        }
       
    });
});

server.on('listening', () => {
    console.log(`Server run Listion${ip}:${port}`);
});

server.on('error', () => {
    console.log(`Server run  Error${ip}:${port}`);
});
server.on('connection', () => {
    console.log(`Server run  Connect${ip}:${port}`);
});

server.on('error', err => {
    console.log(`Error: ${err}`);
    server.close();
});

server.listen(port, ip);
    }
}