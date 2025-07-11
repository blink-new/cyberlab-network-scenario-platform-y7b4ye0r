import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Network } from 'lucide-react'

export function NetworksPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Gestion des Réseaux</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            Réseaux Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Network className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Page en développement</p>
            <p>Cette page permettra de gérer les configurations réseau.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}