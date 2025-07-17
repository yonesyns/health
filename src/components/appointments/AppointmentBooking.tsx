
"use client"

import type React from "react"
import { useState, useMemo } from "react"
import {
  ArrowLeft,
  Video,
  Building2,
  ChevronUp,
  ChevronDown,
  Check,
  Download,
  Clock,
  Calendar,
  User,
  FileText,
  MapPin,
  CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AppointmentBookingProps {
  doctorName?: string
  isInDialog?: boolean
  onGoBack: () => void
  onClose: () => void
}

interface ConsultationReason {
  id: number
  name: string
  availableForNewPatients: boolean
}

interface AvailableDate {
  value: string
  label: string
  slotsCount: number
  slots: string[]
  moreSlots: string[]
  hasMore: boolean
}

const consultationReasons: ConsultationReason[] = [
  { id: 1, name: "Première consultation de médecine générale", availableForNewPatients: false },
  { id: 2, name: "Première consultation de pédiatrie", availableForNewPatients: false },
  { id: 3, name: "Renouvellement de traitement", availableForNewPatients: true },
  { id: 4, name: "Cystite", availableForNewPatients: true },
  { id: 5, name: "Urgence", availableForNewPatients: true },
  { id: 6, name: "Vaccinations", availableForNewPatients: true },
  { id: 7, name: "Consultation de suivi de pédiatrie", availableForNewPatients: false },
  { id: 8, name: "Urgence pédiatrie", availableForNewPatients: true },
  { id: 9, name: "Urgences du samedi après-midi", availableForNewPatients: true },
  { id: 10, name: "Consultation de médecine générale", availableForNewPatients: true },
]

const availableDates: AvailableDate[] = [
  {
    value: "2025-07-23",
    label: "Mercredi 23 juillet",
    slotsCount: 1,
    slots: ["10:40"],
    moreSlots: [],
    hasMore: false,
  },
  {
    value: "2025-07-24",
    label: "Jeudi 24 juillet",
    slotsCount: 8,
    slots: ["07:50", "08:30", "08:40", "09:10", "09:20", "09:30"],
    moreSlots: ["10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    hasMore: true,
  },
  {
    value: "2025-07-28",
    label: "Lundi 28 juillet",
    slotsCount: 6,
    slots: ["08:00", "09:00", "10:00", "11:00", "14:00", "15:00"],
    moreSlots: [],
    hasMore: false,
  },
  {
    value: "2025-07-29",
    label: "Mardi 29 juillet",
    slotsCount: 4,
    slots: ["08:30", "09:30", "14:30", "15:30"],
    moreSlots: ["10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30"],
    hasMore: true,
  },
]

const StepCard: React.FC<{
  stepNumber: number
  title: string
  isActive: boolean
  isCompleted: boolean
  children: React.ReactNode
}> = ({ stepNumber, title, isActive, isCompleted, children }) => {
  return (
    <Card className={`transition-all duration-200 ${isActive ? 'ring-2 ring-primary/20 shadow-lg' : 'shadow-sm hover:shadow-md'}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            isCompleted ? 'bg-green-100 text-green-700' : 
            isActive ? 'bg-primary text-primary-foreground' : 
            'bg-muted text-muted-foreground'
          }`}>
            {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
          </div>
          <h3 className={`text-lg font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
            {title}
          </h3>
        </div>
        {children}
      </CardContent>
    </Card>
  )
}

const OptionCard: React.FC<{
  checked: boolean
  onChange: () => void
  disabled?: boolean
  icon?: React.ReactNode
  title: string
  description?: string
  badge?: string
}> = ({ checked, onChange, disabled = false, icon, title, description, badge }) => {
  return (
    <div
      onClick={disabled ? undefined : onChange}
      className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed bg-muted/30' :
        checked ? 'border-primary bg-primary/5 shadow-md' : 
        'border-border hover:border-primary/50 hover:bg-accent/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
          checked ? 'border-primary bg-primary' : 'border-muted-foreground'
        }`}>
          {checked && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon}
            <span className="font-medium text-foreground">{title}</span>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function AppointmentBooking({
  doctorName = "Dr. Isabelle Boublil",
  isInDialog = false,
  onGoBack,
  onClose,
}: AppointmentBookingProps) {
  const [hasConsultedBefore, setHasConsultedBefore] = useState<boolean | null>(null)
  const [consultationMode, setConsultationMode] = useState<string>("")
  const [consultationReason, setConsultationReason] = useState<number | null>(null)
  const [expandedDate, setExpandedDate] = useState<string>("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("")
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)
  const [showMoreSlots, setShowMoreSlots] = useState<Record<string, boolean>>({})

  const filteredConsultationReasons = useMemo(() => consultationReasons, [])

  const getCurrentStep = () => {
    if (isConfirmed) return 4
    if (selectedTimeSlot) return 4
    if (consultationReason) return 3
    if (consultationMode) return 2
    if (hasConsultedBefore !== null) return 1
    return 0
  }

  const progress = (getCurrentStep() / 4) * 100

  const handleToggleMoreSlots = (dateValue: string) => {
    setShowMoreSlots(prev => ({
      ...prev,
      [dateValue]: !prev[dateValue],
    }))
  }

  const handleToggleDate = (date: string) => {
    setExpandedDate(expandedDate === date ? "" : date)
  }

  const handleSelectTimeSlot = (date: string, time: string) => {
    setSelectedTimeSlot(`${date}-${time}`)
  }

  const handleConfirmAppointment = () => {
    setIsConfirmed(true)
  }

  const formatSelectedDate = (): string => {
    const fullDate = selectedTimeSlot.split("-").slice(0, 3).join("-")
    const dateObj = availableDates.find((d) => d.value === fullDate)
    return dateObj ? dateObj.label : fullDate
  }

  const formatSelectedTime = (): string => {
    return selectedTimeSlot.split("-").slice(-1)[0] || ""
  }

  const getSelectedReasonName = (): string => {
    const reason = consultationReasons.find((r) => r.id === consultationReason)
    return reason ? reason.name : ""
  }

  const handleDownloadConfirmation = () => {
    console.log("Downloading confirmation...")
  }

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <Card className="text-center">
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                Rendez-vous confirmé !
              </h2>
              <p className="text-muted-foreground mb-6">
                Votre rendez-vous avec {doctorName} a été réservé avec succès
              </p>

              <div className="bg-accent/50 rounded-xl p-6 mb-6 text-left">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{formatSelectedDate()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Heure:</span>
                    <span className="font-medium">{formatSelectedTime()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {consultationMode === "video" ? 
                      <Video className="w-4 h-4 text-muted-foreground" /> : 
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                    }
                    <span className="text-muted-foreground">Mode:</span>
                    <span className="font-medium">
                      {consultationMode === "video" ? "Téléconsultation" : "Au cabinet"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Motif:</span>
                    <span className="font-medium text-sm">{getSelectedReasonName()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleDownloadConfirmation}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
                <Button onClick={onClose}>
                  Fermer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Prendre rendez-vous
            </h1>
            <p className="text-lg text-muted-foreground">avec {doctorName}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Étape {getCurrentStep()} sur 4</span>
              <span>{Math.round(progress)}% terminé</span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Step 1: Previous Consultation */}
        <StepCard
          stepNumber={1}
          title="Avez-vous déjà consulté ce médecin ?"
          isActive={hasConsultedBefore === null}
          isCompleted={hasConsultedBefore !== null}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OptionCard
              checked={hasConsultedBefore === true}
              onChange={() => setHasConsultedBefore(true)}
              icon={<User className="w-5 h-5 text-blue-600" />}
              title="Oui, je suis patient"
              description="Vous avez déjà consulté ce médecin"
            />
            <OptionCard
              checked={hasConsultedBefore === false}
              onChange={() => setHasConsultedBefore(false)}
              icon={<User className="w-5 h-5 text-green-600" />}
              title="Non, nouveau patient"
              description="Première consultation avec ce médecin"
            />
          </div>
        </StepCard>

        {/* Step 2: Consultation Mode */}
        {hasConsultedBefore !== null && (
          <StepCard
            stepNumber={2}
            title="Comment souhaitez-vous consulter ?"
            isActive={!consultationMode}
            isCompleted={!!consultationMode}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OptionCard
                checked={consultationMode === "video"}
                onChange={() => setConsultationMode("video")}
                icon={<Video className="w-5 h-5 text-blue-600" />}
                title="Téléconsultation"
                description="Consultation à distance par vidéo"
              />
              <OptionCard
                checked={consultationMode === "cabinet"}
                onChange={() => setConsultationMode("cabinet")}
                icon={<Building2 className="w-5 h-5 text-orange-600" />}
                title="Au cabinet"
                description="Consultation physique au cabinet"
              />
            </div>
          </StepCard>
        )}

        {/* Step 3: Consultation Reason */}
        {consultationMode && (
          <StepCard
            stepNumber={3}
            title="Quel est le motif de votre consultation ?"
            isActive={!consultationReason}
            isCompleted={!!consultationReason}
          >
            <div className="space-y-3">
              {filteredConsultationReasons.map((reason) => (
                <OptionCard
                  key={reason.id}
                  checked={consultationReason === reason.id}
                  onChange={() => setConsultationReason(reason.id)}
                  disabled={!reason.availableForNewPatients && !hasConsultedBefore}
                  icon={<FileText className="w-5 h-5 text-purple-600" />}
                  title={reason.name}
                  badge={!reason.availableForNewPatients && !hasConsultedBefore ? "Patients existants" : undefined}
                />
              ))}
            </div>
          </StepCard>
        )}

        {/* Step 4: Date and Time Selection */}
        {consultationReason && (
          <StepCard
            stepNumber={4}
            title="Choisissez votre créneau"
            isActive={!selectedTimeSlot}
            isCompleted={!!selectedTimeSlot}
          >
            <div className="space-y-4">
              {availableDates.map((date) => (
                <Card key={date.value} className="overflow-hidden">
                  <Button
                    variant="ghost"
                    onClick={() => handleToggleDate(date.value)}
                    className="w-full p-4 flex items-center justify-between hover:bg-accent/50"
                  >
                    <div className="text-left">
                      <div className="font-semibold text-foreground">{date.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {date.slotsCount} créneaux disponibles
                      </div>
                    </div>
                    {expandedDate === date.value ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>

                  {expandedDate === date.value && (
                    <div className="p-4 border-t bg-accent/20">
                      <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {date.slots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTimeSlot === `${date.value}-${time}` ? "default" : "outline"}
                            onClick={() => handleSelectTimeSlot(date.value, time)}
                            className="text-sm font-medium"
                          >
                            {time}
                          </Button>
                        ))}
                      </div>

                      {showMoreSlots[date.value] && date.moreSlots.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                          {date.moreSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTimeSlot === `${date.value}-${time}` ? "default" : "outline"}
                              onClick={() => handleSelectTimeSlot(date.value, time)}
                              className="text-sm font-medium"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      )}

                      {date.hasMore && (
                        <Button
                          variant="ghost"
                          onClick={() => handleToggleMoreSlots(date.value)}
                          className="text-primary hover:text-primary/80"
                        >
                          {showMoreSlots[date.value]
                            ? "Voir moins de créneaux"
                            : "Voir plus de créneaux"
                          }
                        </Button>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </StepCard>
        )}

        {/* Confirmation Button */}
        {selectedTimeSlot && !isConfirmed && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <Button
                onClick={handleConfirmAppointment}
                size="lg"
                className="w-full max-w-md"
              >
                <Check className="w-5 h-5 mr-2" />
                Confirmer le rendez-vous
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
