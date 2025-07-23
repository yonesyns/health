"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentService = void 0;
const prisma_1 = __importDefault(require("../../../config/prisma"));
const client_1 = require("@prisma/client");
class AppointmentService {
    async createAppointment(data) {
        const conflict = await prisma_1.default.appointment.findFirst({
            where: {
                doctorId: data.doctorId,
                date: new Date(data.date),
                status: client_1.AppointmentStatus.SCHEDULED,
            },
        });
        if (conflict) {
            throw new Error('Le médecin a déjà un rendez-vous à cette date.');
        }
        return await prisma_1.default.appointment.create({
            data: {
                date: new Date(data.date),
                patientId: data.patientId,
                doctorId: data.doctorId,
                notes: data.notes,
                status: client_1.AppointmentStatus.SCHEDULED,
            },
        });
    }
    async getAppointments(filter) {
        return await prisma_1.default.appointment.findMany({
            where: {
                ...(filter.patientId && { patientId: filter.patientId }),
                ...(filter.doctorId && { doctorId: filter.doctorId }),
                ...(filter.status && { status: filter.status }),
            },
            orderBy: { date: 'asc' },
        });
    }
    async getAppointmentById(id) {
        const appointment = await prisma_1.default.appointment.findUnique({
            where: { id },
        });
        if (!appointment)
            throw new Error('Rendez-vous introuvable');
        return appointment;
    }
    async updateAppointment(id, data) {
        const appointment = await prisma_1.default.appointment.findUnique({ where: { id } });
        if (!appointment)
            throw new Error('Rendez-vous introuvable');
        if (appointment.status !== client_1.AppointmentStatus.SCHEDULED) {
            throw new Error('Seuls les rendez-vous prévus peuvent être modifiés.');
        }
        return await prisma_1.default.appointment.update({
            where: { id },
            data: {
                ...(data.date && { date: new Date(data.date) }),
                ...(data.notes && { notes: data.notes }),
            },
        });
    }
    async cancelAppointment(id) {
        const appointment = await prisma_1.default.appointment.findUnique({ where: { id } });
        if (!appointment)
            throw new Error('Rendez-vous introuvable');
        if (appointment.status !== client_1.AppointmentStatus.SCHEDULED) {
            throw new Error('Seuls les rendez-vous prévus peuvent être annulés.');
        }
        return await prisma_1.default.appointment.update({
            where: { id },
            data: { status: client_1.AppointmentStatus.CANCELLED },
        });
    }
}
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointment.service.js.map