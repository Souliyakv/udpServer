import * as net from 'net';
import { IChannel, IMessage, IUser } from './model';
const ip = "0.0.0.0", port = 8980;

export enum ECommand {
    login = 'login',
    logout = 'logout',
    send = 'send',
    refund = 'refund',
    resend = 'resend'
}
export interface ISocketData {
    token: string;
    data: any;
    ip: string;
    command: ECommand
}
export class ChatServer {

    userList = new Array<{ s: net.Socket, u: IUser }>();
    /// userName:'a',
    /// userName:'b',
    /// userName:'c',
    /// userName:'d',
    users = new Array<IUser>();

    channelList = new Array<IChannel>();
    constructor() {
        // this.users.push({userName:'a',password:'a'});
        // this.users.push({userName:'b',password:'b'});
        // this.users.push({userName:'c',password:'c'});
        // this.users.push({userName:'d',password:'d'});
        this.channelList.push({ members: ['a', 'b'], name: '1' })
        this.channelList.push({ members: ['c', 'b'], name: '2' })
        this.channelList.push({ members: ['a', 'd'], name: '3' })

        const server = net.createServer(socket => {
            // socket.pipe(socket);


            socket.on('data', data => {
                try {
                    const d = JSON.parse(data.toString()) as ISocketData;

                    // console.log(`Data received from client : ${data.toString()}`);

                    switch (d.command) {
                        case ECommand.login:
                            console.log('LOGIN');
                            const u = d.data as IUser;
                            console.log('result', u);
                            // authentication
                            this.userList.push({ u, s: socket });
                            break;
                        case ECommand.logout:
                            console.log('LOGOUT');
                            const ul = d.data as IUser;

                            const i = this.userList.findIndex(v => v.u.userName == ul.userName);
                            if (i != -1) {
                                this.userList.splice(i, 1);
                                // socket.end();
                            }

                            break;
                        case ECommand.send:
                            console.log('SEND');

                            const m = d.data as IMessage;

                            const sender = d.token; // sender

                            const chname = m.channel;
                            const channel = this.channelList.find(v => v.name == chname);
                            console.log(channel);

                            if (channel) {
                                const receivers = channel.members;

                                const recv = receivers.filter(v => v != sender);
                                const s = this.userList.filter(v => recv.includes(v.u.userName));
                                console.log('us', s);
                                s.forEach(v => {
                                    console.log('vvvvvvv',);

                                    v.s.write(JSON.stringify(m) + '\n');
                                })
                            }


                            break;
                        default:
                            break;
                    }
                    console.log(data.toString());

                    socket.write('\n', err => {
                        if (err) console.log('ERROR', err);

                    });

                    socket.on('close', data => {
                        console.log(`client closed: ${data.toString()}`);
                        const i = this.userList.findIndex(v => v.s == socket);
                        if (i != -1) this.userList.splice(i, 1)
                    });
                    socket.on('error', (e) => {
                        const i = this.userList.findIndex(v => v.s == socket);
                        if (i != -1) this.userList.splice(i, 1)
                    })
                } catch (error) {
                    console.log(error);
                    //socket.destroy();
                }

            });
        });

        server.on('listening', () => {
            console.log(`Server run Listion${ip}:${port}`);
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