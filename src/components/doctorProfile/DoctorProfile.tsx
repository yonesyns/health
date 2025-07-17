import React from "react"
import {
  ArrowLeft,
  Calendar,
  MapPin,
  CheckCircle,
  Star,
  Phone,
  Video,
  Globe,
  User,
  FileText,
  Building2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface DoctorProfileProps {
  doctorId: number
  onGoBack: () => void
}

export function DoctorProfile({ doctorId, onGoBack }: DoctorProfileProps) {
  const doctor = {
    id: 1,
    name: "Dr. Isabelle Boublil",
    specialty: "Médecin généraliste",
    location: "Paris, France",
    address: "123 Rue de la Paix, 75001 Paris",
    phone: "+33 1 23 45 67 89",
    website: "https://www.example.com",
    languages: ["Français", "Anglais"],
    availability: "Disponible sur rendez-vous",
    rating: 4.8,
    reviews: 250,
    bio:
      "Le Dr. Isabelle Boublil est une médecin généraliste expérimentée avec plus de 15 ans de pratique. Elle est passionnée par la fourniture de soins de santé de qualité à ses patients.",
    services: [
      "Consultations de médecine générale",
      "Vaccinations",
      "Bilans de santé",
      "Suivi des maladies chroniques",
    ],
    teleconsultation: true,
  }

  const StatCard: React.FC<{
    icon: React.ReactNode
    label: string
    value: string | number
    description?: string
    children?: React.ReactNode
  }> = ({ icon, label, value, description, children }) => (
    <Card className="p-4">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
      {children}
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="max-w-4xl mx-auto p-6">
          <Button variant="ghost" onClick={onGoBack} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">{doctor.name}</h1>
            <p className="text-lg text-muted-foreground">{doctor.specialty}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Doctor Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={<Star className="w-5 h-5 text-yellow-500" />}
            label="Note"
            value={doctor.rating}
            description={`${doctor.reviews} avis`}
          />
          <StatCard
            icon={<Calendar className="w-5 h-5 text-blue-500" />}
            label="Disponibilité"
            value={doctor.availability}
          />
          <StatCard
            icon={<MapPin className="w-5 h-5 text-green-500" />}
            label="Adresse"
            value={doctor.location}
          >
            <p className="text-sm text-muted-foreground mt-2">{doctor.address}</p>
          </StatCard>
        </div>

        {/* Doctor Details */}
        <Card>
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold text-foreground">À propos</h2>
            <p className="text-muted-foreground">{doctor.bio}</p>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Informations pratiques</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <a href={`tel:${doctor.phone}`} className="text-blue-500 hover:underline">
                    {doctor.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <a href={doctor.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Site web
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>Langues : {doctor.languages.join(", ")}</span>
                </div>
                {doctor.teleconsultation && (
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-muted-foreground" />
                    <span>Téléconsultation disponible</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">Services proposés</h3>
              <ul className="list-disc list-inside text-muted-foreground">
                {doctor.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-x-2 flex justify-end">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Consulter le CV
          </Button>
          <Button>
            <Calendar className="w-4 h-4 mr-2" />
            Prendre rendez-vous
          </Button>
        </div>
      </div>
    </div>
  )
}
