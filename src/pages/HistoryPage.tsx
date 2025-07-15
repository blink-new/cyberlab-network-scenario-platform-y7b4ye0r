import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Play, 
  Edit, 
  Trash2, 
  Calendar, 
  Network, 
  Activity
} from 'lucide-react'

interface HistoryItem {
  id: string
  name: string
  protocol: string
  architecture: string
  scenario: string
  status: 'Succès' | 'Échec' | 'En cours'
  createdAt: string
  lastUsed: string
  duration: string
}

const mockHistory: HistoryItem[] = [
  {
    id: '1',
    name: 'Test TCP/IP Réseau Étoile',
    protocol: 'TCP/IP',
    architecture: 'Réseau en Étoile',
    scenario: 'Test de Connectivité',
    status: 'Succès',
    createdAt: '2024-01-15',
    lastUsed: '2024-01-15 14:30',
    duration: '5 min'
  },
  {
    id: '2',
    name: 'OSPF Multi-Zone Performance',
    protocol: 'OSPF',
    architecture: 'Réseau Maillé',
    scenario: 'Simulation de Charge',
    status: 'Succès',
    createdAt: '2024-01-14',
    lastUsed: '2024-01-14 16:45',
    duration: '30 min'
  },
  {
    id: '3',
    name: 'BGP Résilience Test',
    protocol: 'BGP',
    architecture: 'Réseau Complexe',
    scenario: 'Test de Résilience',
    status: 'Échec',
    createdAt: '2024-01-13',
    lastUsed: '2024-01-13 10:15',
    duration: '45 min'
  },
  {
    id: '4',
    name: 'TCP/IP Linéaire Basic',
    protocol: 'TCP/IP',
    architecture: 'Réseau Linéaire',
    scenario: 'Test de Connectivité',
    status: 'En cours',
    createdAt: '2024-01-15',
    lastUsed: '2024-01-15 15:00',
    duration: '5 min'
  }
]

export function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Tous')

  const filteredHistory = mockHistory.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.architecture.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'Tous' || item.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Succès': return 'bg-green-100 text-green-800'
      case 'Échec': return 'bg-red-100 text-red-800'
      case 'En cours': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Historique des Architectures</h1>
        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher dans l'historique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Succès">Succès</option>
            <option value="Échec">Échec</option>
            <option value="En cours">En cours</option>
          </select>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-green-600" />
              <div>
                <div className="text-2xl font-bold">18</div>
                <div className="text-xs text-muted-foreground">Succès</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-red-600" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">Échecs</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded-full bg-blue-600" />
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-xs text-muted-foreground">En cours</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste de l'historique */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des Déploiements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Protocole:</span> {item.protocol}
                    </div>
                    <div>
                      <span className="font-medium">Architecture:</span> {item.architecture}
                    </div>
                    <div>
                      <span className="font-medium">Scénario:</span> {item.scenario}
                    </div>
                    <div>
                      <span className="font-medium">Durée:</span> {item.duration}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Créé le {item.createdAt}
                    </div>
                    <div className="flex items-center gap-1">
                      <Activity className="h-3 w-3" />
                      Dernière utilisation: {item.lastUsed}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Play className="h-3 w-3 mr-1" />
                    Relancer
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-3 w-3 mr-1" />
                    Modifier
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-3 w-3 mr-1" />
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {filteredHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Network className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Aucun élément trouvé dans l'historique</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}