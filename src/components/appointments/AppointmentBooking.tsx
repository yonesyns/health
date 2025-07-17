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
  MapPin
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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

// Clean, minimal RadioOption component
const RadioOption: React.FC<{
  checked: boolean
  onChange: () => void
  children: React.ReactNode
  disabled?: boolean
}> = ({ checked, onChange, children, disabled = false }) => {
  return (
    <label className={`block cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}>
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`p-4 border rounded-lg transition-all duration-200 ${checked
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-blue-300 hover:bg-gray-50"
          } ${disabled ? "hover:border-gray-200 hover:bg-white" : ""}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${checked
              ? "border-blue-500 bg-blue-500"
              : "border-gray-300"
              }`}
          >
            {checked && <div className="w-2 h-2 bg-white rounded-full" />}
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </div>
    </label>
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

  // Calculate progress
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

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={onGoBack}
            className="mb-3 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="mb-4">
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Prendre rendez-vous
            </h1>
            <p className="text-gray-600">avec {doctorName}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Étape {getCurrentStep()} sur 4</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content - FIXED SPACING */}
      <div className="max-w-2xl mx-auto px-6 py-4 space-y-4">
        {/* Section 1: Previous Consultation */}
        <Card className="mb-4">
          <CardHeader className="pb-2">
            <h2 className="text-xl font-semibold">
              Avez-vous déjà consulté {doctorName} ?
            </h2>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <RadioOption
                checked={hasConsultedBefore === true}
                onChange={() => setHasConsultedBefore(true)}
              >
                <div>
                  <div className="font-medium text-gray-900">Oui</div>
                  <div className="text-sm text-gray-600">Patient existant</div>
                </div>
              </RadioOption>

              <RadioOption
                checked={hasConsultedBefore === false}
                onChange={() => setHasConsultedBefore(false)}
              >
                <div>
                  <div className="font-medium text-gray-900">Non</div>
                  <div className="text-sm text-gray-600">Nouveau patient</div>
                </div>
              </RadioOption>
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Consultation Mode */}
        {hasConsultedBefore !== null && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Mode de consultation</h2>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <RadioOption
                  checked={consultationMode === "video"}
                  onChange={() => setConsultationMode("video")}
                >
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Téléconsultation</div>
                      <div className="text-sm text-gray-600">Consultation à distance</div>
                    </div>
                  </div>
                </RadioOption>

                <RadioOption
                  checked={consultationMode === "cabinet"}
                  onChange={() => setConsultationMode("cabinet")}
                >
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-gray-900">Au cabinet</div>
                      <div className="text-sm text-gray-600">Consultation physique</div>
                    </div>
                  </div>
                </RadioOption>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 3: Consultation Reason */}
        {consultationMode && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Motif de consultation</h2>
              <p className="text-sm text-gray-600 mt-1">
                Sélectionnez le motif de votre visite
              </p>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                {filteredConsultationReasons.map((reason) => (
                  <RadioOption
                    key={reason.id}
                    checked={consultationReason === reason.id}
                    onChange={() => setConsultationReason(reason.id)}
                    disabled={!reason.availableForNewPatients && !hasConsultedBefore}
                  >
                    <div>
                      <div className={`font-medium ${!reason.availableForNewPatients && !hasConsultedBefore
                        ? "text-gray-400"
                        : "text-gray-900"
                        }`}>
                        {reason.name}
                      </div>
                      {!reason.availableForNewPatients && !hasConsultedBefore && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          Patients existants uniquement
                        </Badge>
                      )}
                    </div>
                  </RadioOption>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Section 4: Date and Time Selection - FIXED */}
        {consultationReason && (
          <Card className="mb-4">
            <CardHeader className="pb-2">
              <h2 className="text-xl font-semibold">Date et horaire</h2>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-2">
                {availableDates.map((date) => (
                  <div key={date.value} className="border rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      onClick={() => handleToggleDate(date.value)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 h-auto"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{date.label}</div>
                        <div className="text-sm text-gray-600">
                          {date.slotsCount} créneaux disponibles
                        </div>
                      </div>
                      {expandedDate === date.value ? (
                        <ChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </Button>

                    {expandedDate === date.value && (
                      <div className="p-3 border-t bg-gray-50">
                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                          {date.slots.map((time) => (
                            <Button
                              key={time}
                              variant={selectedTimeSlot === `${date.value}-${time}` ? "default" : "outline"}
                              onClick={() => handleSelectTimeSlot(date.value, time)}
                              className="text-sm"
                              size="sm"
                            >
                              {time}
                            </Button>
                          ))}
                        </div>

                        {showMoreSlots[date.value] && date.moreSlots.length > 0 && (
                          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-3">
                            {date.moreSlots.map((time) => (
                              <Button
                                key={time}
                                variant={selectedTimeSlot === `${date.value}-${time}` ? "default" : "outline"}
                                onClick={() => handleSelectTimeSlot(date.value, time)}
                                className="text-sm"
                                size="sm"
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
                            className="text-blue-600 text-sm p-0 h-auto mt-3"
                          >
                            {showMoreSlots[date.value]
                              ? "Voir moins"
                              : "Voir plus de créneaux"
                            }
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Confirmation Button */}
        {selectedTimeSlot && !isConfirmed && (
          <Card className="mb-4">
            <CardContent className="p-4 text-center">
              <Button
                onClick={handleConfirmAppointment}
                size="lg"
                className="w-full"
              >
                Confirmer le rendez-vous
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Success State */}
        {isConfirmed && (
          <Card>
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Check className="w-6 h-6 text-green-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Rendez-vous confirmé !
              </h2>
              <p className="text-gray-600 mb-4 text-sm">
                Votre rendez-vous avec {doctorName} a été réservé
              </p>

              <div className="bg-gray-50 rounded-lg p-3 mb-4 text-left">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date :</span>
                    <span className="font-medium">{formatSelectedDate()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Heure :</span>
                    <span className="font-medium">{formatSelectedTime()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mode :</span>
                    <span className="font-medium">
                      {consultationMode === "video" ? "Téléconsultation" : "Au cabinet"}
                    </span>
                  </div>
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600">Motif :</span>
                    <span className="font-medium text-right text-xs leading-tight max-w-[200px]">
                      {getSelectedReasonName()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <Button
                  variant="outline"
                  onClick={handleDownloadConfirmation}
                  size="sm"
                  className="text-xs"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Télécharger
                </Button>
                <Button onClick={onClose} size="sm" className="text-xs">
                  Fermer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}