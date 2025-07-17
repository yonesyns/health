import React, { useState } from 'react'
import {
    ArrowLeft,
    Star,
    MapPin,
    Clock,
    Phone,
    Calendar,
    Shield,
    Video,
    User,
    CreditCard,
    CheckCircle,
    Award,
    Languages,
    MapIcon,
    Info
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { AppointmentBooking } from '../appointments/AppointmentBooking'

// Mock doctor data
const doctorData = {
    1: {
        id: 1,
        name: 'Dr. Isabelle Boublil',
        specialty: 'Médecin généraliste',
        image: 'https://media.doctolib.com/image/upload/q_auto:eco,f_auto,w_1024,h_700,c_limit/fmzsg2tacyws32ohnuuy.jpg',
        location: 'Paris',
        fullAddress: '6 Rue Pelleport, 75020 Paris',
        phone: '01 47 97 33 10',
        rating: 4.9,
        reviewCount: 234,
        rpps: '10003703658',
        adeli: '751740242',
        siren: '415313717',
        acceptsNewPatients: true,
        teleconsultation: true,
        conventioned: 'secteur 1',
        carteVitale: true,
        languages: ['Français', 'Anglais'],
        education: [
            {
                year: '1997',
                degree: "Diplôme d'État de docteur en médecine",
                institution: 'Sorbonne Université Campus Pierre et Marie Curie (UPMC)'
            }
        ],
        schedule: {
            today: '07h30 - 15h30',
            emergency: "En cas d'urgence, contactez le 15 (Samu)",
            weekly: {
                'Lundi': '07h30 - 15h30',
                'Mardi': '07h30 - 15h30',
                'Mercredi': '07h30 - 15h30',
                'Jeudi': '07h45 - 15h00',
                'Vendredi': '07h30 - 15h30',
                'Samedi': '07h30 - 13h30'
            }
        },
        services: [
            { name: 'Consultation de médecine générale', price: '30 €' },
            { name: 'Consultation de pédiatrie (0-6 ans)', price: '35 €' },
            { name: 'Consultation vidéo', price: '25 €' },
            { name: 'Enfant (0-6 ans) - Consultation vidéo', price: '30 €' }
        ],
        transportInfo: {
            tramway: 'Tramway - Porte De Bagnolet (ligne T3B)',
            metro: 'Métro - Porte de Bagnolet (ligne 3)',
            bus: 'Bus - Pelleport - Bagnolet (lignes 501 et 76)',
            parking: '158 Rue de Bagnolet, Paris'
        },
        practicalInfo: {
            floor: 'Rez-de-chaussée'
        },
        videoConsultationBenefits: [
            'Obtenez un rendez-vous plus rapidement',
            'Consultez votre soignant de chez vous',
            'Échangez des documents en toute sécurité'
        ],
        faq: [
            "Quelle est l'adresse de Dr Isabelle Boublil ?",
            "Quels sont les horaires d'ouverture de Dr Isabelle Boublil ?",
            'Quels sont les moyens de paiement acceptés par Dr Isabelle Boublil ?'
        ]
    }
}

interface DoctorProfileProps {
    doctorId: number
    onBack: () => void
    onAppointmentBooking: () => void
    isInDialog?: boolean
}

export function DoctorProfile({ doctorId = 1, onBack, onAppointmentBooking, isInDialog = false }: DoctorProfileProps) {
    const [activeTab, setActiveTab] = useState('essential')
    const [showAppointmentBooking, setShowAppointmentBooking] = useState(false)
    const doctor = doctorData[doctorId] || doctorData[1]

    const handleAppointmentBooking = () => {
        setShowAppointmentBooking(true)
        if (onAppointmentBooking) {
            onAppointmentBooking()
        }
    }

    const handleBackToProfile = () => {
        setShowAppointmentBooking(false)
    }

    const handleCloseAppointmentBooking = () => {
        setShowAppointmentBooking(false)
    }

    if (showAppointmentBooking) {
        return (
            <AppointmentBooking
                doctorName={doctor.name}
                isInDialog={isInDialog}
                onGoBack={handleBackToProfile}
                onClose={handleCloseAppointmentBooking}
            />
        )
    }

    return (
        <div className={`${isInDialog ? '' : 'bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen'}`}>
            {/* Enhanced Header Section */}
            {!isInDialog && (
                <div className="bg-white shadow-sm border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 py-8">
                        <Button
                            variant="ghost"
                            onClick={onBack}
                            className="mb-6 text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Retour à la recherche
                        </Button>

                        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
                                <AvatarImage src={doctor.image} alt={doctor.name} className="object-cover" />
                                <AvatarFallback className="text-xl font-semibold bg-blue-500 text-white">
                                    {doctor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{doctor.name}</h1>
                                <p className="text-xl text-gray-600 mb-4">{doctor.specialty}</p>

                                <div className="flex gap-3 flex-wrap mb-4">
                                    <Badge variant="outline" className="gap-2 px-3 py-1 bg-yellow-50 border-yellow-200 text-yellow-800">
                                        <Star className="h-4 w-4 fill-current" />
                                        {doctor.rating} • {doctor.reviewCount} avis
                                    </Badge>
                                    {doctor.acceptsNewPatients && (
                                        <Badge className="gap-2 px-3 py-1 bg-green-100 text-green-800 border-green-200">
                                            <CheckCircle className="h-4 w-4" />
                                            Nouveaux patients
                                        </Badge>
                                    )}
                                    {doctor.teleconsultation && (
                                        <Badge variant="outline" className="gap-2 px-3 py-1 bg-blue-50 border-blue-200 text-blue-800">
                                            <Video className="h-4 w-4" />
                                            Téléconsultation
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        <span className="text-sm">{doctor.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4" />
                                        <span className="text-sm">Ouvert aujourd&apos;hui • {doctor.schedule?.today}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Compact Header for Dialog */}
            {isInDialog && (
                <div className="bg-white border-b border-gray-100 p-6">
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-gray-100 shadow-md">
                            <AvatarImage src={doctor.image} alt={doctor.name} />
                            <AvatarFallback className="bg-blue-500 text-white font-semibold">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900">{doctor.name}</h2>
                            <p className="text-gray-600 mb-2">{doctor.specialty}</p>
                            <div className="flex gap-2 flex-wrap">
                                <Badge variant="outline" className="gap-1 text-xs bg-yellow-50 border-yellow-200 text-yellow-800">
                                    <Star className="h-3 w-3 fill-current" />
                                    {doctor.rating} ({doctor.reviewCount})
                                </Badge>
                                {doctor.acceptsNewPatients && (
                                    <Badge className="text-xs bg-green-100 text-green-800">Nouveaux patients</Badge>
                                )}
                                {doctor.teleconsultation && (
                                    <Badge variant="outline" className="gap-1 text-xs bg-blue-50 border-blue-200 text-blue-800">
                                        <Video className="h-3 w-3" />
                                        Téléconsultation
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className={`${isInDialog ? 'max-w-full' : 'max-w-7xl'} mx-auto px-6 py-8`}>
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
                    {/* Enhanced Main Content Area */}
                    <div className="space-y-6">
                        <Card className="shadow-sm border-0 ring-1 ring-gray-100">
                            <CardContent className="p-0">
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                    <div className="border-b border-gray-100">
                                        <TabsList className="grid w-full grid-cols-5 h-12 bg-transparent rounded-none">
                                            <TabsTrigger
                                                value="essential"
                                                className="data-[state=active]:bg-white-10 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none font-medium"
                                            >
                                                L&apos;essentiel
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="map"
                                                className="data-[state=active]:bg-white-10 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none font-medium"
                                            >
                                                Carte
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="hours"
                                                className="data-[state=active]:bg-white-10 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none font-medium"
                                            >
                                                Horaires
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="presentation"
                                                className="data-[state=active]:bg-white-10 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none font-medium"
                                            >
                                                Présentation
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="prices"
                                                className="data-[state=active]:bg-white-10 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600 rounded-none font-medium"
                                            >
                                                Tarifs
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="p-8">
                                        <TabsContent value="essential" className="mt-0 space-y-8">
                                            {/* Enhanced Video Consultation Card */}
                                            {doctor.teleconsultation && (
                                                <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-blue-100">
                                                    <CardContent className="p-6">
                                                        <div className="flex items-start gap-4 mb-6">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <Video className="h-6 w-6 text-blue-600" />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                                    Consultation vidéo disponible
                                                                </h3>
                                                                <p className="text-gray-600 text-sm">
                                                                    {doctor.name} vous propose des consultations à distance
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="grid md:grid-cols-3 gap-4 mb-6">
                                                            {doctor.videoConsultationBenefits.map((benefit, index) => (
                                                                <div key={index} className="flex items-center gap-3 p-3 bg-white/70 rounded-lg">
                                                                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                                    <span className="text-sm font-medium">{benefit}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <Button variant="link" className="p-0 h-auto text-blue-600 font-medium">
                                                            En savoir plus sur la téléconsultation →
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            )}

                                            {/* Enhanced Information Grid */}
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <Card className="border-0 ring-1 ring-gray-100">
                                                    <CardHeader className="pb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                <CreditCard className="h-5 w-5 text-green-600" />
                                                            </div>
                                                            <h3 className="font-semibold text-gray-900">Tarifs et remboursement</h3>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-4">
                                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                            <span className="font-medium">Conventionné {doctor.conventioned}</span>
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                                            <span className="font-medium">Carte Vitale acceptée</span>
                                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                                        </div>
                                                        <Button
                                                            variant="link"
                                                            className="mt-4 p-0 h-auto font-medium text-blue-600 hover:text-blue-800 transition-colors"
                                                            onClick={() => setActiveTab('prices')}
                                                        >
                                                            Voir tous les tarifs →
                                                        </Button>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-0 ring-1 ring-gray-100">
                                                    <CardHeader className="pb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-purple-100 rounded-lg">
                                                                <CreditCard className="h-5 w-5 text-purple-600" />
                                                            </div>
                                                            <h3 className="font-semibold text-gray-900">Moyens de paiement</h3>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-3">
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <div className="h-3 w-3 bg-green-500 rounded-full" />
                                                            <span className="font-medium">Espèces</span>
                                                        </div>
                                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                            <div className="h-3 w-3 bg-green-500 rounded-full" />
                                                            <span className="font-medium">Carte bancaire</span>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="map" className="mt-0">
                                            <Card className="border-0 ring-1 ring-gray-100">
                                                <CardHeader>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-red-100 rounded-lg">
                                                            <MapPin className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <h3 className="font-semibold text-gray-900">Localisation et accès</h3>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="grid md:grid-cols-2 gap-8">
                                                        <div className="space-y-6">
                                                            <div className="p-4 bg-gray-50 rounded-lg">
                                                                <h4 className="font-semibold mb-3 flex items-center gap-2">
                                                                    <MapIcon className="h-4 w-4" />
                                                                    Cabinet médical
                                                                </h4>
                                                                <p className="text-gray-700 font-medium">{doctor.fullAddress}</p>
                                                                <span className="text-sm text-gray-500 mt-1 block">{doctor.practicalInfo?.floor}</span>
                                                            </div>

                                                            <div>
                                                                <h4 className="font-semibold mb-4 flex items-center gap-2">
                                                                    <Clock className="h-4 w-4" />
                                                                    Moyens de transport
                                                                </h4>
                                                                <div className="space-y-3">
                                                                    {[
                                                                        { type: 'Tramway', info: doctor.transportInfo?.tramway },
                                                                        { type: 'Métro', info: doctor.transportInfo?.metro },
                                                                        { type: 'Bus', info: doctor.transportInfo?.bus }
                                                                    ].map((transport, index) => (
                                                                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                                                                            <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                                            <div>
                                                                                <span className="font-medium text-sm text-blue-800">{transport.type}</span>
                                                                                <p className="text-sm text-gray-600">{transport.info}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="p-4 bg-yellow-50 rounded-lg">
                                                                <h4 className="font-semibold mb-2 text-yellow-800">Parking public</h4>
                                                                <span className="text-gray-700">{doctor.transportInfo?.parking}</span>
                                                            </div>
                                                        </div>

                                                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center h-80 border border-gray-200">
                                                            <div className="text-center">
                                                                <MapPin className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                                                <p className="text-gray-600 mb-4 font-medium">Carte interactive</p>
                                                                <Button variant="outline" size="sm" className="font-medium">
                                                                    Afficher la carte
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="hours" className="mt-0">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <Card className="border-0 ring-1 ring-gray-100">
                                                    <CardHeader>
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-blue-100 rounded-lg">
                                                                <Clock className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <h3 className="font-semibold text-gray-900">Horaires d&apos;ouverture</h3>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className="space-y-3">
                                                            {Object.entries(doctor.schedule?.weekly || {}).map(([day, hours]) => (
                                                                <div key={day} className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-lg">
                                                                    <span className="font-medium text-gray-900">{day}</span>
                                                                    <span className="text-gray-600 font-medium">{hours}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="mt-6 pt-6 border-t border-gray-200">
                                                            <div className="p-4 bg-red-50 rounded-lg">
                                                                <h4 className="font-semibold mb-2 text-red-800 flex items-center gap-2">
                                                                    <Phone className="h-4 w-4" />
                                                                    Contact d&apos;urgence
                                                                </h4>
                                                                <p className="text-gray-700">{doctor.schedule?.emergency}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>

                                                <Card className="border-0 ring-1 ring-gray-100">
                                                    <CardHeader>
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-green-100 rounded-lg">
                                                                <Phone className="h-5 w-5 text-green-600" />
                                                            </div>
                                                            <h3 className="font-semibold text-gray-900">Coordonnées</h3>
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="space-y-6">
                                                        <div className="flex gap-4 p-4 bg-green-50 rounded-lg">
                                                            <Phone className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                                                            <div>
                                                                <strong className="block text-gray-900 mb-1">Téléphone</strong>
                                                                <p className="text-gray-700 font-medium">{doctor.phone}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                                                            <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                                            <div>
                                                                <strong className="block text-gray-900 mb-1">Adresse</strong>
                                                                <p className="text-gray-700 font-medium">{doctor.fullAddress}</p>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="presentation" className="mt-0">
                                            <Card className="border-0 ring-1 ring-gray-100">
                                                <CardHeader>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                                            <User className="h-5 w-5 text-indigo-600" />
                                                        </div>
                                                        <h3 className="font-semibold text-gray-900">Présentation</h3>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-8">
                                                    <div className="prose max-w-none">
                                                        <div className="p-6 bg-gray-50 rounded-lg">
                                                            <p className="text-gray-700 leading-relaxed mb-4">
                                                                Le docteur <strong>{doctor.name?.split(' ').slice(1).join(' ')}</strong> vous accueille dans
                                                                son cabinet médical à <strong>{doctor.location}</strong>.
                                                            </p>
                                                            <p className="text-gray-700 leading-relaxed">
                                                                Il/Elle consulte uniquement sur rendez-vous : consultation physique au cabinet
                                                                ou téléconsultation lorsque le motif le permet.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-3 mb-4">
                                                            <Languages className="h-5 w-5 text-blue-600" />
                                                            <h4 className="font-semibold text-gray-900">Langues parlées</h4>
                                                        </div>
                                                        <div className="flex gap-3">
                                                            {doctor.languages?.map((lang, index) => (
                                                                <Badge key={index} variant="outline" className="px-3 py-1 bg-blue-50 border-blue-200 text-blue-800">
                                                                    {lang}
                                                                </Badge>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center gap-3 mb-6">
                                                            <div className="p-2 bg-amber-100 rounded-lg">
                                                                <Award className="h-5 w-5 text-amber-600" />
                                                            </div>
                                                            <h4 className="font-semibold text-gray-900">Diplômes et formations</h4>
                                                        </div>
                                                        <div className="space-y-4">
                                                            {doctor.education?.map((edu, index) => (
                                                                <div key={index} className="flex gap-4 p-4 bg-amber-50 rounded-lg border border-amber-100">
                                                                    <Badge variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 font-semibold">
                                                                        {edu.year}
                                                                    </Badge>
                                                                    <div>
                                                                        <strong className="block text-gray-900 mb-1">{edu.degree}</strong>
                                                                        <p className="text-gray-600">{edu.institution}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>

                                        <TabsContent value="prices" className="mt-0">
                                            <Card className="border-0 ring-1 ring-gray-100">
                                                <CardHeader>
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-emerald-100 rounded-lg">
                                                            <CreditCard className="h-5 w-5 text-emerald-600" />
                                                        </div>
                                                        <h3 className="font-semibold text-gray-900">Tarifs et informations</h3>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-8">
                                                    <div>
                                                        <h4 className="font-semibold mb-4 text-gray-900">Services et tarifs</h4>
                                                        <div className="space-y-3">
                                                            {doctor.services?.map((service, index) => (
                                                                <div key={index} className="flex justify-between items-center py-4 px-5 bg-gray-50 rounded-lg border border-gray-100">
                                                                    <span className="font-medium text-gray-900">{service.name}</span>
                                                                    <strong className="text-lg text-emerald-600">{service.price}</strong>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                                        <div className="flex items-start gap-3">
                                                            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                                            <div>
                                                                <h5 className="font-semibold text-blue-900 mb-2">Information importante</h5>
                                                                <p className="text-sm text-blue-800 leading-relaxed">
                                                                    Ces honoraires vous sont communiqués à titre indicatif par le soignant.
                                                                    Ils peuvent varier selon le type de soins finalement réalisés en cabinet.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold mb-6 text-gray-900">Informations légales</h4>
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                                                                <strong className="block text-sm mb-3 text-gray-900">Numéro RPPS</strong>
                                                                <span className="text-gray-600 font-mono text-sm bg-white px-3 py-2 rounded border">
                                                                    {doctor.rpps}
                                                                </span>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                                                                <strong className="block text-sm mb-3 text-gray-900">Numéro ADELI</strong>
                                                                <span className="text-gray-600 font-mono text-sm bg-white px-3 py-2 rounded border">
                                                                    {doctor.adeli}
                                                                </span>
                                                            </div>
                                                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-lg p-6 text-center">
                                                                <strong className="block text-sm mb-3 text-gray-900">SIREN</strong>
                                                                <span className="text-gray-600 font-mono text-sm bg-white px-3 py-2 rounded border">
                                                                    {doctor.siren}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <h4 className="font-semibold mb-6 text-gray-900">Questions fréquentes</h4>
                                                        <Accordion type="single" collapsible className="space-y-3">
                                                            {doctor.faq?.map((question, index) => (
                                                                <AccordionItem
                                                                    key={index}
                                                                    value={`item-${index}`}
                                                                    className="border border-gray-200 rounded-lg px-6 bg-white"
                                                                >
                                                                    <AccordionTrigger className="font-medium text-gray-900 hover:text-blue-600 transition-colors">
                                                                        {question}
                                                                    </AccordionTrigger>
                                                                    <AccordionContent className="text-gray-600 leading-relaxed pb-4">
                                                                        Réponse détaillée à la question fréquemment posée. Cette section contiendrait
                                                                        des informations spécifiques selon la question posée.
                                                                    </AccordionContent>
                                                                </AccordionItem>
                                                            ))}
                                                        </Accordion>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </TabsContent>
                                    </div>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Enhanced Sidebar */}
                    <div className="space-y-6">
                        {/* Main Action Card */}
                        <Card className="shadow-lg border-0 ring-1 ring-gray-100 ">
                            <CardHeader className="pb-4">
                                <h3 className="font-bold text-gray-900 text-lg">Prendre rendez-vous</h3>
                                <p className="text-sm text-gray-600">Réservez votre consultation en quelques clics</p>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-green-100 rounded-lg flex-shrink-0 mt-0.5">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900 block leading-tight">
                                                Nouveaux patients acceptés
                                            </span>
                                            <span className="text-xs text-gray-500 mt-0.5 block">
                                                sur MediConnect
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0 mt-0.5">
                                            <MapPin className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900 block leading-tight">
                                                Cabinet médical
                                            </span>
                                            <span className="text-xs text-gray-500 mt-0.5 block">
                                                {doctor.fullAddress}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0 mt-0.5">
                                            <Video className="h-4 w-4 text-purple-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900 block leading-tight">
                                                Téléconsultation
                                            </span>
                                            <span className="text-xs text-gray-500 mt-0.5 block">
                                                disponible
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="p-2 bg-orange-100 rounded-lg flex-shrink-0 mt-0.5">
                                            <Clock className="h-4 w-4 text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <span className="text-sm font-medium text-gray-900 block leading-tight">
                                                Aujourd&apos;hui
                                            </span>
                                            <span className="text-xs text-gray-500 mt-0.5 block">
                                                {doctor.schedule?.today}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAppointmentBooking}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                    size="lg"
                                >
                                    <Calendar className="mr-2 h-5 w-5" />
                                    PRENDRE RENDEZ-VOUS
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Quick Info Card */}
                        <Card className="border-0 ring-1 ring-gray-100">
                            <CardHeader className="flex flex-row items-center justify-between pb-3">
                                <h3 className="font-semibold text-gray-900">Horaires du jour</h3>
                                <Button
                                    variant="link"
                                    size="sm"
                                    onClick={() => setActiveTab('hours')}
                                    className="p-0 h-auto text-blue-600 font-medium text-xs"
                                >
                                    Voir tout →
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                        <span className="text-sm font-medium text-gray-900">Aujourd&apos;hui</span>
                                        <strong className="text-green-700">{doctor.schedule?.today}</strong>
                                    </div>
                                    <div className="p-3 bg-red-50 rounded-lg">
                                        <p className="text-xs text-red-800 leading-relaxed">
                                            <strong>Urgences:</strong> {doctor.schedule?.emergency}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Rating Card */}
                        <Card className="border-0 ring-1 ring-gray-100">
                            <CardContent className="p-6">
                                <div className="text-center">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Star className="h-6 w-6 fill-yellow-400 text-yellow-400" />
                                        <span className="text-2xl font-bold text-gray-900">{doctor.rating}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Basé sur <strong>{doctor.reviewCount} avis</strong> patients
                                    </p>
                                    <div className="flex justify-center space-x-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= Math.floor(doctor.rating)
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <Button variant="outline" size="sm" className="text-xs">
                                        Voir les avis
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}