import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';

import { config } from '../../../../configAngular';

@Injectable()
export class SocketService{
    constructor(){
        console.log(`Socket connecting to ${this.serverName}:${config.serverPort}`);
        console.log(this.client);
    }
    private serverName = config.serverIpOrDomainName; // on production should always be location.href
    private client = io.connect(this.serverName + ":" + config.serverPort, {transports: ['websocket']});
    // private client = io.connect(this.serverName + ":" + config.serverPort);
    
    private listenerNames = {};

    public emit(header:string, data:any){
        this.client.emit(header,data);
    }
    public getServerName(){
        return this.serverName;
    }
    public on(eventName:string, callback:(response:any) => void){
        this.listenerNames[eventName] = true;
        this.client.on(eventName,callback);
    }  
}