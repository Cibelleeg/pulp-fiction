import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client.js'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

const products = [
  {
    nome: 'Pipoca Grande',
    descricao: 'Balde grande de pipoca salgada',
    preco: 22.9,
    estoque: 100,
    categoria: 'Pipoca',
    poster: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
    tamanhos: ['Grande'],
    sabores: ['Salgada', 'Manteiga'],
  },
  {
    nome: 'Pipoca Media',
    descricao: 'Balde medio de pipoca salgada',
    preco: 18.9,
    estoque: 100,
    categoria: 'Pipoca',
    poster: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&w=800&q=80',
    tamanhos: ['Media'],
    sabores: ['Salgada', 'Manteiga'],
  },
  {
    nome: 'Refrigerante 700ml',
    descricao: 'Copo grande de refrigerante',
    preco: 12.9,
    estoque: 100,
    categoria: 'Bebida',
    poster: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    tamanhos: ['700ml'],
    sabores: ['Cola', 'Guarana', 'Laranja'],
  },
  {
    nome: 'Refrigerante 500ml',
    descricao: 'Copo medio de refrigerante',
    preco: 10.9,
    estoque: 100,
    categoria: 'Bebida',
    poster: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80',
    tamanhos: ['500ml'],
    sabores: ['Cola', 'Guarana', 'Laranja'],
  },
  {
    nome: 'Chocolate',
    descricao: 'Barra de chocolate para acompanhar o filme',
    preco: 8.9,
    estoque: 100,
    categoria: 'Doce',
    poster: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?auto=format&fit=crop&w=800&q=80',
    tamanhos: [],
    sabores: ['Ao leite', 'Meio amargo'],
  },
  {
    nome: 'Nachos',
    descricao: 'Porcao de nachos com molho cheddar',
    preco: 19.9,
    estoque: 80,
    categoria: 'Salgado',
    poster: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?auto=format&fit=crop&w=800&q=80',
    tamanhos: [],
    sabores: ['Cheddar'],
  },
  {
    nome: 'Agua Mineral 500ml',
    descricao: 'Garrafa de agua mineral sem gas',
    preco: 6.9,
    estoque: 120,
    categoria: 'Bebida',
    poster: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=800&q=80',
    tamanhos: ['500ml'],
    sabores: ['Natural'],
  },
  {
    nome: 'Suco Natural 500ml',
    descricao: 'Suco natural gelado',
    preco: 13.9,
    estoque: 70,
    categoria: 'Bebida',
    poster: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?auto=format&fit=crop&w=800&q=80',
    tamanhos: ['500ml'],
    sabores: ['Laranja', 'Uva', 'Maracuja'],
  },
  {
    nome: 'Bala de Gelatina',
    descricao: 'Pacote de balas de gelatina sortidas',
    preco: 7.9,
    estoque: 90,
    categoria: 'Doce',
    poster: 'https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?auto=format&fit=crop&w=800&q=80',
    tamanhos: [],
    sabores: ['Sortidas'],
  },
  {
    nome: 'Sorvete de Copo',
    descricao: 'Sorvete individual de copo',
    preco: 14.9,
    estoque: 60,
    categoria: 'Doce',
    poster: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&w=800&q=80',
    tamanhos: ['Individual'],
    sabores: ['Chocolate', 'Baunilha', 'Morango'],
  },
  {
    nome: 'Cachorro-Quente',
    descricao: 'Cachorro-quente com molho, batata palha e queijo',
    preco: 17.9,
    estoque: 50,
    categoria: 'Salgado',
    poster: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?auto=format&fit=crop&w=800&q=80',
    tamanhos: [],
    sabores: ['Tradicional'],
  },
  {
    nome: 'Cookies',
    descricao: 'Porcao com cookies assados',
    preco: 12.9,
    estoque: 75,
    categoria: 'Doce',
    poster: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=800&q=80',
    tamanhos: [],
    sabores: ['Chocolate'],
  },
]

const combos = [
  {
    nome: 'Combo Classico',
    descricao: 'Pipoca grande com dois refrigerantes de 700ml.',
    preco: 42.9,
    ativo: true,
    poster: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?auto=format&fit=crop&w=1000&q=80',
    itens: [
      { produto: 'Pipoca Grande', quantidade: 1 },
      { produto: 'Refrigerante 700ml', quantidade: 2 },
    ],
  },
  {
    nome: 'Combo Casal',
    descricao: 'Pipoca media, dois refrigerantes de 500ml e um chocolate.',
    preco: 44.9,
    ativo: true,
    poster: 'https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1000&q=80',
    itens: [
      { produto: 'Pipoca Media', quantidade: 1 },
      { produto: 'Refrigerante 500ml', quantidade: 2 },
      { produto: 'Chocolate', quantidade: 1 },
    ],
  },
  {
    nome: 'Combo Premium',
    descricao: 'Pipoca grande, nachos e dois refrigerantes de 700ml.',
    preco: 59.9,
    ativo: true,
    poster: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1000&q=80',
    itens: [
      { produto: 'Pipoca Grande', quantidade: 1 },
      { produto: 'Nachos', quantidade: 1 },
      { produto: 'Refrigerante 700ml', quantidade: 2 },
    ],
  },
]

async function ensureProduct(product: (typeof products)[number]) {
  const existing = await prisma.produto.findFirst({
    where: { nome: product.nome },
  })

  if (existing) {
    return prisma.produto.update({
      where: { idProduto: existing.idProduto },
      data: product,
    })
  }

  return prisma.produto.create({ data: product })
}

for (const product of products) {
  await ensureProduct(product)
}

for (const combo of combos) {
  const itens = await Promise.all(
    combo.itens.map(async (item) => {
      const produto = await prisma.produto.findFirst({
        where: { nome: item.produto },
      })

      if (!produto) throw new Error(`Produto nao encontrado: ${item.produto}`)

      return {
        idProduto: produto.idProduto,
        quantidade: item.quantidade,
      }
    }),
  )

  const existing = await prisma.combo.findFirst({
    where: { nome: combo.nome },
  })

  if (existing) {
    await prisma.combo.update({
      where: { idCombo: existing.idCombo },
      data: {
        nome: combo.nome,
        descricao: combo.descricao,
        preco: combo.preco,
        ativo: combo.ativo,
        poster: combo.poster,
        itens: {
          deleteMany: {},
          create: itens,
        },
      },
    })
  } else {
    await prisma.combo.create({
      data: {
        nome: combo.nome,
        descricao: combo.descricao,
        preco: combo.preco,
        ativo: combo.ativo,
        poster: combo.poster,
        itens: {
          create: itens,
        },
      },
    })
  }
}

console.log('3 combos cadastrados com sucesso.')

await prisma.$disconnect()
