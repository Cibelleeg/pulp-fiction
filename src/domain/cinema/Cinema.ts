export interface Address {
    id: number,
    logradouro: string,
    numero: string,
    bairro: string,
    cidade: string,
    estado: string,
    cep: string,
}

export interface Cinema {
    id: number,
    name: string,
    cnpj: string,
    phoneNumber: string,
    email: string,
    address: Address
}