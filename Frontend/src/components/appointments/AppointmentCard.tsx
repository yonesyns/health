import React from 'react'
import { Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertCircle } from 'lucide-react'

interface AppointmentCardProps {
  doctor: string
  specialty: string
  date: string
  time: string
  reason: string
  notes: string
  status: 'completed' | 'upcoming' | 'cancelled' | 'missed'
}

const statusConfig = {
  completed: {
    label: 'Terminé',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    icon: CheckCircle
  },
  upcoming: {
    label: 'À venir',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    icon: Clock
  },
  cancelled: {
    label: 'Annulé',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    icon: XCircle
  },
  missed: {
    label: 'Absent',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    icon: AlertCircle
  }
}

export function AppointmentCard({ 
  doctor, 
  specialty, 
  date, 
  time, 
  reason, 
  notes, 
  status 
}: AppointmentCardProps) {
  const config = statusConfig[status]
  const StatusIcon = config.icon

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
            <User className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{doctor}</h3>
            <p className="text-gray-500 text-sm">{specialty}</p>
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Date and Time */}
      <div className="flex items-center gap-6 mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{date}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{time}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-3">
        <div className="flex items-start gap-2">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-700">Motif de consultation</p>
            <p className="text-sm text-gray-600 mt-1">{reason}</p>
          </div>
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-700">Notes</p>
              <p className="text-sm text-gray-600 mt-1">{notes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}