export type Role = 'ADMIN' | 'USER'

export interface User {
  id: number
  name: string | null
  email: string
  cpf: string | null
  phoneNumber: string | null
  birthDate: Date | null
  role: Role
}

export interface AuthenticatedUser {
  id: number
  role: Role
  password: string
}

export interface CreateUserInput {
  name?: string
  email: string
  password: string
  cpf?: string
  phoneNumber?: string
  birthDate?: Date
  role?: Role
}

export type UpdateUserInput = Partial<Omit<CreateUserInput, 'password'>> & {
  password?: string
}

export class Usuario {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public cpf: string,
    public phoneNumber: string,
    public birthDate: Date,
    public role: Role
  ) {}

idadeEm(data?: Date): number {
  const referencia = data ?? new Date();

  let idade = referencia.getFullYear() - this.birthDate.getFullYear();

  const aindaNaoFezAniversario =
    referencia.getMonth() < this.birthDate.getMonth() ||
    (
      referencia.getMonth() === this.birthDate.getMonth() &&
      referencia.getDate() < this.birthDate.getDate()
    );

  if (aindaNaoFezAniversario) {
    idade--;
  }

  return idade;
}
}
