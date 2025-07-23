export declare class CreateAppointmentDto {
    date: string;
    patientId: string;
    doctorId: string;
    notes?: string;
    constructor(date: string, patientId: string, doctorId: string, notes?: string);
}
export declare class UpdateAppointmentDto {
    date?: string;
    notes?: string;
    constructor(date?: string, notes?: string);
}
//# sourceMappingURL=appointment.dto.d.ts.map