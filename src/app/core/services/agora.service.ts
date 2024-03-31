import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import AgoraRTM from "agora-rtm-sdk";

@Injectable({
  providedIn: 'root'
})
export class AgoraService{
  private readonly agoraKey = environment.agoraKey

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