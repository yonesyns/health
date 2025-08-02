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
  CheckCircle2,
  Stethoscope
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AppointmentService, CreateAppointmentRequest } from "@/services/appointmentService"

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
    <Card className={`transition-all duration-300 ${
      isActive ? 'border-blue-200 shadow-lg' : 'border-gray-200 shadow-sm'
    }`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
            isCompleted ? 'bg-green-100 text-green-700' : 
            isActive ? 'bg-blue-600 text-white' : 
            'bg-gray-100 text-gray-500'
          }`}>
            {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">
              {isCompleted ? 'Terminé' : isActive ? 'En cours' : 'En attente'}
            </p>
          </div>
        </div>
        {(isActive || isCompleted) && children}
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
      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed bg-gray-50 border-gray-200' :
        checked ? 'border-blue-600 bg-blue-50 shadow-sm' : 
        'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
          checked ? 'border-blue-600 bg-blue-600' : 'border-gray-300'
        }`}>
          {checked && <div className="w-2 h-2 bg-white rounded-full" />}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {icon && <div className="text-gray-600">{icon}</div>}
            <span className="font-medium text-gray-900">{title}</span>
            {badge && (
              <Badge variant="secondary" className="text-xs">
                {badge}
              </Badge>
            )}
          </div>
          {description && (
            <p className="text-sm text-gray-600">{description}</p>
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

  const handleConfirmAppointment = async () => {
    try {
      // Préparer les données pour l'API
      const [date, time] = selectedTimeSlot.split("-")
      const scheduledDate = new Date(`${date}T${time}:00`)
      
      const appointmentData: CreateAppointmentRequest = {
        date: scheduledDate.toISOString(),
        patientId: "1", // TODO: Récupérer l'ID du patient connecté
        doctorId: "1", // TODO: Récupérer l'ID du médecin sélectionné
        notes: getSelectedReasonName(),
        visitType: consultationMode === "video" ? "teleconsultation" : "in_person",
        hasConsultedBefore: hasConsultedBefore || false,
      }

      // Appeler l'API pour créer le rendez-vous
      const response = await AppointmentService.createAppointment(appointmentData)
      
      if (response.success) {
        setIsConfirmed(true)
      } else {
        throw new Error("Erreur lors de la création du rendez-vous")
      }
    } catch (error) {
      console.error("Erreur lors de la création du rendez-vous:", error)
      // TODO: Afficher un message d'erreur à l'utilisateur
      alert("Erreur lors de la création du rendez-vous. Veuillez réessayer.")
    }
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
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mb-6 text-gray-600 hover:text-gray-900 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <Card className="text-center border-gray-200 shadow-lg">
            <CardContent className="p-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Rendez-vous confirmé !
              </h2>
              <p className="text-gray-600 mb-8">
                Votre rendez-vous avec {doctorName} a été réservé avec succès
              </p>

              <div className="bg-white rounded-lg p-6 mb-8 text-left border border-gray-200 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Détails du rendez-vous</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">{formatSelectedDate()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Heure:</span>
                    <span className="font-medium text-gray-900">{formatSelectedTime()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">Médecin:</span>
                    <span className="font-medium text-gray-900">{doctorName}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {consultationMode === "video" ? 
                      <Video className="w-5 h-5 text-gray-400" /> : 
                      <Building2 className="w-5 h-5 text-gray-400" />
                    }
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900">
                      {consultationMode === "video" ? "Téléconsultation" : "Consultation au cabinet"}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                    <span className="text-gray-600">Motif:</span>
                    <span className="font-medium text-gray-900">{getSelectedReasonName()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-center">
                <Button variant="outline" onClick={handleDownloadConfirmation}>
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger la confirmation
                </Button>
                <Button onClick={onClose} className="bg-blue-600 hover:bg-blue-700 text-white">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto p-6">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mb-4 text-gray-600 hover:text-gray-900 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Prendre rendez-vous
              </h1>
              <p className="text-gray-600">avec {doctorName}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Étape {getCurrentStep()} sur 4</span>
              <span>{Math.round(progress)}% terminé</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                style={{ width: `${progress}%` }}
              />
            </div>
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
              title="Oui, je suis patient"
              description="Vous avez déjà consulté ce médecin"
            />
            <OptionCard
              checked={hasConsultedBefore === false}
              onChange={() => setHasConsultedBefore(false)}
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
                title="Téléconsultation"
                description="Consultation à distance par vidéo"
              />
              <OptionCard
                checked={consultationMode === "cabinet"}
                onChange={() => setConsultationMode("cabinet")}
                title="Au cabinet"
                description="Consultation physique au cabinet médical"
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
                  title={reason.name}
                  badge={!reason.availableForNewPatients && !hasConsultedBefore ? "Patients existants uniquement" : undefined}
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
            <div className="space-y-3">
              {availableDates.map((date) => (
                <Card key={date.value} className="border-gray-200 overflow-hidden">
                  <Button
                    variant="ghost"
                    onClick={() => handleToggleDate(date.value)}
                    className="w-full p-4 flex items-center justify-between hover:bg-gray-50 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium text-gray-900">{date.label}</div>
                      </div>
                    </div>
                    {expandedDate === date.value ? (
                      <ChevronUp className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    )}
                  </Button>

                  {expandedDate === date.value && (
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                        {date.slots.map((time) => (
                          <Button
                            key={time}
                            variant={selectedTimeSlot === `${date.value}-${time}` ? "default" : "outline"}
                            onClick={() => handleSelectTimeSlot(date.value, time)}
                            className={`text-sm ${
                              selectedTimeSlot === `${date.value}-${time}` 
                                ? "bg-blue-600 text-white hover:bg-blue-700" 
                                : "border-gray-300 text-gray-700 hover:bg-white hover:border-blue-300"
                            }`}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>

                      {showMoreSlots[date.value] && date.moreSlots.length > 0 && (
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-4">
                          {date.moreSlots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTimeSlot === `${date.value}-${time}` ? "default" : "outline"}
                              onClick={() => handleSelectTimeSlot(date.value, time)}
                              className={`text-sm ${
                                selectedTimeSlot === `${date.value}-${time}` 
                                  ? "bg-blue-600 text-white hover:bg-blue-700" 
                                  : "border-gray-300 text-gray-700 hover:bg-white hover:border-blue-300"
                              }`}
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
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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

        {/* Confirmation Section */}
        {selectedTimeSlot && !isConfirmed && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Récapitulatif de votre rendez-vous
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Date:</strong> {formatSelectedDate()}</p>
                    <p><strong>Heure:</strong> {formatSelectedTime()}</p>
                    <p><strong>Type:</strong> {consultationMode === "video" ? "Téléconsultation" : "Au cabinet"}</p>
                    <p><strong>Motif:</strong> {getSelectedReasonName()}</p>
                  </div>
                </div>
                <Button
                  onClick={handleConfirmAppointment}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check className="w-5 h-5 mr-2" />
                  Confirmer le rendez-vous
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}