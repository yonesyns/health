import { Router } from 'express';
import appointmentRouter from '../modules/appointment/router/appointment.router';

const router = Router();

router.use('/appointments', appointmentRouter);

export default router;



