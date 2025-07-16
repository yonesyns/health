
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
    <div className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
      {/* Header with Doctor Info and Status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">{doctor}</h3>
            <p className="text-gray-500 text-sm">{specialty}</p>
          </div>
        </div>
        
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${config.bgColor} ${config.borderColor} border`}>
          <StatusIcon className={`w-4 h-4 ${config.color}`} />
          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>

      {/* Date and Time */}
      <div className="flex items-center space-x-6 mb-4 bg-gray-50 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{date}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{time}</span>
        </div>
      </div>

      {/* Reason */}
      <div className="mb-3">
        <div className="flex items-start space-x-2">
          <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-700">Motif de consultation</p>
            <p className="text-sm text-gray-600 mt-1">{reason}</p>
          </div>
        </div>
      </div>

      {/* Notes (if any) */}
      {notes && (
        <div className="pt-3 border-t border-gray-100">
          <div className="flex items-start space-x-2">
            <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
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
