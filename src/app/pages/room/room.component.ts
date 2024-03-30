import { Component, ElementRef, ViewChild, inject } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { RtmChannel, RtmClient, RtmMessage } from 'agora-rtm-sdk'
import { ButtonsMenuComponent } from './optionMenu/buttonsMenu.component'
import { CommonModule } from '@angular/common'
import { modifyStream } from '@shared/stream-utils/streamTools'
import { AgoraService } from '@services/agora.service'
import { mediaConstraints, iceServers } from '@shared/stream-utils/streamConstants'
import { v4  as uuid } from 'uuid'
import { RecordStream } from '@shared/stream-utils/RecordStream'

@Component({
  templateUrl: './room.component.html',
  styleUrl: './room.component.css',
  standalone: true,
  selector: 'app-room',
  imports: [ButtonsMenuComponent, CommonModule],
})
export class RoomComponent {
  private activatedRouter = inject(ActivatedRoute)
  private agoraService = inject(AgoraService)
  private recordStreamService = inject(RecordStream)
  private roomId: string
  private uid = uuid()

  private client: RtmClient
  private channel: RtmChannel

  private localStream: MediaStream
  private remoteStream: MediaStream | undefined
  private peerConnection: RTCPeerConnection | undefined

  @ViewChild('video1')
  video1Ref!: ElementRef<HTMLVideoElement>

  @ViewChild('video2')
  video2Ref!: ElementRef<HTMLVideoElement>

  public smallFrame = false

  ngOnInit() {
    this.init()
  }

  constructor() {
    this.roomId = this.activatedRouter.snapshot.params['id']

    this.client = this.agoraService.getAgoraClient()
  }

  async init() {
    await this.client.login({ uid: this.uid, token: '' })
    this.channel = await this.agoraService.createAgoraChannel(this.roomId)

    this.channel.on('MemberJoined', this.handleUserJoined)
    this.channel.on('MemberLeft', this.handleUserLeft)
    this.client.on('MessageFromPeer', this.handleMessageFromPeer)

    this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
    this.video1Ref.nativeElement.srcObject = this.localStream
    
    modifyStream(this.localStream)
  }

  public createPeerConnection = async (memberId: string) => {
    this.peerConnection = new RTCPeerConnection(iceServers)

    this.remoteStream = new MediaStream()

    this.video2Ref.nativeElement.srcObject = this.remoteStream
    this.video2Ref.nativeElement.style.display = 'block'
    this.video1Ref.nativeElement.classList.add('smallFrame')

    if (!this.localStream) {
      this.localStream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
      this.video1Ref.nativeElement.srcObject = this.localStream
    }
    
    this.localStream.getTracks().forEach((track) => {
      this.peerConnection?.addTrack(track, this.localStream)
    })

    this.peerConnection.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        this.remoteStream?.addTrack(track)
      })
    }

    this.peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        this.client.sendMessageToPeer(
          {
            text: JSON.stringify({
              type: 'candidate',
              candidate: event.candidate,
            }),
          },
          memberId
        )
      }
    }
  }

  public createOffer = async (memberId: string) => {
    await this.createPeerConnection(memberId)

    let offer = await this.peerConnection!.createOffer()
    await this.peerConnection!.setLocalDescription(offer)

    console.log('create offer', memberId)
    this.client.sendMessageToPeer(
      { text: JSON.stringify({ type: 'offer', offer: offer }) },
      memberId
    )
  }

  public handleUserJoined = (memberId: string) => {
    console.log('A new user joined the channel', memberId)
    this.createOffer(memberId)
  }

  private handleUserLeft = (memberId: string) => {
    console.log('user disconnected with id ', memberId)
    this.video2Ref.nativeElement.style.display = 'none'
    this.video1Ref.nativeElement.classList.remove('smallFrame')
  }

  private handleMessageFromPeer = async(message: RtmMessage, memberId: string) => {
    const rcvMessage = JSON.parse(message.text!)

    if (rcvMessage.type === 'offer') {
      await this.createPeerConnection(memberId)
      await this.peerConnection?.setRemoteDescription(rcvMessage.offer)

      const answer = await this.peerConnection?.createAnswer()
      await this.peerConnection?.setLocalDescription(answer)
      this.client.sendMessageToPeer(
        { text: JSON.stringify({ type: 'answer', answer: answer }) },
        memberId
      )
    }
    if (rcvMessage.type === 'answer') {
      if (!this.peerConnection?.currentRemoteDescription) {
        this.peerConnection?.setRemoteDescription(rcvMessage.answer)
      }
    }
    if (rcvMessage.type === 'candidate') {
      if (this.peerConnection) {
        this.peerConnection.addIceCandidate(rcvMessage.candidate)
      }
    }
  }

  public toggleMic = async () => {
    let audioTrack = this.localStream!.getTracks().find(
      (track) => track.kind === 'audio'
    )!
    audioTrack.enabled = !audioTrack.enabled
  }

  public toggleCamera = async () => {
    let videoTrack = this.localStream!.getTracks().find(
      (track) => track.kind === 'video'
    )!
    videoTrack.enabled = !videoTrack.enabled
  }

  public toggleRecord = (recording: boolean)=>{
    if(recording){
      this.recordStreamService.record(this.localStream, this.remoteStream)
    }
    else {
      this.recordStreamService.stopRecording()
    }
  }

  ngOnDestroy(){
    this.peerConnection?.close()
    this.localStream!.getTracks().forEach((track) => {
      track.stop()
    })
    this.channel.leave()
    this.client.logout() 
  }
}
