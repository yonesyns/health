import prisma from '../../../config/prisma';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { AppointmentStatus } from '@prisma/client';

export class AppointmentService {
  async createAppointment(data: CreateAppointmentDto) {
    // Vérifier la disponibilité du médecin à la date donnée
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: data.doctorId,
        date: new Date(data.date),
        status: AppointmentStatus.SCHEDULED,
      },
    });
    if (conflict) {
      throw new Error('Le médecin a déjà un rendez-vous à cette date.');
    }
    // Créer le rendez-vous
    return await prisma.appointment.create({
      data: {
        date: new Date(data.date),
        patientId: data.patientId,
        doctorId: data.doctorId,
        notes: data.notes,
        status: AppointmentStatus.SCHEDULED,
      },
    });
  }

  async getAppointments(filter: { patientId?: string; doctorId?: string; status?: AppointmentStatus }) {
    return await prisma.appointment.findMany({
      where: {
        ...(filter.patientId && { patientId: filter.patientId }),
        ...(filter.doctorId && { doctorId: filter.doctorId }),
        ...(filter.status && { status: filter.status }),
      },
      orderBy: { date: 'asc' },
    });
  }

  async getAppointmentById(id: string) {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
    });
    if (!appointment) throw new Error('Rendez-vous introuvable');
    return appointment;
  }

  async updateAppointment(id: string, data: UpdateAppointmentDto) {
    // On ne permet la modification que si le rendez-vous est encore prévu
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new Error('Rendez-vous introuvable');
    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Seuls les rendez-vous prévus peuvent être modifiés.');
    }
    return await prisma.appointment.update({
      where: { id },
      data: {
        ...(data.date && { date: new Date(data.date) }),
        ...(data.notes && { notes: data.notes }),
      },
    });
  }

  async cancelAppointment(id: string) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) throw new Error('Rendez-vous introuvable');
    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new Error('Seuls les rendez-vous prévus peuvent être annulés.');
    }
    return await prisma.appointment.update({
      where: { id },
      data: { status: AppointmentStatus.CANCELLED },
    });
  }
}
