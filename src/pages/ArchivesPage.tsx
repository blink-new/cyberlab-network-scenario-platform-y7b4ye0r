import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Archive } from 'lucide-react'

export function ArchivesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Archives</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Configurations Archivées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Archive className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">Page en développement</p>
            <p>Cette page permettra de consulter les configurations archivées.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}