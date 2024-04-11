export interface User {
  id: string 
  username: string 
  lastConnection?: string 
  contacts: Contact[] | []
  rooms?: Room[] | [],
  connected?: boolean,
  recordings: RecordingData[]
}

export interface Room {
  id: string 
  name: string 
  description: string
}

export interface RecordingData {
  id: string
  name: string
  creationDate: string
  recordingKey: string
}

export interface Contact extends Omit<User, 'contacts'>{
}