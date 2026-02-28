import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log("Current users:");
  console.log(users.map(u => ({ email: u.email, role: u.role })));
  
  if (users.length > 0) {
    let userToUpdate = users.find(u => u.email === 'lat.dev08@gmail.com');
    if (!userToUpdate) userToUpdate = users[0];

    const updatedUser = await prisma.user.update({
      where: { id: userToUpdate.id },
      data: { role: 'ADMIN' }
    });
    console.log("Updated user to ADMIN:", updatedUser.email);
  } else {
    console.log("No users found in database.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
