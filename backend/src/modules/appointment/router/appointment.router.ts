import { Router } from 'express';
import * as appointmentController from '../controller/appointment.controller';

const router = Router();

router.post('/', appointmentController.createAppointment);
router.get('/', appointmentController.getAppointments);
router.get('/:id', appointmentController.getAppointmentById);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.cancelAppointment);

export default router; 