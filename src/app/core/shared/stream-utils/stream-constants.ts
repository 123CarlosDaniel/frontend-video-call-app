export const iceServers = {
  iceServers: [
    {
      urls: ['stun:stun1.l.google.com:19302', 'stun:stun2.l.google.com:19302'],
    },
  ]
}

export const mediaConstraints: MediaStreamConstraints = {
  video:{
      width:{min:640, ideal:1920, max:1920},
      height:{min:480, ideal:1080, max:1080},
  },
  audio: {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: true,
    sampleRate: 44100,
  },
}
