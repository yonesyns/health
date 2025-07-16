
import React from 'react'
import { Calendar, Clock, User, FileText, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

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
    variant: 'default' as const,
    color: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-400',
    icon: CheckCircle
  },
  upcoming: {
    label: 'À venir',
    variant: 'secondary' as const,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400',
    icon: Clock
  },
  cancelled: {
    label: 'Annulé',
    variant: 'destructive' as const,
    color: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-400',
    icon: Clock
  },
  missed: {
    label: 'Absent',
    variant: 'outline' as const,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-950 dark:text-gray-400',
    icon: Clock
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
    <div className="border border-border rounded-lg p-4 bg-card hover:shadow-sm transition-shadow">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Main Info */}
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-semibold text-card-foreground flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {doctor}
              </h4>
              <p className="text-sm text-muted-foreground">{specialty}</p>
            </div>
            <Badge className={config.color}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {config.label}
            </Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{time}</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Motif:</p>
                <p className="text-sm text-muted-foreground">{reason}</p>
              </div>
            </div>
            
            {notes && (
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Notes:</p>
                  <p className="text-sm text-muted-foreground">{notes}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
