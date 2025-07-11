import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar, Shield, Edit } from 'lucide-react'

export function ProfilePage() {
  const user = {
    name: 'Admin User',
    email: 'admin@cyberlab.com',
    role: 'Administrateur',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15 14:30',
    projectsCount: 12,
    deploymentsCount: 45
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Modifier
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Informations personnelles */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations Personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-4">
                <AvatarFallback className="text-xl">AU</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg">{user.name}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <Badge className="mt-2">{user.role}</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Membre depuis {user.createdAt}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-muted-foreground" />
                <span>Dernière connexion: {user.lastLogin}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistiques */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Statistiques d'Utilisation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">
                  {user.projectsCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Projets Créés
                </div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-3xl font-bold text-primary mb-2">
                  {user.deploymentsCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Déploiements Effectués
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Préférences */}
      <Card>
        <CardHeader>
          <CardTitle>Préférences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Notifications Email</h4>
                <p className="text-sm text-muted-foreground">
                  Recevoir des notifications pour les déploiements
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Mode Expert</h4>
                <p className="text-sm text-muted-foreground">
                  Afficher les options avancées de configuration
                </p>
              </div>
              <input type="checkbox" className="toggle" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Sauvegarde Automatique</h4>
                <p className="text-sm text-muted-foreground">
                  Sauvegarder automatiquement les configurations
                </p>
              </div>
              <input type="checkbox" defaultChecked className="toggle" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}