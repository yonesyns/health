"use client"

import { useState, useMemo, useCallback } from "react"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle,
  Star,
  ChevronLeft,
  ChevronRight,
  List,
  Grid,
  Video,
  Search,
  Clock,
  User,
  X,
  Filter,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock doctors data
const mockDoctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologue",
    image: "/placeholder.svg?height=64&width=64",
    location: "Clinique du Cœur, Tanger",
    rating: 4.8,
    reviewCount: 234,
    sector: 1,
    languages: ["fr", "en"],
    teleconsultation: true,
    availabilityType: "current_week",
  },
  {
    id: 2,
    name: "Dr. Ahmed Ben Ali",
    specialty: "Cardiologue",
    image: "/placeholder.svg?height=64&width=64",
    location: "Polyclinique Tanger",
    rating: 4.9,
    reviewCount: 156,
    sector: 1,
    languages: ["fr", "ar"],
    teleconsultation: false,
    availabilityType: "future_date",
  },
  {
    id: 3,
    name: "Dr. Marie Dubois",
    specialty: "Cardiologue",
    image: "/placeholder.svg?height=64&width=64",
    location: "Cabinet Médical Centre",
    rating: 4.7,
    reviewCount: 89,
    sector: 2,
    languages: ["fr"],
    teleconsultation: true,
    availabilityType: "existing_patients",
  },
  {
    id: 4,
    name: "Dr. Hassan Alami",
    specialty: "Cardiologue",
    image: "/placeholder.svg?height=64&width=64",
    location: "Clinique Internationale",
    rating: 4.6,
    reviewCount: 203,
    sector: 1,
    languages: ["fr", "ar", "en"],
    teleconsultation: false,
    availabilityType: "no_online",
  },
]

interface SpecialtyResultsProps {
  specialty: string
  location?: string
  onGoBack: () => void
  onSelectDoctor: (doctorId: number, doctorName?: string, mode?: string) => void
}

interface Doctor {
  id: number
  name: string
  specialty: string
  image: string
  location: string
  rating: number
  reviewCount: number
  sector: number
  languages: string[]
  teleconsultation: boolean
  availabilityType: string
}

interface Filters {
  languages: string[]
  sectors: string[]
}

export function SpecialtyResults({ specialty, location = "", onGoBack, onSelectDoctor }: SpecialtyResultsProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [quickFilter, setQuickFilter] = useState("")
  const [sortBy, setSortBy] = useState("availability")
  const [showAllSlots, setShowAllSlots] = useState<Record<number, boolean>>({})
  const [currentWeekOffset, setCurrentWeekOffset] = useState<Record<number, number>>({})
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    languages: [],
    sectors: [],
  })
  const [doctorAvailabilityOverrides, setDoctorAvailabilityOverrides] = useState<Record<number, string>>({})

  const sortOptions = [
    { label: "Disponibilité", value: "availability" },
    { label: "Nom", value: "name" },
    { label: "Note", value: "rating" },
    { label: "Distance", value: "distance" },
  ]

  const hasAvailableSlots = useCallback((doctor: Doctor, timeframe = "any") => {
    const availableIds = [1, 2, 5, 8]
    if (timeframe === "today") {
      return availableIds.includes(doctor.id) && doctor.id % 2 === 1
    } else if (timeframe === "week") {
      return availableIds.includes(doctor.id)
    }
    return availableIds.includes(doctor.id)
  }, [])

  const getAvailabilityStatus = useCallback(
    (doctor: Doctor) => {
      if (hasAvailableSlots(doctor, "today")) {
        return { type: "success" as const, text: "Aujourd'hui" }
      } else if (hasAvailableSlots(doctor, "week")) {
        return { type: "warning" as const, text: "Cette semaine" }
      } else if (doctor.teleconsultation) {
        return { type: "info" as const, text: "Téléconsultation" }
      } else {
        return { type: "default" as const, text: "Patients suivis" }
      }
    },
    [hasAvailableSlots],
  )

  const filteredDoctors = useMemo(() => {
    let filtered = [...mockDoctors]

    // Apply quick filter
    if (quickFilter === "today") {
      filtered = filtered.filter((doctor) => hasAvailableSlots(doctor, "today"))
    } else if (quickFilter === "week") {
      filtered = filtered.filter((doctor) => hasAvailableSlots(doctor, "week"))
    } else if (quickFilter === "video") {
      filtered = filtered.filter((doctor) => doctor.teleconsultation)
    }

    // Apply language filter
    if (filters.languages.length > 0) {
      filtered = filtered.filter(
        (doctor) => doctor.languages && doctor.languages.some((lang) => filters.languages.includes(lang)),
      )
    }

    // Apply sector filter
    if (filters.sectors.length > 0) {
      filtered = filtered.filter((doctor) => filters.sectors.includes(String(doctor.sector)))
    }

    // Apply sorting
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortBy === "availability") {
      filtered.sort((a, b) => {
        const aAvailable = hasAvailableSlots(a, "today") ? 2 : hasAvailableSlots(a, "week") ? 1 : 0
        const bAvailable = hasAvailableSlots(b, "today") ? 2 : hasAvailableSlots(b, "week") ? 1 : 0
        return bAvailable - aAvailable
      })
    }

    return filtered
  }, [quickFilter, filters, sortBy, hasAvailableSlots])

  const getAppointmentAvailability = useCallback(
    (doctor: Doctor) => {
      const overrideType = doctorAvailabilityOverrides[doctor.id]
      const effectiveType = overrideType || doctor.availabilityType

      switch (effectiveType) {
        case "current_week":
          return { type: "current_week" }
        case "future_date":
          return {
            type: "future_date",
            date: "27 août 2025",
            targetDate: new Date(2025, 7, 27),
          }
        case "existing_patients":
          return { type: "existing_patients" }
        case "no_online":
          return { type: "no_online" }
        default:
          return { type: "current_week" }
      }
    },
    [doctorAvailabilityOverrides],
  )

  const getWeekDays = useCallback(
    (doctorId: number) => {
      const today = new Date()
      const offset = currentWeekOffset[doctorId] || 0
      const days = []
      const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]

      const startDate = new Date(today)
      startDate.setDate(today.getDate() + (offset * 7))

      const availability = getAppointmentAvailability({ id: doctorId } as Doctor)
      if (doctorAvailabilityOverrides[doctorId] === "current_week" && availability.type === "future_date") {
        const targetDate = new Date(2025, 7, 27)
        const dayOfWeek = targetDate.getDay()
        const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
        startDate.setTime(targetDate.getTime())
        startDate.setDate(targetDate.getDate() + mondayOffset)
      }

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)
        days.push({
          key: i,
          name: dayNames[i],
          date: `${date.getDate()}/${date.getMonth() + 1}`,
          fullDate: date,
        })
      }
      return days
    },
    [currentWeekOffset, doctorAvailabilityOverrides, getAppointmentAvailability],
  )

  const getDaySlots = useCallback((doctor: Doctor, dayIndex: number, showAll = false) => {
    const overrideType = doctorAvailabilityOverrides[doctor.id]
    const effectiveType = overrideType || doctor.availabilityType

    if (effectiveType !== "current_week") {
      return ["—", "—", "—"]
    }

    if (doctorAvailabilityOverrides[doctor.id] === "current_week" && doctor.availabilityType === "future_date") {
      if (dayIndex === 2) {
        const slots = ["09:00", "09:30", "10:00", "10:30", "11:00", "14:00", "14:30", "15:00", "15:30", "16:00"]
        return showAll ? slots : slots.slice(0, 3)
      }
      return ["—", "—", "—"]
    }

    const availabilityPatterns: Record<number, string[]> = {
      0: ["08:30", "09:00", "14:30", "15:00", "15:30", "16:00"],
      1: ["09:00", "09:30", "15:00", "15:30", "16:00", "16:30"],
      2: ["08:30", "09:00", "14:00", "14:30", "15:00", "15:30"],
      3: ["09:00", "09:30", "15:30", "16:00", "16:30", "17:00"],
      4: ["08:30", "09:00", "14:30", "15:00", "15:30", "16:00"],
      5: ["09:00", "09:30"],
      6: ["—", "—", "—"],
    }

    const daySlots = availabilityPatterns[dayIndex] || ["—", "—", "—"]
    return showAll ? daySlots : daySlots.slice(0, 3)
  }, [doctorAvailabilityOverrides])

  const getNextSlots = useCallback((doctor: Doctor) => {
    return [
      { id: 1, time: "Aujourd'hui 14:30" },
      { id: 2, time: "Demain 09:00" },
      { id: 3, time: "Vendredi 10:30" },
    ].slice(0, 3)
  }, [])

  const getWeekRange = useCallback(
    (doctorId: number) => {
      const days = getWeekDays(doctorId)
      const start = days[0]
      const end = days[6]
      return `${start.date} - ${end.date}`
    },
    [getWeekDays],
  )

  const canShowMoreSlots = useCallback(
    (doctor: Doctor, dayIndex: number) => {
      const allSlots = getDaySlots(doctor, dayIndex, true)
      const visibleSlots = getDaySlots(doctor, dayIndex, false)
      return allSlots.length > visibleSlots.length && !allSlots.every(slot => slot === "—")
    },
    [getDaySlots],
  )

  const handleQuickFilter = (filter: string) => {
    setQuickFilter(quickFilter === filter ? "" : filter)
  }

  const clearFilters = () => {
    setQuickFilter("")
    setSortBy("availability")
    setFilters({ languages: [], sectors: [] })
  }

  const toggleDaySlots = (doctorId: number) => {
    setShowAllSlots((prev) => ({ ...prev, [doctorId]: !prev[doctorId] }))
  }

  const previousWeek = (doctorId: number) => {
    setCurrentWeekOffset((prev) => ({
      ...prev,
      [doctorId]: Math.max((prev[doctorId] || 0) - 1, 0),
    }))
  }

  const nextWeek = (doctorId: number) => {
    setCurrentWeekOffset((prev) => ({
      ...prev,
      [doctorId]: Math.min((prev[doctorId] || 0) + 1, 52),
    }))
  }

  const goToFutureDate = (doctor: Doctor) => {
    const availability = getAppointmentAvailability(doctor)
    if (availability.type === "future_date") {
      const today = new Date()
      const targetDate = new Date(2025, 7, 27)
      const currentWeekStart = new Date(today)
      currentWeekStart.setDate(today.getDate() - today.getDay() + 1)

      const targetWeekStart = new Date(targetDate)
      targetWeekStart.setDate(targetDate.getDate() - targetDate.getDay() + 1)

      const diffTime = targetWeekStart.getTime() - currentWeekStart.getTime()
      const diffWeeks = Math.round(diffTime / (1000 * 60 * 60 * 24 * 7))

      setCurrentWeekOffset((prev) => ({
        ...prev,
        [doctor.id]: diffWeeks,
      }))

      setDoctorAvailabilityOverrides((prev) => ({
        ...prev,
        [doctor.id]: "current_week",
      }))
    }
  }

  const bookSlot = (doctor: Doctor, slot: any) => {
    if (typeof slot === "string" && slot === "—") return
    console.log(`Booking slot for doctor ${doctor.name}`, slot)
    onSelectDoctor(doctor.id, doctor.name, "booking")
  }

  const handleLanguageFilter = (language: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      languages: checked ? [...prev.languages, language] : prev.languages.filter((lang) => lang !== language),
    }))
  }

  const handleSectorFilter = (sector: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      sectors: checked ? [...prev.sectors, sector] : prev.sectors.filter((s) => s !== sector),
    }))
  }

  const FilterContent = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filtres</h3>
        <Button variant="ghost" size="sm" onClick={clearFilters} className="text-gray-500 hover:text-gray-700">
          Réinitialiser
        </Button>
      </div>

      {/* Quick Filters */}
      <div>
        <h4 className="font-medium mb-3 text-gray-900">Disponibilité</h4>
        <div className="space-y-2">
          <Button
            variant={quickFilter === "today" ? "default" : "ghost"}
            onClick={() => handleQuickFilter("today")}
            size="sm"
            className={`w-full justify-start ${quickFilter === "today"
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Clock className="mr-2 h-4 w-4" />
            Aujourd'hui
          </Button>
          <Button
            variant={quickFilter === "week" ? "default" : "ghost"}
            onClick={() => handleQuickFilter("week")}
            size="sm"
            className={`w-full justify-start ${quickFilter === "week"
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Cette semaine
          </Button>
          <Button
            variant={quickFilter === "video" ? "default" : "ghost"}
            onClick={() => handleQuickFilter("video")}
            size="sm"
            className={`w-full justify-start ${quickFilter === "video"
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "text-gray-700 hover:bg-gray-50"
              }`}
          >
            <Video className="mr-2 h-4 w-4" />
            Téléconsultation
          </Button>
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h4 className="font-medium mb-3 text-gray-900">Trier par</h4>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full border-gray-300">
            <SelectValue placeholder="Choisir un tri" />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Language Filter */}
      <div>
        <h4 className="font-medium mb-3 text-gray-900">Langues</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lang-fr"
              checked={filters.languages.includes("fr")}
              onCheckedChange={(checked) => handleLanguageFilter("fr", checked as boolean)}
            />
            <label htmlFor="lang-fr" className="text-sm text-gray-700">
              Français
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lang-en"
              checked={filters.languages.includes("en")}
              onCheckedChange={(checked) => handleLanguageFilter("en", checked as boolean)}
            />
            <label htmlFor="lang-en" className="text-sm text-gray-700">
              Anglais
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="lang-ar"
              checked={filters.languages.includes("ar")}
              onCheckedChange={(checked) => handleLanguageFilter("ar", checked as boolean)}
            />
            <label htmlFor="lang-ar" className="text-sm text-gray-700">
              Arabe
            </label>
          </div>
        </div>
      </div>

      {/* Sector Filter */}
      <div>
        <h4 className="font-medium mb-3 text-gray-900">Secteur</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sector-1"
              checked={filters.sectors.includes("1")}
              onCheckedChange={(checked) => handleSectorFilter("1", checked as boolean)}
            />
            <label htmlFor="sector-1" className="text-sm text-gray-700">
              Secteur 1
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sector-2"
              checked={filters.sectors.includes("2")}
              onCheckedChange={(checked) => handleSectorFilter("2", checked as boolean)}
            />
            <label htmlFor="sector-2" className="text-sm text-gray-700">
              Secteur 2
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Button variant="ghost" onClick={onGoBack} className="mb-4 text-gray-600 hover:text-gray-900 p-0 h-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la recherche
          </Button>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {filteredDoctors.length} {specialty.toLowerCase()}s trouvés
              </h1>
              <p className="text-gray-600">Prenez rendez-vous en ligne{location && ` à ${location}`}</p>
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
                  variant={viewMode === "list" ? "default" : "ghost"}
                  onClick={() => setViewMode("list")}
                  size="sm"
                  className={`${viewMode === "list" ? "bg-gray-900 text-white" : "text-gray-600"}`}
                >
                  <List className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  onClick={() => setViewMode("grid")}
                  size="sm"
                  className={`${viewMode === "grid" ? "bg-gray-900 text-white" : "text-gray-600"}`}
                >
                  <Grid className="w-4 h-4" />
                </Button>
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
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun médecin trouvé</h3>
                <p className="text-gray-600 mb-4">Essayez de modifier vos filtres pour voir plus de résultats</p>
                <Button variant="outline" onClick={clearFilters} className="border-gray-300 text-gray-700">
                  Effacer tous les filtres
                </Button>
              </div>
            ) : viewMode === "list" ? (
              <div className="space-y-4">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="border-gray-200 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-0">
                      <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-0">
                        {/* Doctor Info Section */}
                        <div className="p-6 pt-[55px] border-r border-gray-200">
                          <div className="flex gap-4 mb-4">
                            <div className="relative flex-shrink-0">
                              <Avatar className="h-16 w-16 border-2 border-gray-100">
                                <AvatarImage src={doctor.image} alt={doctor.name} />
                                <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                                  {doctor.name.split(" ").map((n) => n[0]).join("")}
                                </AvatarFallback>
                              </Avatar>
                              <Badge
                                className={`absolute -top-[35px]  text-xs px-2 py-1 border whitespace-nowrap ${getAvailabilityStatus(doctor).type === "success"
                                    ? "bg-gray-900 text-white border-gray-900"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                  }`}
                              >
                                {getAvailabilityStatus(doctor).text}
                              </Badge>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3
                                className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-gray-700 mb-2 truncate"
                                onClick={() => onSelectDoctor(doctor.id)}
                              >
                                {doctor.name}
                              </h3>
                              <p className="text-gray-900 font-medium mb-3">{doctor.specialty}</p>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <MapPin className="h-4 w-4 flex-shrink-0" />
                                  <span className="truncate">{doctor.location}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                                  <span>Secteur {doctor.sector}</span>
                                  {doctor.teleconsultation && (
                                    <Badge variant="secondary" className="ml-2 bg-gray-100 text-gray-700 border-gray-200">
                                      <Video className="h-3 w-3 mr-1" />
                                      Téléconsultation
                                    </Badge>
                                  )}
                                </div>
                                {doctor.rating && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Star className="h-4 w-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                                    <span>
                                      {doctor.rating}/5 ({doctor.reviewCount} avis)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Availability Section */}
                        <div className="p-6 bg-gray-50">
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-gray-900">Créneaux disponibles</h4>
                            <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 px-2 py-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => previousWeek(doctor.id)}
                                disabled={(currentWeekOffset[doctor.id] || 0) <= 0}
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-gray-600 min-w-[100px] text-center">
                                {getWeekRange(doctor.id)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => nextWeek(doctor.id)}
                                disabled={(currentWeekOffset[doctor.id] || 0) >= 52}
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {/* Appointment Grid */}
                          <div className="grid grid-cols-7 gap-2 mb-4">
                            {getWeekDays(doctor.id).map((day) => (
                              <div key={day.key} className="flex flex-col gap-2">
                                <div className="text-center p-2 bg-white rounded-lg border border-gray-200">
                                  <div className="text-xs font-medium text-gray-900">{day.name}</div>
                                  <div className="text-xs text-gray-600 mt-0.5">{day.date}</div>
                                </div>
                                <div className="flex flex-col gap-1 min-h-[120px]">
                                  {getAppointmentAvailability(doctor).type === "current_week" ||
                                    doctorAvailabilityOverrides[doctor.id] === "current_week" ? (
                                    <>
                                      {getDaySlots(doctor, day.key, showAllSlots[doctor.id]).map((slot, index) => (
                                        <Button
                                          key={index}
                                          variant={slot === "—" ? "ghost" : "default"}
                                          size="sm"
                                          disabled={slot === "—"}
                                          onClick={() => bookSlot(doctor, slot)}
                                          className={`text-xs h-8 transition-all ${slot === "—"
                                            ? "text-gray-400 cursor-not-allowed bg-gray-100"
                                            : " bg-blue-600 hover:bg-blue-900 text-white"
                                            }`}
                                        >
                                          {slot}
                                        </Button>
                                      ))}
                                      {canShowMoreSlots(doctor, day.key) && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => toggleDaySlots(doctor.id)}
                                          className="text-xs h-6 text-gray-600 hover:text-gray-900"
                                        >
                                          {showAllSlots[doctor.id] ? "Moins" : "Plus"}
                                        </Button>
                                      )}
                                    </>
                                  ) : (
                                    Array.from({ length: 3 }).map((_, index) => (
                                      <div
                                        key={index}
                                        className="text-xs text-center text-gray-400 py-2 bg-gray-100 rounded"
                                      >
                                        —
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Special Messages */}
                          <div className="space-y-2">
                            {getAppointmentAvailability(doctor).type === "future_date" &&
                              doctorAvailabilityOverrides[doctor.id] !== "current_week" && (
                                <Alert className="border-gray-200 bg-gray-50">
                                  <AlertDescription className="flex items-center justify-between">
                                    <span className="text-gray-700">
                                      Prochain RDV le {getAppointmentAvailability(doctor).date}
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => goToFutureDate(doctor)}
                                      className="text-blue-700 hover:text-gray-900 hover:bg-gray-100"
                                    >
                                      Voir
                                    </Button>
                                  </AlertDescription>
                                </Alert>
                              )}
                            {getAppointmentAvailability(doctor).type === "existing_patients" && (
                              <Alert className="border-gray-200 bg-gray-50">
                                <AlertDescription className="text-gray-700">
                                  Réservé aux patients déjà suivis
                                </AlertDescription>
                              </Alert>
                            )}
                            {getAppointmentAvailability(doctor).type === "no_online" && (
                              <Alert className="border-gray-200 bg-gray-50">
                                <AlertDescription className="text-gray-700">
                                  Aucune disponibilité en ligne
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // Grid view
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <Card key={doctor.id} className="border-gray-200 hover:shadow-md transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-4 h-full">
                        <div className="flex justify-between items-start">
                          <Avatar className="h-14 w-14 border-2 border-gray-100">
                            <AvatarImage src={doctor.image} alt={doctor.name} />
                            <AvatarFallback className="bg-gray-100 text-gray-700 font-semibold">
                              {doctor.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <Badge
                            variant="secondary"
                            className={`text-xs px-2 py-1 ${getAvailabilityStatus(doctor).type === "success"
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-700"
                              }`}
                          >
                            {getAvailabilityStatus(doctor).text}
                          </Badge>
                        </div>
                        <div className="text-center flex-1">
                          <h3
                            className="text-lg font-semibold text-gray-900 cursor-pointer hover:text-gray-700 mb-2"
                            onClick={() => onSelectDoctor(doctor.id)}
                          >
                            {doctor.name}
                          </h3>
                          <p className="text-gray-900 font-medium mb-1">{doctor.specialty}</p>
                          <p className="text-sm text-gray-600 mb-3">{doctor.location}</p>
                          {doctor.rating && (
                            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-3">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>
                                {doctor.rating}/5 ({doctor.reviewCount})
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <h4 className="text-sm font-semibold mb-3 text-gray-900">Prochains créneaux</h4>
                          <div className="space-y-2">
                            {getNextSlots(doctor).map((slot) => (
                              <Button
                                key={slot.id}
                                variant="outline"
                                size="sm"
                                onClick={() => bookSlot(doctor, slot)}
                                className="w-full text-xs justify-start bg-white hover:bg-gray-50 border-gray-200 text-gray-700"
                              >
                                {slot.time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 