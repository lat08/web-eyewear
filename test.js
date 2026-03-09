const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const post = await prisma.post.findFirst();
  console.log("First post ID:", post?.id);
  if (!post) {
      // create a mock post if no post found
      const newPost = await prisma.post.create({
          data: {
              title: "Test Post",
              slug: "test-post",
              content: "test content"
          }
      });
      console.log("Created mock post:", newPost.id);
  }
}
main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
