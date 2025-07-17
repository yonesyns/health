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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

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
      const today = new Date()
      const overrideType = doctorAvailabilityOverrides[doctor.id]
      const effectiveType = overrideType || doctor.availabilityType

      switch (effectiveType) {
        case "current_week":
          return { type: "current_week" }
        case "future_date":
          return {
            type: "future_date",
            date: "27 aoû 2025",
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
    [currentWeekOffset, doctorAvailabilityOverrides],
  )

  const getWeekDays = useCallback(
    (doctorId: number) => {
      const today = new Date()
      const offset = currentWeekOffset[doctorId] || 0
      const days = []
      const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i + offset * 7)
        days.push({
          key: i,
          name: dayNames[i],
          date: `${date.getDate()}/${date.getMonth() + 1}`,
          fullDate: date,
        })
      }
      return days
    },
    [currentWeekOffset],
  )

  const getDaySlots = useCallback((doctor: Doctor, dayIndex: number, showAll = false) => {
    if (doctor.availabilityType !== "current_week") {
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
  }, [])

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

  const getMonthName = (monthIndex: number) => {
    const months = ["jan", "fév", "mar", "avr", "mai", "jun", "jul", "aoû", "sep", "oct", "nov", "déc"]
    return months[monthIndex]
  }

  const canShowMoreSlots = useCallback(
    (doctor: Doctor, dayIndex: number) => {
      const allSlots = getDaySlots(doctor, dayIndex, true)
      const visibleSlots = getDaySlots(doctor, dayIndex, false)
      return allSlots.length > visibleSlots.length
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
      [doctorId]: Math.min((prev[doctorId] || 0) + 1, 4),
    }))
  }

  const goToFutureDate = (doctor: Doctor) => {
    const availability = getAppointmentAvailability(doctor)
    if (availability.type === "future_date") {
      // Calculate the exact week offset needed to show August 27, 2025
      const today = new Date()
      const targetDate = new Date(2025, 7, 27) // August 27, 2025
      const diffTime = targetDate.getTime() - today.getTime()
      const diffWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7))

      setCurrentWeekOffset((prev) => ({
        ...prev,
        [doctor.id]: diffWeeks,
      }))

      // Override the availability type to show slots
      setDoctorAvailabilityOverrides((prev) => ({
        ...prev,
        [doctor.id]: "current_week",
      }))
    }
  }

  const bookSlot = (doctor: Doctor, slot: any) => {
    if (typeof slot === "string" && slot === "—") return
    console.log(`Booking slot for doctor ${doctor.name}`, slot)
    // Open AppointmentBooking instead of modal
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

  return (
    <div className="bg-background min-h-screen">
      {/* Header Section - Improved */}
      <div className="bg-card border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Button variant="ghost" onClick={onGoBack} className="mb-4 hover:bg-muted">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la recherche
          </Button>
          <div className="flex justify-between items-center gap-8">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {filteredDoctors.length} {specialty.toLowerCase()}s trouvés
              </h1>
              <p className="text-muted-foreground">Prenez rendez-vous en ligne{location && ` à ${location}`}</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                onClick={() => setViewMode("list")}
                size="sm"
              >
                <List className="mr-2 h-4 w-4" />
                Liste
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                onClick={() => setViewMode("grid")}
                size="sm"
              >
                <Grid className="mr-2 h-4 w-4" />
                Grille
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Sidebar Filters - Improved */}
        <div className="lg:sticky lg:top-8">
          <Card className="shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Filtres</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground hover:text-foreground">
                  Effacer
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quick Filters */}
              <div>
                <h4 className="font-medium mb-3 text-foreground">Disponibilité</h4>
                <div className="space-y-2">
                  <Button
                    variant={quickFilter === "today" ? "default" : "outline"}
                    onClick={() => handleQuickFilter("today")}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    Aujourd'hui
                  </Button>
                  <Button
                    variant={quickFilter === "week" ? "default" : "outline"}
                    onClick={() => handleQuickFilter("week")}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Cette semaine
                  </Button>
                  <Button
                    variant={quickFilter === "video" ? "default" : "outline"}
                    onClick={() => handleQuickFilter("video")}
                    size="sm"
                    className="w-full justify-start"
                  >
                    <Video className="mr-2 h-4 w-4" />
                    Téléconsultation
                  </Button>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="font-medium mb-3 text-foreground">Trier par</h4>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
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
                <h4 className="font-medium mb-3 text-foreground">Langues</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lang-fr"
                      checked={filters.languages.includes("fr")}
                      onCheckedChange={(checked) => handleLanguageFilter("fr", checked as boolean)}
                    />
                    <label htmlFor="lang-fr" className="text-sm text-foreground">
                      Français
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lang-en"
                      checked={filters.languages.includes("en")}
                      onCheckedChange={(checked) => handleLanguageFilter("en", checked as boolean)}
                    />
                    <label htmlFor="lang-en" className="text-sm text-foreground">
                      Anglais
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lang-ar"
                      checked={filters.languages.includes("ar")}
                      onCheckedChange={(checked) => handleLanguageFilter("ar", checked as boolean)}
                    />
                    <label htmlFor="lang-ar" className="text-sm text-foreground">
                      Arabe
                    </label>
                  </div>
                </div>
              </div>

              {/* Sector Filter */}
              <div>
                <h4 className="font-medium mb-3 text-foreground">Secteur</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sector-1"
                      checked={filters.sectors.includes("1")}
                      onCheckedChange={(checked) => handleSectorFilter("1", checked as boolean)}
                    />
                    <label htmlFor="sector-1" className="text-sm text-foreground">
                      Secteur 1
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sector-2"
                      checked={filters.sectors.includes("2")}
                      onCheckedChange={(checked) => handleSectorFilter("2", checked as boolean)}
                    />
                    <label htmlFor="sector-2" className="text-sm text-foreground">
                      Secteur 2
                    </label>
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
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Aucun médecin trouvé</h3>
              <p className="text-muted-foreground mb-4">Essayez de modifier vos filtres pour voir plus de résultats</p>
              <Button variant="outline" onClick={clearFilters}>
                Effacer tous les filtres
              </Button>
            </div>
          ) : viewMode === "list" ? (
            <div className="space-y-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-all duration-200 border shadow-sm">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 xl:grid-cols-[350px_1fr] gap-0">
                      {/* Doctor Info Section */}
                      <div className="p-6 border-r border-border">
                        <div className="flex gap-4 mb-4">
                          <div className="relative flex-shrink-0">
                            <Avatar className="h-20 w-20 border-2 border-border shadow-sm">
                              <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                              <AvatarFallback className="bg-muted text-muted-foreground font-semibold text-lg">
                                {doctor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <Badge
                              variant={
                                getAvailabilityStatus(doctor).type === "success"
                                  ? "default"
                                  : getAvailabilityStatus(doctor).type === "warning"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="absolute -top-1 -right-1 text-xs px-2 py-1 shadow-sm"
                            >
                              {getAvailabilityStatus(doctor).text}
                            </Badge>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3
                              className="text-xl font-semibold text-primary cursor-pointer hover:text-primary/80 mb-2 truncate"
                              onClick={() => onSelectDoctor(doctor.id)}
                            >
                              {doctor.name}
                            </h3>
                            <p className="text-foreground font-medium mb-3">{doctor.specialty}</p>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{doctor.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CheckCircle className="h-4 w-4 flex-shrink-0 text-emerald-500" />
                                <span>Secteur {doctor.sector}</span>
                                {doctor.teleconsultation && (
                                  <Badge variant="outline" className="ml-2">
                                    <Video className="h-3 w-3 mr-1" />
                                    Téléconsultation
                                  </Badge>
                                )}
                              </div>
                              {doctor.rating && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                      <div className="p-6 bg-muted/30">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-semibold text-foreground">Créneaux disponibles</h4>
                          <div className="flex items-center gap-1 bg-card rounded-lg border px-2 py-1 shadow-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => previousWeek(doctor.id)}
                              disabled={(currentWeekOffset[doctor.id] || 0) <= 0}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-muted-foreground min-w-[100px] text-center font-medium">
                              {getWeekRange(doctor.id)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => nextWeek(doctor.id)}
                              disabled={(currentWeekOffset[doctor.id] || 0) >= 4}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Appointment Grid */}
                        <div className="grid grid-cols-7 gap-3 mb-4">
                          {getWeekDays(doctor.id).map((day) => (
                            <div key={day.key} className="flex flex-col gap-2">
                              <div className="text-center p-2 bg-card rounded-lg border shadow-sm">
                                <div className="text-xs font-semibold text-foreground">{day.name}</div>
                                <div className="text-xs text-muted-foreground mt-0.5">{day.date}</div>
                              </div>
                              <div className="flex flex-col gap-1 min-h-[120px]">
                                {getAppointmentAvailability(doctor).type === "current_week" ? (
                                  <>
                                    {getDaySlots(doctor, day.key, showAllSlots[doctor.id]).map((slot, index) => (
                                      <Button
                                        key={index}
                                        variant={slot === "—" ? "ghost" : "default"}
                                        size="sm"
                                        disabled={slot === "—"}
                                        onClick={() => bookSlot(doctor, slot)}
                                        className={`text-xs h-8 transition-all ${
                                          slot === "—"
                                            ? "text-muted-foreground cursor-not-allowed bg-muted/50"
                                            : "bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow-md"
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
                                        className="text-xs h-6 text-primary hover:text-primary/80"
                                      >
                                        {showAllSlots[doctor.id] ? "Moins" : "Plus"}
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  Array.from({ length: 3 }).map((_, index) => (
                                    <div
                                      key={index}
                                      className="text-xs text-center text-muted-foreground py-2 bg-muted/50 rounded"
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
                          {getAppointmentAvailability(doctor).type === "future_date" && (
                            <Alert className="border-primary/20 bg-primary/5">
                              <AlertDescription className="flex items-center justify-between">
                                <span className="text-primary">
                                  Prochain RDV le {getAppointmentAvailability(doctor).date}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => goToFutureDate(doctor)}
                                  className="text-primary hover:text-primary/80 hover:bg-primary/10"
                                >
                                  Voir
                                </Button>
                              </AlertDescription>
                            </Alert>
                          )}
                          {getAppointmentAvailability(doctor).type === "existing_patients" && (
                            <Alert className="border-orange-200 bg-orange-50">
                              <AlertDescription className="text-orange-800">
                                Réservé aux patients déjà suivis
                              </AlertDescription>
                            </Alert>
                          )}
                          {getAppointmentAvailability(doctor).type === "no_online" && (
                            <Alert className="border-border bg-muted/50">
                              <AlertDescription className="text-muted-foreground">
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
            // Grid view - Simplified
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <Card key={doctor.id} className="hover:shadow-lg transition-all duration-200 border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 h-full">
                      <div className="flex justify-between items-start">
                        <Avatar className="h-16 w-16 border-2 border-border shadow-sm">
                          <AvatarImage src={doctor.image || "/placeholder.svg"} alt={doctor.name} />
                          <AvatarFallback className="bg-muted text-muted-foreground font-semibold">
                            {doctor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <Badge
                          variant={
                            getAvailabilityStatus(doctor).type === "success"
                              ? "default"
                              : getAvailabilityStatus(doctor).type === "warning"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs px-2 py-1"
                        >
                          {getAvailabilityStatus(doctor).text}
                        </Badge>
                      </div>
                      <div className="text-center flex-1">
                        <h3
                          className="text-lg font-semibold text-primary cursor-pointer hover:text-primary/80 mb-2"
                          onClick={() => onSelectDoctor(doctor.id)}
                        >
                          {doctor.name}
                        </h3>
                        <p className="text-foreground font-medium mb-1">{doctor.specialty}</p>
                        <p className="text-sm text-muted-foreground mb-3">{doctor.location}</p>
                        {doctor.rating && (
                          <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground mb-3">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span>
                              {doctor.rating}/5 ({doctor.reviewCount})
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="bg-muted/50 rounded-lg p-3">
                        <h4 className="text-sm font-semibold mb-2 text-foreground">Prochains créneaux</h4>
                        <div className="space-y-1">
                          {getNextSlots(doctor).map((slot) => (
                            <Button
                              key={slot.id}
                              variant="outline"
                              size="sm"
                              onClick={() => bookSlot(doctor, slot)}
                              className="w-full text-xs justify-start bg-card hover:bg-muted border-border"
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
  )
}
