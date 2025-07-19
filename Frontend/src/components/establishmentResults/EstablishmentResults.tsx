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
  Grid3X3,
  List,
  Stethoscope,
  Star,
  Calendar,
  Users,
  Video,
  Filter,
  X,
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
  const [showMobileFilters, setShowMobileFilters] = useState(false)
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

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        {selectedSpecialtyFilter && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSelectedSpecialtyFilter("")}
            className="text-gray-500 hover:text-gray-700"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Spécialités</h4>
        <div className="space-y-1">
          <Button
            variant={selectedSpecialtyFilter === "" ? "default" : "ghost"}
            onClick={() => setSelectedSpecialtyFilter("")}
            size="sm"
            className={`w-full justify-start text-left font-normal ${
              selectedSpecialtyFilter === "" 
                ? "bg-blue-600 hover:bg-blue-900 text-white" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            Toutes les spécialités
          </Button>
          {uniqueSpecialties.map((specialty) => (
            <Button
              key={specialty}
              variant={selectedSpecialtyFilter === specialty ? "default" : "ghost"}
              onClick={() => setSelectedSpecialtyFilter(specialty)}
              size="sm"
              className={`w-full justify-start text-left font-normal ${
                selectedSpecialtyFilter === specialty 
                  ? "bg-gray-900 text-white hover:bg-gray-800" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Statistiques</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{filteredDoctors.length}</div>
            <div className="text-xs text-gray-600">Médecins</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{uniqueSpecialties.length}</div>
            <div className="text-xs text-gray-600">Spécialités</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{newPatientsCount}</div>
            <div className="text-xs text-gray-600">Nouveaux patients</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-2xl font-bold text-gray-900">{teleconsultationCount}</div>
            <div className="text-xs text-gray-600">Téléconsultation</div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <Button 
              variant="ghost" 
              onClick={onGoBack} 
              className="mb-6 text-gray-600 hover:text-gray-900 p-0 h-auto"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la recherche
            </Button>

            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{establishment.name}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span>{establishment.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                      {establishment.specialistCount} spécialistes
                    </Badge>
                    <Badge variant="secondary" className="bg-gray-100 text-gray-700 border-gray-200">
                      {doctors.length} médecins
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <CheckCircle className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Conventionné</h3>
                <p className="text-xs text-gray-600">Secteur 1 et 2</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Clock className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Ouvert 7j/7</h3>
                <p className="text-xs text-gray-600">8h00 - 20h00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <Car className="w-5 h-5 text-gray-600" />
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Parking gratuit</h3>
                <p className="text-xs text-gray-600">Accès PMR</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-8">
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="p-6">
                  <FilterContent />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mobile Filter Dialog */}
          <Dialog open={showMobileFilters} onOpenChange={setShowMobileFilters}>
            <DialogContent className="max-w-sm">
              <DialogHeader>
                <DialogTitle>Filtres</DialogTitle>
              </DialogHeader>
              <FilterContent />
            </DialogContent>
          </Dialog>

          {/* Results */}
          <div className="lg:min-h-0">
            {filteredDoctors.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
                <UserX className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun médecin trouvé</h3>
                <p className="text-gray-600">Aucun médecin ne correspond à votre recherche dans cet établissement</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Controls */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-900">
                        {filteredDoctors.length} {filteredDoctors.length > 1 ? "médecins" : "médecin"}
                        {selectedSpecialtyFilter && <span className="text-gray-600"> en {selectedSpecialtyFilter}</span>}
                      </span>
                      {selectedSpecialtyFilter && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedSpecialtyFilter("")}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <X className="w-4 h-4 mr-1" />
                          Effacer
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMobileFilters(true)}
                        className="lg:hidden"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Filtres
                      </Button>
                      <div className="flex rounded-lg border border-gray-200 p-1">
                        <Button
                          variant={viewMode === "grouped" ? "default" : "ghost"}
                          onClick={() => setViewMode("grouped")}
                          size="sm"
                          className={`${viewMode === "grouped" ? "bg-gray-900 text-white" : "text-gray-600"}`}
                        >
                          <Grid3X3 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === "list" ? "default" : "ghost"}
                          onClick={() => setViewMode("list")}
                          size="sm"
                          className={`${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-600"}`}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Grouped View */}
                {viewMode === "grouped" ? (
                  <div className="space-y-6">
                    {Object.entries(groupedDoctors).map(([specialty, doctorGroup]) => (
                      <div key={specialty} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                              <Stethoscope className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{specialty}</h3>
                              <span className="text-sm text-gray-600">
                                {doctorGroup.length} {doctorGroup.length > 1 ? "médecins" : "médecin"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {doctorGroup.map((doctor) => (
                              <Card
                                key={doctor.id}
                                className="border-gray-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => onSelectDoctor(doctor.id)}
                              >
                                <CardContent className="p-4">
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <Avatar className="h-10 w-10">
                                        <AvatarImage src={doctor.image} alt={doctor.name} />
                                        <AvatarFallback className="bg-gray-100 text-gray-700 text-sm">
                                          {doctor.name.split(" ").map((n) => n[0]).join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-gray-900 text-sm truncate">{doctor.name}</h4>
                                        <p className="text-xs text-gray-600">{doctor.specialty}</p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                        <span className="text-xs font-medium text-gray-900">{doctor.rating}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-1 flex-wrap">
                                      {doctor.acceptsNewPatients && (
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                                          Nouveaux patients
                                        </Badge>
                                      )}
                                      {doctor.teleconsultation && (
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
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
                                        className="flex-1 bg-blue-600 hover:bg-blue-900 text-white"
                                      >
                                        <Calendar className="w-3 h-3 mr-1" />
                                        RDV
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          onSelectDoctor(doctor.id)
                                        }}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                      >
                                        Profil
                                      </Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="space-y-3">
                    {filteredDoctors.map((doctor) => (
                      <Card key={doctor.id} className="border-gray-200 hover:shadow-md transition-all duration-200">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="flex items-center gap-4 flex-1">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={doctor.image} alt={doctor.name} />
                                <AvatarFallback className="bg-gray-100 text-gray-700">
                                  {doctor.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <h4
                                  className="font-semibold text-gray-900 cursor-pointer hover:text-gray-700 mb-1"
                                  onClick={() => onSelectDoctor(doctor.id)}
                                >
                                  {doctor.name}
                                </h4>
                                <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
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
                            <div className="flex items-center gap-3">
                              <div className="flex gap-2 flex-wrap">
                                {doctor.acceptsNewPatients && (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                    Nouveaux patients
                                  </Badge>
                                )}
                                {doctor.teleconsultation && (
                                  <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                                    Téléconsultation
                                  </Badge>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  onClick={() => openAppointmentModal(doctor)}
                                  className="bg-gray-900 hover:bg-gray-800 text-white"
                                >
                                  <Calendar className="w-4 h-4 mr-2" />
                                  Rendez-vous
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => onSelectDoctor(doctor.id)}
                                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  Profil
                                </Button>
                              </div>
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
                  <AvatarImage src={appointmentModal.doctor.image} alt={appointmentModal.doctor.name} />
                  <AvatarFallback className="bg-gray-100 text-gray-700">
                    {appointmentModal.doctor.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">{appointmentModal.doctor.name}</h3>
                  <p className="text-gray-600">{appointmentModal.doctor.specialty}</p>
                  <p className="text-sm text-gray-500">{establishment.name}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button 
                  onClick={openFullBooking} 
                  size="lg" 
                  className="w-full bg-gray-900 hover:bg-gray-800 text-white"
                >
                  Prendre rendez-vous
                </Button>
                {appointmentModal.doctor.teleconsultation && (
                  <Button 
                    variant="outline" 
                    size="lg" 
                    onClick={openVideoBooking} 
                    className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
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