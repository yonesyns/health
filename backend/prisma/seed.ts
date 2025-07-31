import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create sample users
  const hashedPassword = await bcrypt.hash('password123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: hashedPassword,
      username: 'admin@example.com',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: hashedPassword,
      username: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user',
    },
  });

  console.log('👥 Created users:', { adminUser, regularUser });

  // Create sample hospitals
  const hospitals = await Promise.all([
    prisma.hospital.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Centre Hospitalier Universitaire de Paris',
        address: '123 Rue de la Santé, 75001 Paris',
        phone: '+33 1 42 34 56 78',
        email: 'contact@chu-paris.fr',
        capacity: 500,
        emergencyCapacity: 50,
        beds: 400,
        doctorCount: 150,
        patientCount: 1000,
        status: 'active',
        emergencyServices: true,
        website: 'https://www.chu-paris.fr',
        contactPerson: 'Dr. Martin',
      },
    }),
    prisma.hospital.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Hôpital Saint-Joseph',
        address: '185 Rue Raymond Losserand, 75014 Paris',
        phone: '+33 1 44 12 33 33',
        email: 'contact@hopital-saint-joseph.org',
        capacity: 300,
        emergencyCapacity: 30,
        beds: 250,
        doctorCount: 100,
        patientCount: 600,
        status: 'active',
        emergencyServices: true,
        website: 'https://www.hopital-saint-joseph.org',
        contactPerson: 'Dr. Dubois',
      },
    }),
  ]);

  console.log('🏥 Created hospitals:', hospitals);

  // Create sample departments
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Cardiologie',
        description: 'Service de cardiologie et maladies cardiovasculaires',
        code: 'CARDIO',
        floor: 2,
        capacity: 30,
        hospitalId: 1,
        isActive: true,
      },
    }),
    prisma.department.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Dermatologie',
        description: 'Service de dermatologie et maladies de la peau',
        code: 'DERMA',
        floor: 3,
        capacity: 20,
        hospitalId: 1,
        isActive: true,
      },
    }),
    prisma.department.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        name: 'Pédiatrie',
        description: 'Service de pédiatrie et soins aux enfants',
        code: 'PEDIA',
        floor: 1,
        capacity: 40,
        hospitalId: 2,
        isActive: true,
      },
    }),
  ]);

  console.log('🏢 Created departments:', departments);

  // Create sample doctors
  const doctors = await Promise.all([
    prisma.doctor.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        hospitalId: 1,
        departmentId: 1,
        registrationNumber: 'DR001',
        firstName: 'Marie',
        lastName: 'Dubois',
        gender: 'female',
        email: 'marie.dubois@chu-paris.fr',
        phone: '+33 1 42 34 56 79',
        licenseNumber: 'LIC001',
        specialty: 'Cardiologie',
        status: 'on_duty',
        bio: 'Cardiologue expérimentée avec 15 ans d\'expérience',
        yearsOfExperience: 15,
        address: '123 Rue de la Santé, 75001 Paris',
        isActive: true,
      },
    }),
    prisma.doctor.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        hospitalId: 1,
        departmentId: 2,
        registrationNumber: 'DR002',
        firstName: 'Pierre',
        lastName: 'Martin',
        gender: 'male',
        email: 'pierre.martin@chu-paris.fr',
        phone: '+33 1 42 34 56 80',
        licenseNumber: 'LIC002',
        specialty: 'Dermatologie',
        status: 'on_duty',
        bio: 'Dermatologue spécialisé dans les maladies de la peau',
        yearsOfExperience: 12,
        address: '456 Avenue des Médecins, 75001 Paris',
        isActive: true,
      },
    }),
    prisma.doctor.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        hospitalId: 2,
        departmentId: 3,
        registrationNumber: 'DR003',
        firstName: 'Sophie',
        lastName: 'Bernard',
        gender: 'female',
        email: 'sophie.bernard@hopital-saint-joseph.org',
        phone: '+33 1 44 12 33 34',
        licenseNumber: 'LIC003',
        specialty: 'Pédiatrie',
        status: 'on_duty',
        bio: 'Pédiatre spécialisée dans les soins aux enfants',
        yearsOfExperience: 18,
        address: '789 Boulevard des Enfants, 75014 Paris',
        isActive: true,
      },
    }),
  ]);

  console.log('👨‍⚕️ Created doctors:', doctors);

  // Create sample patients
  const patients = await Promise.all([
    prisma.patient.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        firstName: 'Jean',
        lastName: 'Martin',
        dateOfBirth: new Date('1985-03-15'),
        gender: 'male',
        identifierType: 'Carte Vitale',
        identifier: '1234567890123',
        socialSecurityNumber: '123456789012345',
        phone: '+33 6 12 34 56 78',
        email: 'jean.martin@email.com',
        address: '456 Avenue des Patients, 75002 Paris',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75002',
        country: 'France',
        bloodGroup: 'A+',
        heightCm: 175,
        weightKg: 70,
        allergies: 'Pénicilline',
        medicalHistoryText: 'Antécédents familiaux de diabète',
        maritalStatus: 'marié',
        occupation: 'Ingénieur',
        consent: true,
        emergencyContactName: 'Marie Martin',
        emergencyContactPhone: '+33 6 98 76 54 32',
        emergencyContactRelation: 'Épouse',
        patientStatus: 'actif',
        hospitalId: 1,
        doctorId: 1,
      },
    }),
    prisma.patient.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        firstName: 'Anne',
        lastName: 'Dupont',
        dateOfBirth: new Date('1990-07-22'),
        gender: 'female',
        identifierType: 'Carte Vitale',
        identifier: '9876543210987',
        socialSecurityNumber: '987654321098765',
        phone: '+33 6 98 76 54 32',
        email: 'anne.dupont@email.com',
        address: '789 Rue des Patients, 75003 Paris',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75003',
        country: 'France',
        bloodGroup: 'O+',
        heightCm: 165,
        weightKg: 55,
        allergies: 'Aucune',
        medicalHistoryText: 'Aucun antécédent notable',
        maritalStatus: 'célibataire',
        occupation: 'Architecte',
        consent: true,
        emergencyContactName: 'Pierre Dupont',
        emergencyContactPhone: '+33 6 12 34 56 78',
        emergencyContactRelation: 'Frère',
        patientStatus: 'actif',
        hospitalId: 1,
        doctorId: 2,
      },
    }),
    prisma.patient.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        firstName: 'Lucas',
        lastName: 'Petit',
        dateOfBirth: new Date('2015-11-10'),
        gender: 'male',
        identifierType: 'Carte Vitale',
        identifier: '5556667778889',
        socialSecurityNumber: '555666777888999',
        phone: '+33 6 55 44 33 22',
        email: 'lucas.petit@email.com',
        address: '321 Avenue des Enfants, 75014 Paris',
        city: 'Paris',
        state: 'Île-de-France',
        zipCode: '75014',
        country: 'France',
        bloodGroup: 'B+',
        heightCm: 120,
        weightKg: 25,
        allergies: 'Lactose',
        medicalHistoryText: 'Enfant en bonne santé',
        maritalStatus: 'célibataire',
        occupation: 'Écolier',
        consent: true,
        emergencyContactName: 'Emma Petit',
        emergencyContactPhone: '+33 6 99 88 77 66',
        emergencyContactRelation: 'Mère',
        patientStatus: 'actif',
        hospitalId: 2,
        doctorId: 3,
      },
    }),
  ]);

  console.log('👤 Created patients:', patients);

  // Create sample rooms
  const rooms = await Promise.all([
    prisma.room.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        hospitalId: 1,
        departmentId: 1,
        number: '201',
        type: 'Consultation',
        floor: 2,
        capacity: 1,
        isAvailable: true,
        status: 'available',
        equipment: 'Électrocardiogramme, Tensio-mètre',
        notes: 'Salle de consultation cardiologie',
        dailyRate: 150.00,
        features: 'Climatisation, Éclairage LED',
      },
    }),
    prisma.room.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        hospitalId: 1,
        departmentId: 2,
        number: '301',
        type: 'Consultation',
        floor: 3,
        capacity: 1,
        isAvailable: true,
        status: 'available',
        equipment: 'Dermatoscope, Lampe UV',
        notes: 'Salle de consultation dermatologie',
        dailyRate: 120.00,
        features: 'Climatisation, Éclairage spécialisé',
      },
    }),
    prisma.room.upsert({
      where: { id: 3 },
      update: {},
      create: {
        id: 3,
        hospitalId: 2,
        departmentId: 3,
        number: '101',
        type: 'Consultation',
        floor: 1,
        capacity: 1,
        isAvailable: true,
        status: 'available',
        equipment: 'Stéthoscope pédiatrique, Balance',
        notes: 'Salle de consultation pédiatrie',
        dailyRate: 100.00,
        features: 'Décoration adaptée aux enfants',
      },
    }),
  ]);

  console.log('🏠 Created rooms:', rooms);

  // Create sample availabilities for doctors
  const availabilities = await Promise.all([
    // Dr. Marie Dubois (Cardiologie) - Lundi à Vendredi, 9h-17h
    prisma.availability.create({
      data: {
        doctorId: 1,
        weekDay: 1, // Lundi
        startTime: '09:00',
        endTime: '17:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 1,
        weekDay: 2, // Mardi
        startTime: '09:00',
        endTime: '17:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 1,
        weekDay: 3, // Mercredi
        startTime: '09:00',
        endTime: '17:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 1,
        weekDay: 4, // Jeudi
        startTime: '09:00',
        endTime: '17:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 1,
        weekDay: 5, // Vendredi
        startTime: '09:00',
        endTime: '17:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    // Dr. Pierre Martin (Dermatologie) - Mardi à Samedi, 10h-18h
    prisma.availability.create({
      data: {
        doctorId: 2,
        weekDay: 2, // Mardi
        startTime: '10:00',
        endTime: '18:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 2,
        weekDay: 3, // Mercredi
        startTime: '10:00',
        endTime: '18:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 2,
        weekDay: 4, // Jeudi
        startTime: '10:00',
        endTime: '18:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 2,
        weekDay: 5, // Vendredi
        startTime: '10:00',
        endTime: '18:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 2,
        weekDay: 6, // Samedi
        startTime: '10:00',
        endTime: '16:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    // Dr. Sophie Bernard (Pédiatrie) - Lundi à Vendredi, 8h-16h
    prisma.availability.create({
      data: {
        doctorId: 3,
        weekDay: 1, // Lundi
        startTime: '08:00',
        endTime: '16:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 3,
        weekDay: 2, // Mardi
        startTime: '08:00',
        endTime: '16:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 3,
        weekDay: 3, // Mercredi
        startTime: '08:00',
        endTime: '16:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 3,
        weekDay: 4, // Jeudi
        startTime: '08:00',
        endTime: '16:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
    prisma.availability.create({
      data: {
        doctorId: 3,
        weekDay: 5, // Vendredi
        startTime: '08:00',
        endTime: '16:00',
        available: true,
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-12-31'),
      },
    }),
  ]);

  console.log('📅 Created availabilities:', availabilities.length);

  // Create sample appointments
  const appointments = await Promise.all([
    // Rendez-vous passé (terminé)
    prisma.appointment.create({
      data: {
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date('2025-07-20T10:00:00Z'),
        duration: 30,
        status: 'completed',
        reason: 'Consultation de routine',
        notes: 'Patient en bonne santé, tension normale',
        roomId: 1,
      },
    }),
    // Rendez-vous à venir (programmé)
    prisma.appointment.create({
      data: {
        patientId: 1,
        doctorId: 1,
        scheduledAt: new Date('2025-08-15T10:00:00Z'),
        duration: 30,
        status: 'scheduled',
        reason: 'Suivi cardiologique',
        notes: 'Patient à jeun depuis 12h',
        roomId: 1,
      },
    }),
    // Rendez-vous pour Anne Dupont
    prisma.appointment.create({
      data: {
        patientId: 2,
        doctorId: 2,
        scheduledAt: new Date('2025-08-20T14:00:00Z'),
        duration: 45,
        status: 'scheduled',
        reason: 'Examen dermatologique',
        notes: 'Démangeaisons persistantes',
        roomId: 2,
      },
    }),
    // Rendez-vous pour Lucas Petit
    prisma.appointment.create({
      data: {
        patientId: 3,
        doctorId: 3,
        scheduledAt: new Date('2025-08-25T09:00:00Z'),
        duration: 30,
        status: 'scheduled',
        reason: 'Contrôle pédiatrique',
        notes: 'Vaccination prévue',
        roomId: 3,
      },
    }),
    // Rendez-vous en cours
    prisma.appointment.create({
      data: {
        patientId: 2,
        doctorId: 2,
        scheduledAt: new Date('2025-07-28T11:00:00Z'),
        duration: 30,
        status: 'in_progress',
        reason: 'Consultation dermatologique',
        notes: 'Examen en cours',
        roomId: 2,
      },
    }),
  ]);

  console.log('📅 Created appointments:', appointments);

  console.log('✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- ${hospitals.length} hospitals`);
  console.log(`- ${departments.length} departments`);
  console.log(`- ${doctors.length} doctors`);
  console.log(`- ${patients.length} patients`);
  console.log(`- ${rooms.length} rooms`);
  console.log(`- ${availabilities.length} availabilities`);
  console.log(`- ${appointments.length} appointments`);
  console.log('\n🔑 Test credentials:');
  console.log('- Admin: admin@example.com / password123');
  console.log('- User: user@example.com / password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 