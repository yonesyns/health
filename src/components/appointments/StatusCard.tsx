
import React from 'react'
import { Calendar, Check, X, UserX, List } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatusCardProps {
  title: string
  value: string
  color: 'blue' | 'green' | 'red' | 'gray' | 'purple'
  icon: 'calendar' | 'check' | 'x' | 'user-x' | 'list'
}

const iconMap = {
  calendar: Calendar,
  check: Check,
  x: X,
  'user-x': UserX,
  list: List,
}

const colorMap = {
  blue: 'from-blue-500 to-cyan-500',
  green: 'from-green-500 to-emerald-500',
  red: 'from-red-500 to-pink-500',
  gray: 'from-gray-500 to-slate-500',
  purple: 'from-purple-500 to-violet-500',
}

const backgroundColorMap = {
  blue: 'bg-blue-50 dark:bg-blue-950/20',
  green: 'bg-green-50 dark:bg-green-950/20',
  red: 'bg-red-50 dark:bg-red-950/20',
  gray: 'bg-gray-50 dark:bg-gray-950/20',
  purple: 'bg-purple-50 dark:bg-purple-950/20',
}

export function StatusCard({ title, value, color, icon }: StatusCardProps) {
  const IconComponent = iconMap[icon]
  
  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${backgroundColorMap[color]} border-l-4 border-l-current`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">{value}</p>
          </div>
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${colorMap[color]} flex items-center justify-center shadow-sm`}>
            <IconComponent className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
