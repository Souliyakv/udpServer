import * as udp from 'dgram';
import { ECommand, ISocketData } from './chattcpserver';
import { IChannel, IMessage } from './model';


export interface Info {
  address: string,
  family: string,
  port: number,
  size: number
}

export interface User {
  userName: string;
  password: string;
  port: number,
  address: string
}

export class UDPSERVER {
  userList = new Array<{ s: udp.Socket, u: User }>();
  users = new Array<User>();
  channelList = new Array<IChannel>();
  arr: Array<any> = [];

  constructor() {

    this.channelList.push({ members: ['a', 'b'], name: '1' })
    this.channelList.push({ members: ['c', 'b'], name: '2' })
    this.channelList.push({ members: ['a', 'd'], name: '3' })

    const server = udp.createSocket('udp4');
    server.on('error', function (error) {
      console.log('Error: ' + error);
      server.close();
    });


    server.on('message', (msg, info) => {
      try {

        let message = JSON.parse(msg.toString()) as ISocketData;
        switch (message.command) {
          case ECommand.login:
            console.log(`login1`)
            const infoD = info as Info;
            const u = message.data as User;

            const uData = { 
              userName: u.userName,
              password: u.password,
              port: infoD.port,
              address: infoD.address
            };

            console.log(uData);
            this.userList.push({ s: server, u: uData });
            break;
          case ECommand.logout:
            console.log(`logout`);
            break;
          case ECommand.send:
            // this.arr.push(message.data['message'])
            // console.log(this.arr.length);
            
            // const ack={'trans':message.trans,command:'ack'}
            // server.send(JSON.stringify(ack));
            server.send(JSON.stringify({
              'command':'ack'
            }),info.port,info.address)


            console.log(message.data['sumData']);
            console.log(message.data['round'])
            const m = message.data as IMessage;
            // this.arr.push(m.message);
            const sender = message.token;
            const chname = m.channel;
            const channel = this.channelList.find(v => v.name == chname);
            if (channel) {
              const receivers = channel.members;
              const recv = receivers.filter(v => v != sender);
              const s = this.userList.filter(v => recv.includes(v.u.userName));
              s.forEach(v => {
                // console.log('port: ',v.u.port);
                // console.log('port: ',v.u.address);
                // console.log(`my arr: =========> ${JSON.stringify(this.arr)}`);
                server.send(JSON.stringify(message.data), v.u.port,v.u.address, function (error) {
                  if (error) {
                    //   client.close();
                    console.log(`error`);

                  } else {
                    ///
                    // console.log(message.data)
                  }

                });
              })

            }

            break;
          default:
            break;
        }



        // server.send(message.toString(),info.port, info.address,function(error){
        //   if(error){
        //   //   client.close();
        //   console.log(`error`);
        //   }else{
        //     ///
        //     console.log('Data sent !!!',message);
        //   }

        // });
      } catch (error) {
        console.log(error);
      }

    });

    //emits when socket is ready and listening for datagram msgs
    server.on('listening', function () {
      var address = server.address();
      var port = address.port;
      var family = address.family;
      var ipaddr = address.address;
      console.log('Server is listening at port' + port);
      console.log('Server ip :' + ipaddr);
      console.log('Server is IP4/IP6 : ' + family);
    });

    // server.on('connect', () => {
    //   console.log('Socket connected');
    // });

    //emits after the socket is closed using socket.close();
    server.on('close', function () {
      try {
        console.log('Socket is closed !');
        server.close();
      } catch (error) {
        console.log(error);
        
      }
     
    });

    server.bind(2222, '0.0.0.0', () => {
      console.log('Socket bound to port 2222');
    });

  }
}


//   setTimeout(function(){
//   server.close();
//   },8000);