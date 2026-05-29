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
