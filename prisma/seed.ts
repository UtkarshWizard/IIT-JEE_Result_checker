import { PrismaClient } from '@/app/generated/prisma';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const states = [
    'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Delhi',
    'Kerala', 'West Bengal', 'Gujarat', 'Rajasthan',
    'Uttar Pradesh', 'Bihar', 'Assam', 'Punjab', 'Odisha'
  ];
  const genders = ['Male', 'Female'];

  const createStudents = [];

  for (let i = 1; i <= 150000; i++) {
    const name = faker.person.fullName();
    const gender = faker.helpers.arrayElement(genders);
    const state = faker.helpers.arrayElement(states);
    const hallTicket = `HT${i.toString().padStart(6, '0')}`;

    const physics = faker.number.int({ min: 0, max: 70 });
    const chemistry = faker.number.int({ min: 0, max: 70 });
    const math = faker.number.int({ min: 0, max: 70 });
    const total = physics + chemistry + math;

    let passed = true;

    if (total < 80 || physics < 20 || chemistry < 20 || math < 20) {
      passed = false;
    }

    createStudents.push({
      name,
      gender,
      state,
      hallTicket,
      physicsMarks: physics,
      chemistryMarks: chemistry,
      mathMarks: math,
      totalMarks: total,
      rank: faker.number.int({ min: 1, max: 150000 }),
      passed
    });

    if (i % 1000 === 0) {
      console.log(`Prepared ${i} students`);
    }
  }

  await prisma.student.createMany({
    data: createStudents,
  });

  console.log('Seeded all students');
}

main()
  .then(() => {
    console.log('✅ Seeding complete');
    prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
