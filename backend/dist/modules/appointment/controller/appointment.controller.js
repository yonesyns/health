"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelAppointment = exports.updateAppointment = exports.getAppointmentById = exports.getAppointments = exports.createAppointment = void 0;
const appointment_service_1 = require("../service/appointment.service");
const appointmentService = new appointment_service_1.AppointmentService();
const createAppointment = async (req, res, next) => {
    try {
        const dto = req.body;
        const appointment = await appointmentService.createAppointment(dto);
        res.status(201).json({ success: true, data: appointment });
    }
    catch (error) {
        next(error);
    }
};
exports.createAppointment = createAppointment;
const getAppointments = async (req, res, next) => {
    try {
        const { patientId, doctorId, status } = req.query;
        const appointments = await appointmentService.getAppointments({
            patientId: patientId,
            doctorId: doctorId,
            status: status,
        });
        res.json({ success: true, data: appointments });
    }
    catch (error) {
        next(error);
    }
};
exports.getAppointments = getAppointments;
const getAppointmentById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentService.getAppointmentById(id);
        res.json({ success: true, data: appointment });
    }
    catch (error) {
        next(error);
    }
};
exports.getAppointmentById = getAppointmentById;
const updateAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const dto = req.body;
        const appointment = await appointmentService.updateAppointment(id, dto);
        res.json({ success: true, data: appointment });
    }
    catch (error) {
        next(error);
    }
};
exports.updateAppointment = updateAppointment;
const cancelAppointment = async (req, res, next) => {
    try {
        const { id } = req.params;
        const appointment = await appointmentService.cancelAppointment(id);
        res.json({ success: true, data: appointment });
    }
    catch (error) {
        next(error);
    }
};
exports.cancelAppointment = cancelAppointment;
//# sourceMappingURL=appointment.controller.js.map