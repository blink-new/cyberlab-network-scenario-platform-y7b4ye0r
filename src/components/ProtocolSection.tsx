import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Info, CheckCircle, Loader2, AlertTriangle, RotateCw } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getProtocols, createProtocol } from '@/services/api'
import { ProtocolFormDialog } from './ProtocolFormDialog'

interface Protocol {
  id: string
  name: string
  version: string
  description: string
  category: string
  layer: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  features: string[]
  tools: Array<{
    name: string
    supported: boolean
    note?: string
  }>
}

interface ProtocolSectionProps {
  onSelectionChange?: (protocol: Protocol | null) => void
}

export function ProtocolSection({ onSelectionChange }: ProtocolSectionProps) {
  const { t } = useLanguage()
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const fetchProtocols = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsRetrying(false)
    try {
      const response = await getProtocols()
      setProtocols(Array.isArray(response.data) ? response.data : [])
    } catch (fetchErr: unknown) {
      if (fetchErr instanceof Error) {
        setError(t('error.protocolsFetchFailed') + ': ' + fetchErr.message)
      } else {
        setError(t('error.protocolsFetchFailed') + ': An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchProtocols()
  }, [fetchProtocols])

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedProtocol)
    }
  }, [selectedProtocol, onSelectionChange])

  const handleProtocolSubmit = async (protocolData: {
    name: string
    version: string
    description: string
    tags: string[]
    category: string
    layer: string
    difficulty_level: 'beginner' | 'intermediate' | 'advanced'
    features: string[]
    tools: Array<{
      name: string
      supported: boolean
      note?: string
    }>
  }) => {
    try {
      // Create the protocol with the new format
      const newProtocol = {
        ...protocolData,
        id: `protocol_${Date.now()}`,
        tags: protocolData.tags || [],
        features: protocolData.features || [],
        tools: protocolData.tools || []
      }
      
      const response = await createProtocol(newProtocol)
      setProtocols(prev => [...prev, response.data])
      setIsFormOpen(false)
    } catch (createErr: unknown) {
      if (createErr instanceof Error) {
        setError(t('error.protocolCreateFailed') + ': ' + createErr.message)
      } else {
        setError(t('error.protocolCreateFailed') + ': An unknown error occurred')
      }
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    setError(null)
    try {
      const response = await getProtocols()
      setProtocols(Array.isArray(response.data) ? response.data : [])
      setError(null)
    } catch (retryErr: unknown) {
      if (retryErr instanceof Error) {
        setError(t('error.protocolsFetchFailed') + ': ' + retryErr.message)
      } else {
        setError(t('error.protocolsFetchFailed') + ': An unknown error occurred')
      }
    } finally {
      setIsRetrying(false)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyTranslation = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant'
      case 'intermediate': return 'Intermédiaire'
      case 'advanced': return 'Avancé'
      default: return difficulty
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('protocol.title')}</CardTitle>
        <Button size="sm" onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          {t('protocol.new')}
        </Button>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground mr-2" />
            <span>{t('loading')}</span>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-destructive">
            <div className="flex items-center mb-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
            </div>
            <Button onClick={handleRetry} disabled={isRetrying}>
              {isRetrying ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : (
                <RotateCw className="h-4 w-4 mr-2" />
              )}
              {t('retry')}
            </Button>
          </div>
        )}
        {!loading && !error && protocols.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Info className="h-5 w-5 mr-2" />
            <span>{t('empty.protocols') || 'Aucun protocole trouvé.'}</span>
          </div>
        )}
        {!loading && !error && protocols.length > 0 && (
          <div className="grid gap-3">
            {protocols.map((protocol) => (
              <div
                key={protocol.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  selectedProtocol?.id === protocol.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedProtocol(protocol)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{protocol.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {protocol.version}
                      </Badge>
                    </div>
                    {selectedProtocol?.id === protocol.id && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(protocol.difficulty_level)}>
                      {getDifficultyTranslation(protocol.difficulty_level)}
                    </Badge>
                    {protocol.category && (
                      <Badge variant="secondary">{protocol.category}</Badge>
                    )}
                    {protocol.layer && (
                      <Badge variant="outline">{protocol.layer}</Badge>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {protocol.description}
                </p>
                {protocol.tags && protocol.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {protocol.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {selectedProtocol && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-4 w-4 text-primary" />
              <span className="font-medium">{t('protocol.selected')}: {selectedProtocol.name}</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedProtocol.description}
            </p>
            {selectedProtocol.features && selectedProtocol.features.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Fonctionnalités: </span>
                <span className="text-sm">{selectedProtocol.features.join(', ')}</span>
              </div>
            )}
            {selectedProtocol.tools && selectedProtocol.tools.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium">Outils supportés: </span>
                <span className="text-sm">
                  {selectedProtocol.tools.filter(tool => tool.supported).map(tool => tool.name).join(', ')}
                </span>
              </div>
            )}
          </div>
        )}

        <ProtocolFormDialog
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          onSubmit={handleProtocolSubmit}
        />
      </CardContent>
    </Card>
  )
}