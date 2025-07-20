import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsDateString()
  date: string;

  @IsString()
  patientId: string;

  @IsString()
  doctorId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  constructor(date: string, patientId: string, doctorId: string, notes?: string) {
    this.date = date;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.notes = notes;
  }
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  constructor(date?: string, notes?: string) {
    this.date = date;
    this.notes = notes;
  }
} 