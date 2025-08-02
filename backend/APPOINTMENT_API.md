# API des Rendez-vous - Nouveaux Champs

## Nouveaux champs ajoutés

### 1. `visitType` (Type de visite)
- **Type**: Enum
- **Valeurs possibles**:
  - `in_person` : Consultation au cabinet
  - `teleconsultation` : Téléconsultation
- **Valeur par défaut**: `in_person`
- **Obligatoire**: Non

### 2. `hasConsultedBefore` (A déjà consulté ce médecin)
- **Type**: Boolean
- **Description**: Indique si le patient a déjà consulté ce médecin auparavant
- **Valeur par défaut**: `false`
- **Obligatoire**: Non

## Exemples d'utilisation

### Créer un rendez-vous avec les nouveaux champs

```json
POST /appointments
{
  "date": "2025-01-20T14:00:00.000Z",
  "patientId": "1",
  "doctorId": "2",
  "notes": "Consultation de suivi",
  "visitType": "teleconsultation",
  "hasConsultedBefore": true
}
```

### Créer un rendez-vous au cabinet (valeurs par défaut)

```json
POST /appointments
{
  "date": "2025-01-20T14:00:00.000Z",
  "patientId": "1",
  "doctorId": "2",
  "notes": "Première consultation"
}
```

### Mettre à jour un rendez-vous

```json
PUT /appointments/1
{
  "visitType": "in_person",
  "hasConsultedBefore": false
}
```

## Réponse de l'API

Les rendez-vous retournés incluront maintenant ces nouveaux champs :

```json
{
  "success": true,
  "data": {
    "id": 1,
    "patientId": 1,
    "doctorId": 2,
    "scheduledAt": "2025-01-20T14:00:00.000Z",
    "status": "scheduled",
    "notes": "Consultation de suivi",
    "visitType": "teleconsultation",
    "hasConsultedBefore": true,
    "createdAt": "2025-01-15T10:00:00.000Z",
    "updatedAt": "2025-01-15T10:00:00.000Z"
  }
}
```

## Migration de base de données

Pour appliquer ces changements à votre base de données, exécutez :

```bash
cd backend
npx prisma migrate dev --name add_visit_type_and_consultation_history
```

## Validation

- `visitType` doit être l'une des valeurs de l'énumération : `in_person` ou `teleconsultation`
- `hasConsultedBefore` doit être un booléen (`true` ou `false`)
- Les deux champs sont optionnels lors de la création
- Les valeurs par défaut sont appliquées si les champs ne sont pas fournis 