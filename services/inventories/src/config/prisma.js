const { PrismaClient } = require('../src/generated/prisma');

const loggingMiddleware = require('../middlewares/logging');
const slowQueryLogger = require('../middlewares/slowQueryLogger');


const prisma = new PrismaClient();

async function connectPrisma() {
  try {
    await prisma.$connect();
    console.log('✅ Prisma DB connected');
  } catch (err) {
    console.error('❌ Prisma connection failed:', err);
    process.exit(1);
  }
}

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('🛑 Prisma DB disconnected');
  process.exit(0);
});


prisma.$use(loggingMiddleware);
prisma.$use(slowQueryLogger);

module.exports = {
  prisma,
  connectPrisma,
};
