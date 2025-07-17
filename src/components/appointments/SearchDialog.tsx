"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Search, MapPin, X, ArrowRight, Star, User, Stethoscope, Building2, ArrowLeft } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DoctorProfile } from "../doctorProfile/DoctorProfile"
import { SpecialtyResults } from "../specialtyResults/SpecialtyResults"
import { EstablishmentResults } from "../establishmentResults/EstablishmentResults"
import { AppointmentBooking } from "./AppointmentBooking"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
  onSearch: (searchData: SearchData) => void
}

interface SearchData {
  doctor: string
  specialty: string
  date: string
  time: string
  reason: string
}

interface Suggestion {
  displayText: string
  subtitle: string
  type: "doctor" | "specialty" | "establishment"
  data?: any
}

const mockSuggestions: Suggestion[] = [
  {
    displayText: "Dr. Sarah Johnson",
    subtitle: "Cardiologue - Clinique du Cœur",
    type: "doctor",
    data: { rating: 4.8, id: 1 },
  },
  {
    displayText: "Dr. Ahmed Ben Ali",
    subtitle: "Dermatologue - Polyclinique Tanger",
    type: "doctor",
    data: { rating: 4.9, id: 2 },
  },
  {
    displayText: "Cardiologie",
    subtitle: "15 médecins disponibles",
    type: "specialty",
    data: {},
  },
  {
    displayText: "Dermatologie",
    subtitle: "8 médecins disponibles",
    type: "specialty",
    data: {},
  },
  {
    displayText: "Clinique du Cœur",
    subtitle: "12 spécialistes - Tanger",
    type: "establishment",
    data: { name: "Clinique du Cœur" },
  },
]

const locationSuggestions = ["Tanger Centre", "Tanger Marina", "Boukhalef", "Malabata", "Mesnana"]

export function SearchDialog({ isOpen, onClose, onSearch }: SearchDialogProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationQuery, setLocationQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [currentView, setCurrentView] = useState<"search" | "profile" | "specialty" | "establishment" | "booking">(
    "search",
  )
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null)
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("")

  const searchRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)

  const filteredSuggestions =
    searchQuery.length === 0
      ? mockSuggestions.slice(0, 5)
      : mockSuggestions
          .filter(
            (suggestion) =>
              suggestion.displayText.toLowerCase().includes(searchQuery.toLowerCase()) ||
              suggestion.subtitle.toLowerCase().includes(searchQuery.toLowerCase()),
          )
          .slice(0, 5)

  const filteredLocationSuggestions =
    locationQuery.length === 0
      ? locationSuggestions.slice(0, 3)
      : locationSuggestions
          .filter((location) => location.toLowerCase().includes(locationQuery.toLowerCase()))
          .slice(0, 3)

  const getBadgeClass = (type: string) => {
    switch (type) {
      case "doctor":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "specialty":
        return "bg-green-50 text-green-700 border-green-200"
      case "establishment":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getBadgeText = (type: string) => {
    switch (type) {
      case "doctor":
        return "Docteur"
      case "specialty":
        return "Spécialité"
      case "establishment":
        return "Établissement"
      default:
        return ""
    }
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "doctor":
        return <User className="w-4 h-4" />
      case "specialty":
        return <Stethoscope className="w-4 h-4" />
      case "establishment":
        return <Building2 className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setShowSuggestions(true)
  }

  const handleLocationInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationQuery(e.target.value)
    setShowLocationSuggestions(true)
  }

  const selectSuggestion = (suggestion: Suggestion) => {
    setSearchQuery(suggestion.displayText)
    setShowSuggestions(false)
  }

  const selectLocationSuggestion = (location: string) => {
    setLocationQuery(location)
    setShowLocationSuggestions(false)
  }

  const performSearch = () => {
    if (!searchQuery.trim()) return

    const matchedDoctor = mockSuggestions.find(
      (s) => s.type === "doctor" && s.displayText.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const matchedSpecialty = mockSuggestions.find(
      (s) => s.type === "specialty" && s.displayText.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const matchedEstablishment = mockSuggestions.find(
      (s) => s.type === "establishment" && s.displayText.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    if (matchedDoctor?.data?.id) {
      // If we found a doctor, show the profile
      setSelectedDoctorId(matchedDoctor.data.id)
      setCurrentView("profile")
      return
    } else if (matchedSpecialty) {
      // If we found a specialty, show specialty results
      setCurrentView("specialty")
      return
    } else if (matchedEstablishment) {
      // If we found an establishment, show establishment results
      setCurrentView("establishment")
      return
    }

    // Only call onSearch if we're not showing a specific view
    onSearch({
      doctor: searchQuery,
      specialty: "",
      date: "",
      time: "",
      reason: "",
    })
  }

  const handleBackToSearch = () => {
    setCurrentView("search")
    setSelectedDoctorId(null)
  }

  const handleAppointmentBooking = (doctorName?: string) => {
    setSelectedDoctorName(doctorName || "Dr. Médecin")
    setCurrentView("booking")
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setShowSuggestions(false)
    }
    if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
      setShowLocationSuggestions(false)
    }
  }

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleBackFromSpecialty = () => {
    setCurrentView("search")
  }

  const handleBackFromEstablishment = () => {
    setCurrentView("search")
  }

  const handleSelectDoctorFromSpecialty = (doctorId: number) => {
    setSelectedDoctorId(doctorId)
    setCurrentView("profile")
  }

  const handleSelectDoctorFromEstablishment = (doctorId: number) => {
    setSelectedDoctorId(doctorId)
    setCurrentView("profile")
  }

  const handleClose = () => {
    setCurrentView("search")
    setSearchQuery("")
    setLocationQuery("")
    setShowSuggestions(false)
    setShowLocationSuggestions(false)
    setSelectedDoctorId(null)
    setSelectedDoctorName("")
    onClose()
  }

  const getDialogTitle = () => {
    switch (currentView) {
      case "search":
        return "Nouveau Rendez-vous"
      case "profile":
        return "Profil du Médecin"
      case "specialty":
        return "Résultats par spécialité"
      case "establishment":
        return "Établissement médical"
      case "booking":
        return "Prendre rendez-vous"
      default:
        return "Recherche"
    }
  }

  const handleBackFromBooking = () => {
    setCurrentView("profile")
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[100vw] w-full h-full max-h-[1000vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {currentView === "profile" && (
                <Button variant="ghost" size="sm" onClick={handleBackToSearch} className="mr-2">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <Search className="h-5 w-5" />
              {getDialogTitle()}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div
          className={`overflow-y-auto ${currentView === "search" ? "p-6" : ""}`}
          style={{ maxHeight: "calc(95vh - 80px)" }}
        >
          {currentView === "search" ? (
            <div className="max-w-4xl h-[77vh] mx-auto">
              {/* Search Form */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-2 flex flex-col md:flex-row items-center gap-2">
                {/* Search Input */}
                <div className="relative flex-1 w-full" ref={searchRef}>
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInput}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Nom, spécialité, établissement..."
                      className="w-full pl-12 pr-10 py-3 border-0 focus:ring-0 focus:border-0 text-base"
                    />
                    {searchQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery("")
                          setShowSuggestions(false)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Search Suggestions */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
                      {filteredSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => selectSuggestion(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center justify-between transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-gray-400">{getIcon(suggestion.type)}</div>
                            <div>
                              <div className="text-gray-900 font-medium">{suggestion.displayText}</div>
                              <div className="text-gray-500 text-sm">{suggestion.subtitle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {suggestion.type === "doctor" && suggestion.data?.rating && (
                              <div className="flex items-center gap-1 text-yellow-500">
                                <Star className="w-4 h-4 fill-current" />
                                <span className="text-sm">{suggestion.data.rating}</span>
                              </div>
                            )}
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeClass(suggestion.type)}`}
                            >
                              {getBadgeText(suggestion.type)}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-6 bg-gray-200" />

                {/* Location Input */}
                <div className="relative flex-1 w-full" ref={locationRef}>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      type="text"
                      value={locationQuery}
                      onChange={handleLocationInput}
                      onFocus={() => setShowLocationSuggestions(true)}
                      placeholder="Où ?"
                      className="w-full pl-12 pr-10 py-3 border-0 focus:ring-0 focus:border-0 text-base"
                    />
                    {locationQuery && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setLocationQuery("")
                          setShowLocationSuggestions(false)
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {/* Location Suggestions */}
                  {showLocationSuggestions && filteredLocationSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                      {filteredLocationSuggestions.map((location, index) => (
                        <button
                          key={index}
                          onClick={() => selectLocationSuggestion(location)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-gray-900 font-medium flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-gray-400" />
                            {location}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Search Button */}
                <Button
                  onClick={performSearch}
                  disabled={!searchQuery.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-s"
                >
                  <span>Rechercher</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : currentView === "profile" ? (
            <div className="w-full">
              {selectedDoctorId && (
                <DoctorProfile
                  doctorId={selectedDoctorId}
                  onBack={handleBackToSearch}
                  onAppointmentBooking={handleAppointmentBooking}
                  isInDialog={true}
                />
              )}
            </div>
          ) : currentView === "specialty" ? (
            <div className="w-full">
              <SpecialtyResults
                specialty={searchQuery}
                location={locationQuery}
                onGoBack={handleBackFromSpecialty}
                onSelectDoctor={handleSelectDoctorFromSpecialty}
              />
            </div>
          ) : currentView === "establishment" ? (
            <div className="w-full">
              <EstablishmentResults
                establishment={{
                  name: searchQuery,
                  location: locationQuery || "Tanger",
                  specialistCount: 12,
                }}
                onGoBack={handleBackFromEstablishment}
                onSelectDoctor={handleSelectDoctorFromEstablishment}
              />
            </div>
          ) : currentView === "booking" ? (
            <div className="w-full">
              <AppointmentBooking
                doctorName={selectedDoctorName}
                isInDialog={true}
                onGoBack={handleBackFromBooking}
                onClose={handleClose}
              />
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
