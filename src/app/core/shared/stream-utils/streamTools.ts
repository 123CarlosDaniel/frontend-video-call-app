
export function modifyStream(stream: MediaStream) {
  const audioTracks = stream.getAudioTracks()
  
  const audioContext = new AudioContext()
  const sourceNode = audioContext.createMediaStreamSource(stream)
  const highshelFilter = audioContext.createBiquadFilter()
  highshelFilter.type = 'highshelf'
  highshelFilter.frequency.value = 50
  highshelFilter.gain.value = 10

  const destinationNode = audioContext.createMediaStreamDestination()
  sourceNode.connect(highshelFilter).connect(destinationNode)

  const modifiedAudioTrack = destinationNode.stream.getAudioTracks()[0]

  stream.removeTrack(audioTracks[0])
  stream.addTrack(modifiedAudioTrack)
}

