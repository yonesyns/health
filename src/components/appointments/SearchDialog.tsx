
import React, { useState } from 'react'
import { Search, Calendar, Clock, User, FileText } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

export function SearchDialog({ isOpen, onClose, onSearch }: SearchDialogProps) {
  const [formData, setFormData] = useState<SearchData>({
    doctor: '',
    specialty: '',
    date: '',
    time: '',
    reason: ''
  })

  const handleInputChange = (field: keyof SearchData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(formData)
  }

  const handleReset = () => {
    setFormData({
      doctor: '',
      specialty: '',
      date: '',
      time: '',
      reason: ''
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Nouveau Rendez-vous
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Médecin
            </Label>
            <Input
              id="doctor"
              placeholder="Nom du médecin"
              value={formData.doctor}
              onChange={(e) => handleInputChange('doctor', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialty" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Spécialité
            </Label>
            <Input
              id="specialty"
              placeholder="Spécialité médicale"
              value={formData.specialty}
              onChange={(e) => handleInputChange('specialty', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Heure
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Motif
            </Label>
            <Input
              id="reason"
              placeholder="Motif de la consultation"
              value={formData.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleReset} className="flex-1">
              Réinitialiser
            </Button>
            <Button type="submit" className="flex-1">
              Rechercher
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
