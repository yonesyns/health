"use client"

import { useState } from "react"
import { Plus, Search, Calendar, SlidersHorizontal, Clock, CheckCircle2, XCircle, UserMinus, List, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusCard } from "@/components/appointments/StatusCard"
import { AppointmentCard } from "@/components/appointments/AppointmentCard"
import { SearchDialog } from "@/components/appointments/SearchDialog"

export default function Appointments() {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const appointments = [
    {
      id: 1,
      doctor: "Dr. John Smith",
      specialty: "Cardiologie",
      date: "01 novembre 2024",
      time: "09:00",
      reason: "Contrôle de routine",
      notes: "Consultation terminée avec succès",
      status: "completed" as const,
      avatar: "/doctor-avatar.jpg"
    },
    {
      id: 2,
      doctor: "Dr. Sarah Johnson",
      specialty: "Dermatologie",
      date: "15 novembre 2024",
      time: "14:30",
      reason: "Consultation dermatologique",
      notes: "",
      status: "upcoming" as const,
      avatar: "/doctor-avatar-2.jpg"
    }
  ]

  const stats = [
    { title: "À venir", value: "1", icon: Calendar, color: "blue" },
    { title: "Terminés", value: "1", icon: CheckCircle2, color: "green" },
    { title: "Annulés", value: "0", icon: XCircle, color: "red" },
    { title: "Absents", value: "0", icon: UserMinus, color: "gray" },
    { title: "Total", value: "2", icon: List, color: "purple" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 text-green-700 border-green-200"
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200"
      case "missed":
        return "bg-gray-50 text-gray-700 border-gray-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Terminé"
      case "upcoming":
        return "À venir"
      case "cancelled":
        return "Annulé"
      case "missed":
        return "Absent"
      default:
        return "Inconnu"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Mes Rendez-vous
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez vos consultations médicales
          </p>
        </div>
        
        <Button
          onClick={() => setIsSearchDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Rendez-vous
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${
                  stat.color === 'blue' ? 'bg-blue-100 text-blue-600' :
                  stat.color === 'green' ? 'bg-green-100 text-green-600' :
                  stat.color === 'red' ? 'bg-red-100 text-red-600' :
                  stat.color === 'gray' ? 'bg-gray-100 text-gray-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un médecin, une spécialité..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-blue-600"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-blue-600 focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="upcoming">À venir</option>
              <option value="completed">Terminés</option>
              <option value="cancelled">Annulés</option>
              <option value="missed">Absents</option>
            </select>
            
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
            </Button>
            
            <div className="hidden lg:flex border border-gray-200 rounded-lg p-1">
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("cards")}
                className="h-8 px-3"
              >
                Cards
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("table")}
                className="h-8 px-3"
              >
                Table
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List - Card View */}
      {viewMode === "cards" && (
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {appointment.doctor.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{appointment.doctor}</h3>
                    <p className="text-sm text-gray-600">{appointment.specialty}</p>
                    <p className="text-sm text-gray-500 mt-1">{appointment.reason}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Calendar className="w-4 h-4" />
                    <span>{appointment.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>{appointment.time}</span>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                    {getStatusText(appointment.status)}
                  </span>
                </div>
              </div>
              
              {appointment.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">{appointment.notes}</p>
                </div>
              )}
              
              <div className="mt-4 flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Voir détails
                </Button>
                {appointment.status === "upcoming" && (
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    Annuler
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Appointments List - Table View */}
      {viewMode === "table" && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Heure
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Médecin
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Motif
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {appointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {appointment.date}
                    </div>
                    <div className="text-sm text-gray-500">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-xs">
                          {appointment.doctor.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctor}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.specialty}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {appointment.reason}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getStatusColor(appointment.status)}`}>
                      {getStatusText(appointment.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                      Détails
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {appointments.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun rendez-vous trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas encore de rendez-vous programmés.
          </p>
          <Button
            onClick={() => setIsSearchDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Prendre un rendez-vous
          </Button>
        </div>
      )}

      <SearchDialog 
        isOpen={isSearchDialogOpen} 
        onClose={() => setIsSearchDialogOpen(false)} 
        onSearch={(data) => {
          console.log("Search data:", data)
          setIsSearchDialogOpen(false)
        }} 
      />
    </div>
  )
}