export interface IUser{
    userName:string;
    password:string;
}



export interface IChannel{
    members:Array<string>;
    name:string;
}

export interface IMessage{
    message:string;
    channel:string;
    type:string
}

// if Channel exist , send to channel
// if Channel is not exist , find username then create a channel


// 1. create username
// ... find username
// 2. create channel
// .... find channel
// 3. create a message
// 4. send a message
