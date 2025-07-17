"use client"

import { useState } from "react"
import { Plus, Search, Calendar, SlidersHorizontal, Clock, CheckCircle2, XCircle, UserMinus, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { StatusCard } from "@/components/appointments/StatusCard"
import { AppointmentCard } from "@/components/appointments/AppointmentCard"
import { SearchDialog } from "@/components/appointments/SearchDialog"

export default function Appointments() {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        
        {/* Refined Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-semibold text-gray-900 dark:text-gray-50 tracking-tight">
                Rendez-vous
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Gérez vos consultations médicales
              </p>
            </div>
            
            <Button
              onClick={() => setIsSearchDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-800 dark:bg-gray-50 dark:hover:bg-gray-200 text-white dark:text-gray-900 h-10 px-4 text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Rendez-vous
            </Button>
          </div>
        </div>

        {/* Minimalist Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 lg:gap-4 mb-8">
          <StatusCard
            title="À venir"
            value="0"
            color="neutral"
            icon="calendar"
            accent="blue"
          />
          <StatusCard
            title="Terminés"
            value="1"
            color="neutral"
            icon="check"
            accent="green"
          />
          <StatusCard
            title="Annulés"
            value="0"
            color="neutral"
            icon="x"
            accent="red"
          />
          <StatusCard
            title="Absents"
            value="0"
            color="neutral"
            icon="user-x"
            accent="gray"
          />
          <StatusCard
            title="Total"
            value="1"
            color="neutral"
            icon="list"
            accent="purple"
          />
        </div>

        {/* Clean Search & Filter Bar */}
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 lg:p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm focus:ring-1 focus:ring-gray-900 dark:focus:ring-gray-100"
              >
                <option value="all">Tous</option>
                <option value="upcoming">À venir</option>
                <option value="completed">Terminés</option>
                <option value="cancelled">Annulés</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                className="h-10 px-3 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Appointments List - Card Style */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Terminés
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              (1)
            </span>
          </div>
          
          <AppointmentCard
            doctor="Dr. John Smith"
            specialty="Cardiology"
            date="01 novembre 2024"
            time="09:00"
            reason="Previous checkup"
            notes="Completed regular checkup"
            status="completed"
          />
        </div>

        {/* Alternative: Table Style for Desktop */}
        <div className="hidden lg:block mt-8">
          <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-800">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Médecin
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Motif
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      01 nov 2024
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      09:00
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Dr. John Smith
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Cardiology
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                    Previous checkup
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400">
                      Terminé
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                      Détails
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <SearchDialog 
          isOpen={isSearchDialogOpen} 
          onClose={() => setIsSearchDialogOpen(false)} 
          onSearch={(data) => {
            console.log("Search data:", data)
            setIsSearchDialogOpen(false)
          }} 
        />
      </div>
    </div>
  )
}