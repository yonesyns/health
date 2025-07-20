import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../service/appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { AppointmentStatus } from '@prisma/client';

const appointmentService = new AppointmentService();

export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dto: CreateAppointmentDto = req.body;
    const appointment = await appointmentService.createAppointment(dto);
    res.status(201).json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { patientId, doctorId, status } = req.query;
    const appointments = await appointmentService.getAppointments({
      patientId: patientId as string | undefined,
      doctorId: doctorId as string | undefined,
      status: status as AppointmentStatus | undefined,
    });
    res.json({ success: true, data: appointments });
  } catch (error) {
    next(error);
  }
};

export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.getAppointmentById(id);
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const dto: UpdateAppointmentDto = req.body;
    const appointment = await appointmentService.updateAppointment(id, dto);
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
};

export const cancelAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.cancelAppointment(id);
    res.json({ success: true, data: appointment });
  } catch (error) {
    next(error);
  }
}; 