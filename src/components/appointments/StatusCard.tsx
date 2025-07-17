import React from 'react'
import {
  Clock,
  CheckCircle2,
  XCircle,
  UserMinus,
  List,
  TrendingUp, TrendingDown, Minus
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

interface StatusCardProps {
  title: string
  value: string
  color: 'neutral'
  icon: 'calendar' | 'check' | 'x' | 'user-x' | 'list'
  accent?: 'blue' | 'green' | 'red' | 'gray' | 'purple'
  trend?: 'up' | 'down' | 'neutral'
}

const iconMap = {
  calendar: Clock,
  check: CheckCircle2,
  x: XCircle,
  'user-x': UserMinus,
  list: List,
}

const bgAccentMap: Record<NonNullable<StatusCardProps['accent']>, string> = {
  blue: 'bg-blue-300/20',
  green: 'bg-green-300/20',
  red: 'bg-red-300/20',
  gray: 'bg-gray-300/20',
  purple: 'bg-purple-300/20',
}

const iconColorMap: Record<NonNullable<StatusCardProps['accent']>, string> = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  red: 'text-red-600',
  gray: 'text-gray-600',
  purple: 'text-purple-600',
}

const trendIconMap = {
  up: TrendingUp,
  down: TrendingDown,
  neutral: Minus
}

export function StatusCard({
  title,
  value,
  icon,
  accent = 'gray',
  trend = 'up'
}: StatusCardProps) {
  const IconComponent = iconMap[icon]
  const TrendIcon = trendIconMap[trend]
  const iconBg = bgAccentMap[accent]
  const iconColor = iconColorMap[accent]

  return (
    <Card className="border border-slate-200 bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={`p-2 rounded-lg ${iconBg} transition-colors`}>
            <IconComponent className={`h-5 w-5 ${iconColor}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{value}</span>
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            <TrendIcon className="h-3 w-3" />
            {trend === 'up' ? '+12%' : trend === 'down' ? '-8%' : '0%'}
          </div>
        </div>
        <p className="text-sm text-slate-500 mt-1">{title}</p>
      </CardContent>
    </Card>
  )
}
