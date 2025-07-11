import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Loader2, Plus, Info, CheckCircle } from 'lucide-react'
import { ArchitectureFormDialog } from './ArchitectureFormDialog'

export function ArchitectureSection() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [architectures, setArchitectures] = useState([])
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState(null)

  // Simule l'ajout d'une architecture (à remplacer par appel API plus tard)
  const handleSubmit = (arch) => {
    setArchitectures(prev => [...prev, { ...arch, id: `arch_${Date.now()}` }])
    setIsFormOpen(false)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Architectures</CardTitle>
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />Nouvelle architecture
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground mr-2" />
            <span>Chargement…</span>
          </div>
        )}
        {!loading && architectures.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Info className="h-5 w-5 mr-2" />
            <span>Aucune architecture trouvée.</span>
          </div>
        )}
        {!loading && architectures.length > 0 && (
          <div className="grid gap-3">
            {architectures.map((arch) => (
              <div
                key={arch.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${selected?.id === arch.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                onClick={() => setSelected(arch)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{arch.name}</h3>
                    {selected?.id === arch.id && <CheckCircle className="h-4 w-4 text-primary" />}
                  </div>
                  <span className="text-xs text-muted-foreground">{arch.protocol}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{arch.description}</p>
                <div className="flex flex-wrap gap-2">
                  {arch.nodes && arch.nodes.map((node, idx) => (
                    <span key={idx} className="text-xs bg-muted px-2 py-1 rounded">{node.name} ({node.role})</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {selected && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium">Architecture sélectionnée : {selected.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">{selected.description}</p>
            <div className="text-xs text-muted-foreground mb-2">Protocole : {selected.protocol}</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {selected.nodes && selected.nodes.map((node, idx) => (
                <span key={idx} className="bg-muted px-2 py-1 rounded">{node.name} ({node.role})</span>
              ))}
            </div>
            {/* Placeholder pour visualisation future */}
            <div className="mt-2 border rounded bg-white/80 p-2 text-center text-muted-foreground text-xs">[Visualisation de l'architecture ici]</div>
          </div>
        )}
        <ArchitectureFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} onSubmit={handleSubmit} />
      </CardContent>
    </Card>
  )
}
