export interface CreateAppointmentRequest {
  date: string;
  patientId: string;
  doctorId: string;
  notes?: string;
  visitType?: 'in_person' | 'teleconsultation';
  hasConsultedBefore?: boolean;
}

export interface Appointment {
  id: number;
  patientId: number;
  doctorId: number;
  scheduledAt: string;
  status: string;
  notes?: string;
  visitType: 'in_person' | 'teleconsultation';
  hasConsultedBefore: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AppointmentResponse {
  success: boolean;
  data: Appointment;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class AppointmentService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async createAppointment(data: CreateAppointmentRequest): Promise<AppointmentResponse> {
    return this.makeRequest<AppointmentResponse>('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async getAppointments(params?: {
    patientId?: string;
    doctorId?: string;
    status?: string;
  }): Promise<{ success: boolean; data: Appointment[] }> {
    const searchParams = new URLSearchParams();
    if (params?.patientId) searchParams.append('patientId', params.patientId);
    if (params?.doctorId) searchParams.append('doctorId', params.doctorId);
    if (params?.status) searchParams.append('status', params.status);

    const queryString = searchParams.toString();
    const endpoint = `/appointments${queryString ? `?${queryString}` : ''}`;

    return this.makeRequest<{ success: boolean; data: Appointment[] }>(endpoint);
  }

  static async getAppointmentById(id: string): Promise<AppointmentResponse> {
    return this.makeRequest<AppointmentResponse>(`/appointments/${id}`);
  }

  static async updateAppointment(
    id: string,
    data: Partial<CreateAppointmentRequest>
  ): Promise<AppointmentResponse> {
    return this.makeRequest<AppointmentResponse>(`/appointments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async cancelAppointment(id: string): Promise<AppointmentResponse> {
    return this.makeRequest<AppointmentResponse>(`/appointments/${id}/cancel`, {
      method: 'PUT',
    });
  }
} 