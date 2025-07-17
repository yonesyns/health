"use client"

import { useState, useMemo, useCallback } from "react"
import {
  ArrowLeft,
  Building2,
  MapPin,
  CheckCircle,
  Clock,
  Car,
  UserX,
  Layers,
  List,
  Stethoscope,
  Star,
  Calendar,
  Users,
  Video,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock doctors data for establishment
const mockEstablishmentDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologie",
    image: "/placeholder.svg?height=48&width=48",
    rating: 4.8,
    reviewCount: 234,
    acceptsNewPatients: true,
    teleconsultation: true,
  },
  {
    id: 2,
    name: "Dr. Ahmed Ben Ali",
    specialty: "Dermatologie",
    image: "/placeholder.svg?height=48&width=48",
    rating: 4.9,
    reviewCount: 156,
    acceptsNewPatients: true,
    teleconsultation: false,
  },
  {
    id: 3,
    name: "Dr. Marie Dubois",
    specialty: "Cardiologie",
    image: "/placeholder.svg?height=48&width=48",
    rating: 4.7,
    reviewCount: 89,
    acceptsNewPatients: false,
    teleconsultation: true,
  },
  {
    id: 4,
    name: "Dr. Hassan Alami",
    specialty: "Neurologie",
    image: "/placeholder.svg?height=48&width=48",
    rating: 4.6,
    reviewCount: 203,
    acceptsNewPatients: true,
    teleconsultation: false,
  },
  {
    id: 5,
    name: "Dr. Fatima Zahra",
    specialty: "Pédiatrie",
    image: "/placeholder.svg?height=48&width=48",
    rating: 4.9,
    reviewCount: 178,
    acceptsNewPatients: true,
    teleconsultation: true,
  },
  {
    id: 6,
    name: "Dr. Omar Benali",
    specialty: "Orthopédie",
    image: "/placeholder.svg?height=48&width=48",
    rating: 4.5,
    reviewCount: 145,
    acceptsNewPatients: true,
    teleconsultation: false,
  },
]

interface EstablishmentResultsProps {
  establishment: {
    name: string
    location: string
    specialistCount: number
  }
  onGoBack: () => void
  onSelectDoctor: (doctorId: number, doctorName?: string, mode?: string) => void
}

interface Doctor {
  id: number
  name: string
  specialty: string
  image: string
  rating: number
  reviewCount: number
  acceptsNewPatients: boolean
  teleconsultation: boolean
}

export function EstablishmentResults({ establishment, onGoBack, onSelectDoctor }: EstablishmentResultsProps) {
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState("")
  const [viewMode, setViewMode] = useState<"grouped" | "list">("grouped")
  const [appointmentModal, setAppointmentModal] = useState<{
    show: boolean
    doctor: Doctor | null
  }>({
    show: false,
    doctor: null,
  })

  const doctors = mockEstablishmentDoctors

  const uniqueSpecialties = useMemo(() => {
    const specialties = [...new Set(doctors.map((doctor) => doctor.specialty))]
    return specialties.sort()
  }, [doctors])

  const filteredDoctors = useMemo(() => {
    if (!selectedSpecialtyFilter) {
      return doctors
    }
    return doctors.filter((doctor) => doctor.specialty === selectedSpecialtyFilter)
  }, [selectedSpecialtyFilter, doctors])

  const groupedDoctors = useMemo(() => {
    const grouped: Record<string, Doctor[]> = {}
    filteredDoctors.forEach((doctor) => {
      if (!grouped[doctor.specialty]) {
        grouped[doctor.specialty] = []
      }
      grouped[doctor.specialty].push(doctor)
    })
    // Sort doctors within each specialty by rating
    Object.keys(grouped).forEach((specialty) => {
      grouped[specialty].sort((a, b) => (b.rating || 0) - (a.rating || 0))
    })
    return grouped
  }, [filteredDoctors])

  const newPatientsCount = useMemo(() => {
    return filteredDoctors.filter((doctor) => doctor.acceptsNewPatients).length
  }, [filteredDoctors])

  const teleconsultationCount = useMemo(() => {
    return filteredDoctors.filter((doctor) => doctor.teleconsultation).length
  }, [filteredDoctors])

  const openAppointmentModal = useCallback(
    (doctor: Doctor) => {
      // Instead of showing modal, go directly to booking
      onSelectDoctor(doctor.id, doctor.name, "booking")
    },
    [onSelectDoctor],
  )

  const openFullBooking = useCallback(() => {
    if (appointmentModal.doctor) {
      setAppointmentModal({ show: false, doctor: null })
      onSelectDoctor(appointmentModal.doctor.id, appointmentModal.doctor.name, "booking")
    }
  }, [appointmentModal.doctor, onSelectDoctor])

  const openVideoBooking = useCallback(() => {
    setAppointmentModal({ show: false, doctor: null })
    console.log("Opening video consultation for:", appointmentModal.doctor?.name)
  }, [appointmentModal.doctor])

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <Button variant="ghost" onClick={onGoBack} className="mb-6 text-blue-600 p-0">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la recherche
          </Button>

          {/* Establishment Header */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">{establishment.name}</h1>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{establishment.location}</span>
                  </div>
                  <div className="flex gap-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 border-blue-200">
                      {establishment.specialistCount} spécialistes
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                      {doctors.length} médecins disponibles
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Établissement conventionné</h3>
                <p className="text-sm text-gray-600">Secteur 1 et 2</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Ouvert 7j/7</h3>
                <p className="text-sm text-gray-600">8h00 - 20h00</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Parking gratuit</h3>
                <p className="text-sm text-gray-600">Accès PMR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar with Filters */}
        <div className="lg:sticky lg:top-8">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filtres</h3>
                {selectedSpecialtyFilter && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSpecialtyFilter("")}>
                    Effacer
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Specialty Filter */}
              <div>
                <h4 className="font-semibold mb-3">Spécialités</h4>
                <div className="space-y-2">
                  <Button
                    variant={selectedSpecialtyFilter === "" ? "default" : "outline"}
                    onClick={() => setSelectedSpecialtyFilter("")}
                    size="sm"
                    className="w-full justify-start"
                  >
                    Toutes les spécialités
                  </Button>
                  {uniqueSpecialties.map((specialty) => (
                    <Button
                      key={specialty}
                      variant={selectedSpecialtyFilter === specialty ? "default" : "outline"}
                      onClick={() => setSelectedSpecialtyFilter(specialty)}
                      size="sm"
                      className="w-full justify-start"
                    >
                      {specialty}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div>
                <h4 className="font-semibold mb-3">Statistiques</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{filteredDoctors.length}</div>
                    <div className="text-xs text-gray-600">Médecins</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{uniqueSpecialties.length}</div>
                    <div className="text-xs text-gray-600">Spécialités</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{newPatientsCount}</div>
                    <div className="text-xs text-gray-600">Nouveaux patients</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">{teleconsultationCount}</div>
                    <div className="text-xs text-gray-600">Téléconsultation</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Area */}
        <div className="min-h-[600px]">
          {filteredDoctors.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <UserX className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun médecin trouvé</h3>
              <p className="text-gray-500 mb-4">Aucun médecin ne correspond à votre recherche dans cet établissement</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* View Controls */}
              <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-gray-200">
                <div>
                  <span className="text-lg font-semibold text-gray-900">
                    {filteredDoctors.length} {filteredDoctors.length > 1 ? "médecins" : "médecin"}
                    {selectedSpecialtyFilter && <span> en {selectedSpecialtyFilter}</span>}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={viewMode === "grouped" ? "default" : "outline"}
                    onClick={() => setViewMode("grouped")}
                    size="sm"
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Par spécialité
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    onClick={() => setViewMode("list")}
                    size="sm"
                  >
                    <List className="mr-2 h-4 w-4" />
                    Liste
                  </Button>
                </div>
              </div>

              {/* Grouped View */}
              {viewMode === "grouped" ? (
                <div className="space-y-8">
                  {Object.entries(groupedDoctors).map(([specialty, doctorGroup]) => (
                    <div key={specialty} className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                            <Stethoscope className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{specialty}</h3>
                            <span className="text-sm text-gray-600">
                              {doctorGroup.length} {doctorGroup.length > 1 ? "médecins" : "médecin"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
                        {doctorGroup.map((doctor) => (
                          <Card
                            key={doctor.id}
                            className="hover:shadow-md transition-all duration-200 cursor-pointer border-0 shadow-sm"
                            onClick={() => onSelectDoctor(doctor.id)}
                          >
                            <CardContent className="p-6">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-12 w-12 border-2 border-gray-100">
                                    <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                                    <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                      {doctor.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900">{doctor.name}</h4>
                                    <p className="text-sm text-gray-600">{doctor.specialty}</p>
                                  </div>
                                  <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="text-sm font-medium">{doctor.rating}</span>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  {doctor.acceptsNewPatients && (
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">
                                      Nouveaux patients
                                    </Badge>
                                  )}
                                  {doctor.teleconsultation && (
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                                      Téléconsultation
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      openAppointmentModal(doctor)
                                    }}
                                    className="flex-1"
                                  >
                                    <Calendar className="mr-2 h-3 w-3" />
                                    Rendez-vous
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      onSelectDoctor(doctor.id)
                                    }}
                                  >
                                    Voir profil
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                // List View
                <div className="space-y-4">
                  {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="hover:shadow-md transition-all duration-200 border-0 shadow-sm">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_auto] gap-6 items-center">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-14 w-14 border-2 border-gray-100">
                              <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <h4
                                className="text-lg font-semibold text-blue-600 cursor-pointer hover:text-blue-700 mb-1"
                                onClick={() => onSelectDoctor(doctor.id)}
                              >
                                {doctor.name}
                              </h4>
                              <p className="text-gray-900 font-medium mb-2">{doctor.specialty}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>{doctor.rating}/5</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  <span>{doctor.reviewCount} avis</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {doctor.acceptsNewPatients && (
                              <Badge variant="secondary" className="bg-green-100 text-green-700">
                                Nouveaux patients
                              </Badge>
                            )}
                            {doctor.teleconsultation && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                                Téléconsultation
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-3">
                            <Button onClick={() => openAppointmentModal(doctor)}>
                              <Calendar className="mr-2 h-4 w-4" />
                              Prendre rendez-vous
                            </Button>
                            <Button variant="outline" onClick={() => onSelectDoctor(doctor.id)}>
                              Voir profil
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Modal */}
      <Dialog open={appointmentModal.show} onOpenChange={(open) => setAppointmentModal({ show: open, doctor: null })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Rendez-vous avec {appointmentModal.doctor?.name}</DialogTitle>
          </DialogHeader>
          {appointmentModal.doctor && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={appointmentModal.doctor.image || "/placeholder.svg"}
                    alt={appointmentModal.doctor.name}
                  />
                  <AvatarFallback>
                    {appointmentModal.doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{appointmentModal.doctor.name}</h3>
                  <p className="text-gray-600">{appointmentModal.doctor.specialty}</p>
                  <p className="text-sm text-purple-600 font-medium">{establishment.name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button onClick={openFullBooking} size="lg" className="w-full">
                  Prendre rendez-vous
                </Button>
                {appointmentModal.doctor.teleconsultation && (
                  <Button variant="outline" size="lg" onClick={openVideoBooking} className="w-full bg-transparent">
                    <Video className="mr-2 h-4 w-4" />
                    Consultation vidéo
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
