import { IsString, IsDateString, IsOptional, IsEnum, IsBoolean } from 'class-validator';

export enum VisitType {
  IN_PERSON = 'in_person',
  TELECONSULTATION = 'teleconsultation'
}

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

  @IsOptional()
  @IsEnum(VisitType)
  visitType?: VisitType;

  @IsOptional()
  @IsBoolean()
  hasConsultedBefore?: boolean;

  constructor(
    date: string, 
    patientId: string, 
    doctorId: string, 
    notes?: string,
    visitType?: VisitType,
    hasConsultedBefore?: boolean
  ) {
    this.date = date;
    this.patientId = patientId;
    this.doctorId = doctorId;
    this.notes = notes;
    this.visitType = visitType;
    this.hasConsultedBefore = hasConsultedBefore;
  }
}

export class UpdateAppointmentDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsEnum(VisitType)
  visitType?: VisitType;

  @IsOptional()
  @IsBoolean()
  hasConsultedBefore?: boolean;

  constructor(
    date?: string, 
    notes?: string,
    visitType?: VisitType,
    hasConsultedBefore?: boolean
  ) {
    this.date = date;
    this.notes = notes;
    this.visitType = visitType;
    this.hasConsultedBefore = hasConsultedBefore;
  }
} 