import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      description: true
    }
  })

  for (const product of products) {
    if (product.description && !product.description.includes('<')) {
      const htmlDescription = product.description
        .split('\n')
        .map(line => `<p>${line}</p>`)
        .join('')
      
      await prisma.product.update({
        where: { id: product.id },
        data: { description: htmlDescription }
      })
      console.log(`Updated product ${product.id}`)
    }
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
