import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createBrokerUser() {
  try {
    const email = 'broker@example.com'; // Change this to your broker email
    const password = 'broker123'; // Change this to your desired password
    const name = 'Broker User'; // Change this to your broker name

    // Check if broker already exists
    const existingBroker = await prisma.user.findUnique({
      where: { email }
    });

    if (existingBroker) {
      console.log('Broker user already exists:', existingBroker);
      return;
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create the broker user
    const broker = await prisma.user.create({
      data: {
        email,
        name,
        role: 'broker',
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    });

    console.log('Broker user created successfully:');
    console.log('Email:', broker.email);
    console.log('Name:', broker.name);
    console.log('Role:', broker.role);
    console.log('ID:', broker.id);
    console.log('Created:', broker.createdAt);

  } catch (error) {
    console.error('Error creating broker user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
createBrokerUser();
