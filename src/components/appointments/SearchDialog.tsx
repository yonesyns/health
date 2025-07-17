"use client"

import { useState } from "react"
import { Search, MapPin, Calendar, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

// Import components
import { SpecialtyResults } from "@/components/specialtyResults/SpecialtyResults"
import { DoctorProfile } from "@/components/doctorProfile/DoctorProfile"
import { AppointmentBooking } from "@/components/appointments/AppointmentBooking"

interface SearchDialogProps {
  isOpen: boolean
  onClose: () => void
}

interface PopularSpecialty {
  name: string
  count: number
}

const popularSpecialties: PopularSpecialty[] = [
  { name: "Cardiologue", count: 42 },
  { name: "Dermatologue", count: 35 },
  { name: "Ophtalmologue", count: 30 },
  { name: "Pédiatre", count: 28 },
  { name: "Gynécologue", count: 25 },
]

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [location, setLocation] = useState("")
  const [currentView, setCurrentView] = useState<"search" | "results" | "profile" | "booking">("search")
  const [selectedSpecialty, setSelectedSpecialty] = useState("")
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null)
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>("")

  const handleSearch = () => {
    if (searchTerm.trim()) {
      setCurrentView("results")
      setSelectedSpecialty(searchTerm.trim())
    }
  }

  const handleSpecialtySelect = (specialty: string) => {
    setSelectedSpecialty(specialty)
    setCurrentView("results")
  }

  const handleDoctorSelect = (doctorId: number, doctorName?: string, mode?: string) => {
    setSelectedDoctorId(doctorId)
    setSelectedDoctorName(doctorName || "")
    
    if (mode === "booking") {
      setCurrentView("booking")
    } else {
      setCurrentView("profile")
    }
  }

  const handleGoBack = () => {
    if (currentView === "booking" || currentView === "profile") {
      setCurrentView("results")
    } else if (currentView === "results") {
      setCurrentView("search")
      setSelectedSpecialty("")
    }
  }

  const handleAppointmentBooking = (doctorName?: string) => {
    setSelectedDoctorName(doctorName || "")
    setCurrentView("booking")
  }

  const handleCloseBooking = () => {
    onClose()
  }

  const renderContent = () => {
    return (
      <div className="flex flex-col h-full">
        <DialogHeader>
          <DialogTitle>Recherche de professionnels de santé</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Spécialité ou nom du médecin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Ville ou code postal"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch}>Rechercher</Button>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Spécialités populaires</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularSpecialties.map((specialty) => (
              <Card
                key={specialty.name}
                className="cursor-pointer hover:shadow-md transition-shadow duration-200"
                onClick={() => handleSpecialtySelect(specialty.name)}
              >
                <CardContent className="flex items-center justify-between p-4">
                  <span>{specialty.name}</span>
                  <Badge variant="secondary">{specialty.count}+</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (currentView === "results" && selectedSpecialty) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-7xl h-[90vh] p-0">
          <SpecialtyResults
            specialty={selectedSpecialty}
            location={location}
            onGoBack={handleGoBack}
            onSelectDoctor={handleDoctorSelect}
          />
        </DialogContent>
      </Dialog>
    )
  }

  if (currentView === "profile" && selectedDoctorId) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <DoctorProfile
            doctorId={selectedDoctorId}
            onGoBack={handleGoBack}
          />
        </DialogContent>
      </Dialog>
    )
  }

  if (currentView === "booking") {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl h-[90vh] p-0">
          <AppointmentBooking
            doctorName={selectedDoctorName}
            isInDialog={true}
            onGoBack={handleGoBack}
            onClose={handleCloseBooking}
          />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[600px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  )
}
