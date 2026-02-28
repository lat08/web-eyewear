import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const product = await prisma.product.findUnique({
    where: { id: 242 }
  })
  console.log('Product 242:', JSON.stringify(product, null, 2))
  
  const total = await prisma.product.count()
  console.log('Total products:', total)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
