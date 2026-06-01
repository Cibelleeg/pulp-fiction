import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

import bcrypt from 'bcryptjs'

const adminPassword = process.env.ADMIN_SEED_PASSWORD
if (!adminPassword) throw new Error('Missing required environment variable: ADMIN_SEED_PASSWORD')

const hashedPassword = await bcrypt.hash(adminPassword, 10)

await prisma.usuario.upsert({
  where: { email: 'admin@cinema.com' },
  update: {},
  create: {
    nome: 'Admin',
    email: 'admin@cinema.com',
    senha: hashedPassword,
    cpf: '00000000000',
    telefone: '00000000000',
    dataNascimento: new Date('1990-01-01'),
    role: 'ADMIN',
  },
})

await prisma.$disconnect()
