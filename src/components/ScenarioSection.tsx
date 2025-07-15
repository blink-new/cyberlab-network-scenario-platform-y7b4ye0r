import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Plus, Play, Clock, CheckCircle, Loader2, AlertTriangle, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getScenarios, createScenario } from '@/services/api'

interface Scenario {
  id: string
  name: string
  testType: string
  description: string
  complexity: 'Basic' | 'Intermediate' | 'Advanced'
  duration?: number
  parameters?: Record<string, unknown>
}

interface ScenarioSectionProps {
  onSelectionChange?: (scenario: Scenario | null) => void
}

export function ScenarioSection({ onSelectionChange }: ScenarioSectionProps) {
  const { t } = useLanguage()
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newScenario, setNewScenario] = useState({
    name: '',
    testType: 'ping',
    description: '',
    complexity: 'Basic' as Scenario['complexity'],
    duration: 300
  })

  const fetchScenarios = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await getScenarios()
      setScenarios(Array.isArray(response.data) ? response.data : [])
    } catch (e) {
      setError(t('error.scenariosFetchFailed') || 'Failed to fetch scenarios')
    } finally {
      setLoading(false)
      setRetrying(false)
    }
  }, [t])

  useEffect(() => {
    fetchScenarios()
  }, [fetchScenarios])

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedScenario)
    }
  }, [selectedScenario, onSelectionChange])

  const handleRetry = () => {
    setRetrying(true)
    setError(null)
    fetchScenarios()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await createScenario(newScenario)
      setScenarios([...scenarios, response.data])
      setIsFormOpen(false)
      setNewScenario({
        name: '',
        testType: 'ping',
        description: '',
        complexity: 'Basic',
        duration: 300
      })
    } catch (e) {
      setError(t('error.scenarioCreateFailed') || 'Failed to create scenario')
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic': return 'bg-green-100 text-green-800'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'Advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getComplexityTranslation = (complexity: string) => {
    switch (complexity) {
      case 'Basic': return t('scenario.complexity.basic')
      case 'Intermediate': return t('scenario.complexity.intermediate')
      case 'Advanced': return t('scenario.complexity.advanced')
      default: return complexity
    }
  }

  const getTestTypeTranslation = (testType: string) => {
    switch (testType) {
      case 'ping': return t('testType.ping')
      case 'load': return t('testType.load')
      case 'fault': return t('testType.fault')
      default: return testType
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    if (minutes === 0) {
      return `${remainingSeconds}s`
    }
    return `${minutes}m ${remainingSeconds > 0 ? remainingSeconds + 's' : ''}`
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{t('scenario.title')}</CardTitle>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              {t('scenario.new')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Créer un nouveau scénario</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nom du scénario</Label>
                <Input
                  id="name"
                  value={newScenario.name}
                  onChange={(e) => setNewScenario(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="testType">Type de test</Label>
                <select
                  id="testType"
                  value={newScenario.testType}
                  onChange={(e) => setNewScenario(prev => ({ ...prev, testType: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="ping">{t('testType.ping')}</option>
                  <option value="load">{t('testType.load')}</option>
                  <option value="fault">{t('testType.fault')}</option>
                </select>
              </div>
              <div>
                <Label htmlFor="duration">Durée (secondes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newScenario.duration}
                  onChange={(e) => setNewScenario(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newScenario.description}
                  onChange={(e) => setNewScenario(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="complexity">Complexité</Label>
                <select
                  id="complexity"
                  value={newScenario.complexity}
                  onChange={(e) => setNewScenario(prev => ({ ...prev, complexity: e.target.value as Scenario['complexity'] }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Basic">{t('scenario.complexity.basic')}</option>
                  <option value="Intermediate">{t('scenario.complexity.intermediate')}</option>
                  <option value="Advanced">{t('scenario.complexity.advanced')}</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">Créer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin h-6 w-6 text-muted-foreground mr-2" />
            <span>{t('loading')}</span>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center py-8 text-destructive gap-2">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span>{error}</span>
              <Button size="sm" variant="outline" className="ml-4" onClick={handleRetry} disabled={retrying}>
                {retrying && <Loader2 className="animate-spin h-4 w-4 mr-1" />} {t('retry') || 'Réessayer'}
              </Button>
            </div>
          </div>
        )}
        {!loading && !error && scenarios.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Info className="h-5 w-5 mr-2" />
            <span>{t('empty.scenarios') || 'Aucun scénario trouvé.'}</span>
          </div>
        )}
        {!loading && !error && scenarios.length > 0 && (
          <div className="grid gap-3">
            {scenarios.map((scenario) => (
              <div
                key={scenario.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                  selectedScenario?.id === scenario.id 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">{scenario.name}</h3>
                    {selectedScenario?.id === scenario.id && (
                      <CheckCircle className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getComplexityColor(scenario.complexity)}>
                      {getComplexityTranslation(scenario.complexity)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDuration(scenario.duration || 0)}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {scenario.description}
                </p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{getTestTypeTranslation(scenario.testType)}</Badge>
                  <Button variant="outline" size="sm" onClick={(e) => {
                    e.stopPropagation()
                    // Ouvrir les paramètres du scénario
                  }}>
                    <Play className="mr-1 h-3 w-3" />
                    Configurer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedScenario && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-primary" />
              <span className="font-medium">Scénario sélectionné: {selectedScenario.name}</span>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              {selectedScenario.description}
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type:</span>
                <span className="ml-2">{getTestTypeTranslation(selectedScenario.testType)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Durée:</span>
                <span className="ml-2">{formatDuration(selectedScenario.duration || 0)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Complexité:</span>
                <span className="ml-2">{getComplexityTranslation(selectedScenario.complexity)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}