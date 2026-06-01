export type Role = 'ADMIN' | 'USER'

export interface User {
  id: number
  name: string
  email: string
  cpf: string
  phoneNumber: string
  birthDate: Date
  role: Role
}

export interface AuthenticatedUser {
  id: number
  role: Role
  password: string
}
