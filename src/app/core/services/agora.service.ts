import { Injectable } from "@angular/core";
import AgoraRTM from "agora-rtm-sdk";

@Injectable({
  providedIn: 'root'
})
export class AgoraService{
  private readonly agoraKey = "b58c6a062a7f49db96b1260f4764d8ed"

  private agoraClient = AgoraRTM.createInstance(this.agoraKey)

  getAgoraClient(){
    return this.agoraClient
  }

  async createAgoraChannel(channelId: string){
    const channel = this.agoraClient.createChannel(channelId)
    await channel.join()
    return channel
  }
}