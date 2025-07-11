import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity } from 'lucide-react'

export function ActivityPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Journal d'Activité</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Activités Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Page en développement</p>
            <p>Cette page affichera le journal des activités du système.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}