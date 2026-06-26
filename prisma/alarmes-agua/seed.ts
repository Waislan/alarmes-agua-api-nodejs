import 'dotenv/config';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/alarmes-agua-client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com'
  ).toLowerCase();
  const adminPassword =
    process.env.SEED_ADMIN_PASSWORD ?? 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      password: passwordHash,
      active: true,
      name: 'Administrator',
      deletedAt: null,
    },
    create: {
      email: adminEmail,
      name: 'Administrator',
      password: passwordHash,
    },
  });

  console.log('Seed concluído:', { adminEmail, userId: user.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
