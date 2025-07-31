import prisma from '../../../config/prisma';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentService {
  async createAppointment(data: CreateAppointmentDto) {
    // Debug: afficher la date reçue
    console.log('Date reçue:', data.date);
    console.log('Type de date:', typeof data.date);
    
    // Valider et parser la date
    let scheduledAt: Date;
    
    try {
      // Essayer de parser la date
      scheduledAt = new Date(data.date);
      console.log('Date parsée:', scheduledAt);
      console.log('Timestamp:', scheduledAt.getTime());
      
      if (isNaN(scheduledAt.getTime())) {
        throw new Error(`Date invalide: ${data.date}`);
      }
    } catch (error) {
      console.error('Erreur de parsing de date:', error);
      throw new Error(`Format de date invalide. Utilisez le format ISO: "2025-09-01T14:00:00.000Z"`);
    }

    // Vérifier la disponibilité du médecin à la date donnée
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: parseInt(data.doctorId),
        scheduledAt: scheduledAt,
        status: AppointmentStatus.scheduled,
      },
    });
    if (conflict) {
      throw new Error('Le médecin a déjà un rendez-vous à cette date.');
    }
    
    // Créer le rendez-vous
    return await prisma.appointment.create({
      data: {
        scheduledAt: scheduledAt,
        patientId: parseInt(data.patientId),
        doctorId: parseInt(data.doctorId),
        notes: data.notes,
        status: AppointmentStatus.scheduled,
      },
    });
  }

  async getAppointments(filter: { patientId?: string; doctorId?: string; status?: AppointmentStatus }) {
    return await prisma.appointment.findMany({
      where: {
        ...(filter.patientId && { patientId: parseInt(filter.patientId) }),
        ...(filter.doctorId && { doctorId: parseInt(filter.doctorId) }),
        ...(filter.status && { status: filter.status }),
      },
      orderBy: { scheduledAt: 'asc' },
    });
  }

  async getAppointmentById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id: parseInt(id) },
    });
    if (!appointment) throw new Error('Rendez-vous introuvable');
    return appointment;
  }

  async updateAppointment(id: string, data: UpdateAppointmentDto) {
    // On ne permet la modification que si le rendez-vous est encore prévu
    const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });
    if (!appointment) throw new Error('Rendez-vous introuvable');
    if (appointment.status !== AppointmentStatus.scheduled) {
      throw new Error('Seuls les rendez-vous prévus peuvent être modifiés.');
    }

    // Valider la date si fournie
    let scheduledAt = undefined;
    if (data.date) {
      try {
        scheduledAt = new Date(data.date);
        if (isNaN(scheduledAt.getTime())) {
          throw new Error(`Date invalide: ${data.date}`);
        }
      } catch (error) {
        throw new Error(`Format de date invalide. Utilisez le format ISO: "2025-09-01T14:00:00.000Z"`);
      }
    }

    return await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: {
        ...(scheduledAt && { scheduledAt }),
        ...(data.notes && { notes: data.notes }),
      },
    });
  }

  async cancelAppointment(id: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id: parseInt(id) } });
    if (!appointment) throw new Error('Rendez-vous introuvable');
    if (appointment.status !== AppointmentStatus.scheduled) {
      throw new Error('Seuls les rendez-vous prévus peuvent être annulés.');
    }
    return await prisma.appointment.update({
      where: { id: parseInt(id) },
      data: { status: AppointmentStatus.canceled },
    });
  }
}
