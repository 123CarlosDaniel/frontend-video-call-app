export interface User {
  id: string 
  username: string 
  lastConnection?: string 
  contacts: Contact[] | []
  rooms?: Room[] | [],
  connected?: boolean
}

export interface Room {
  id: string 
  name: string 
  description: string
}

export interface Contact extends Omit<User, 'contacts'>{
}