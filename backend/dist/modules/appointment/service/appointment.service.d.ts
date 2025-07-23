import { CreateAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { AppointmentStatus } from '@prisma/client';
export declare class AppointmentService {
    createAppointment(data: CreateAppointmentDto): Promise<{
        status: import(".prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        notes: string | null;
    }>;
    getAppointments(filter: {
        patientId?: string;
        doctorId?: string;
        status?: AppointmentStatus;
    }): Promise<{
        status: import(".prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        notes: string | null;
    }[]>;
    getAppointmentById(id: string): Promise<{
        status: import(".prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        notes: string | null;
    }>;
    updateAppointment(id: string, data: UpdateAppointmentDto): Promise<{
        status: import(".prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        notes: string | null;
    }>;
    cancelAppointment(id: string): Promise<{
        status: import(".prisma/client").$Enums.AppointmentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        date: Date;
        patientId: string;
        doctorId: string;
        notes: string | null;
    }>;
}
//# sourceMappingURL=appointment.service.d.ts.map