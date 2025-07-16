
import React, { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { StatusCard } from '@/components/appointments/StatusCard'
import { AppointmentCard } from '@/components/appointments/AppointmentCard'
import { SearchDialog } from '@/components/appointments/SearchDialog'

export default function Appointments() {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const openSearchDialog = () => {
    setIsSearchDialogOpen(true)
  }

  const closeSearchDialog = () => {
    setIsSearchDialogOpen(false)
  }

  const handleSearch = (searchData: any) => {
    console.log('Search data:', searchData)
    // Handle search logic here
    closeSearchDialog()
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold text-foreground">Mes Rendez-vous</h2>
          <p className="text-muted-foreground">Gérez vos consultations médicales</p>
        </div>
        <div className="flex gap-3">
          <Button onClick={openSearchDialog} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nouveau Rendez-vous
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatusCard title="À venir" value="0" color="blue" icon="calendar" />
        <StatusCard title="Terminés" value="1" color="green" icon="check" />
        <StatusCard title="Annulés" value="0" color="red" icon="x" />
        <StatusCard title="Absents" value="0" color="gray" icon="user-x" />
        <StatusCard title="Total" value="1" color="purple" icon="list" />
      </div>

      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Rechercher par médecin, spécialité ou motif..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-input rounded-lg bg-background focus:ring-2 focus:ring-ring focus:border-transparent min-w-[180px]"
        >
          <option value="all">Tous les statuts</option>
          <option value="upcoming">À venir</option>
          <option value="completed">Terminés</option>
          <option value="cancelled">Annulés</option>
        </select>
      </div>

      {/* Appointments List */}
      <div className="bg-card rounded-lg shadow border">
        <div className="p-4 border-b border-border">
          <h3 className="font-medium text-card-foreground">✓ Rendez-vous terminés (1)</h3>
        </div>

        <div className="p-4">
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
      </div>

      {/* Search Dialog */}
      <SearchDialog 
        isOpen={isSearchDialogOpen} 
        onClose={closeSearchDialog} 
        onSearch={handleSearch} 
      />
    </div>
  )
}
