import React, { useState } from 'react'
import { ImageGallery } from '@/components/ImageGallery'
import { ProtocolSection } from '@/components/ProtocolSection'
import { ArchitectureSection } from '@/components/ArchitectureSection'
import { ScenarioSection } from '@/components/ScenarioSection'
import { YamlInputSection } from '@/components/YamlInputSection'
import { Separator } from '@/components/ui/separator'
import { useLanguage } from '@/contexts/LanguageContext'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { parseYaml, validateProtocolYaml, validateArchitectureYaml, validateScenarioYaml } from '@/lib/yaml/yamlUtils'

export function HomePage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [selectedProtocol, setSelectedProtocol] = useState(null)
  const [selectedArchitecture, setSelectedArchitecture] = useState(null)
  const [selectedScenario, setSelectedScenario] = useState(null)
  const [yamlContent, setYamlContent] = useState('')

  const handleDeploy = () => {
    const missing = []
    
    if (!selectedProtocol) missing.push(t('validation.protocolRequired'))
    if (!selectedArchitecture) missing.push(t('validation.architectureRequired'))
    if (!selectedScenario) missing.push(t('validation.scenarioRequired'))

    if (missing.length > 0) {
      toast({
        title: t('validation.selectAtLeastOne'),
        description: missing.join(', '),
        variant: 'destructive'
      })
      return
    }

    // Proceed with deployment
    toast({
      title: 'Deployment Started',
      description: 'Your configuration is being deployed...',
    })
  }

  const handleProcessYaml = () => {
    try {
      const parsedYaml = parseYaml(yamlContent)
      let isValid = true
      const validationErrors: string[] = []

      // Basic validation based on expected top-level keys
      if (parsedYaml && typeof parsedYaml === 'object') {
        if ((parsedYaml as Record<string, unknown>).protocol) {
          if (!validateProtocolYaml((parsedYaml as Record<string, unknown>).protocol)) {
            isValid = false
            validationErrors.push('Invalid protocol definition in YAML.')
          }
        }
        if ((parsedYaml as Record<string, unknown>).architecture) {
          if (!validateArchitectureYaml((parsedYaml as Record<string, unknown>).architecture)) {
            isValid = false
            validationErrors.push('Invalid architecture definition in YAML.')
          }
        }
        if ((parsedYaml as Record<string, unknown>).scenario) {
          if (!validateScenarioYaml((parsedYaml as Record<string, unknown>).scenario)) {
            isValid = false
            validationErrors.push('Invalid scenario definition in YAML.')
          }
        }

        if (!((parsedYaml as Record<string, unknown>).protocol) && !((parsedYaml as Record<string, unknown>).architecture) && !((parsedYaml as Record<string, unknown>).scenario)) {
          isValid = false
          validationErrors.push('YAML must contain at least one of: protocol, architecture, or scenario.')
        }

      } else {
        isValid = false
        validationErrors.push('YAML content is not a valid object.')
      }

      if (isValid && validationErrors.length === 0) {
        toast({
          title: 'YAML Validated',
          description: 'YAML content is valid and ready for processing.',
          variant: 'success'
        })
        console.log('Parsed YAML:', parsedYaml)
        // Here you would typically process the parsedYaml further,
        // e.g., send it to backend or update local state.
      } else {
        toast({
          title: 'YAML Validation Failed',
          description: validationErrors.join(' ') || 'Please check your YAML syntax and content.',
          variant: 'destructive'
        })
      }
    } catch (error: unknown) {
      let errorMessage = 'An unknown error occurred during YAML parsing.'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast({
        title: 'YAML Parsing Error',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Section 1: Galerie d'images */}
      <div>
        <h2 className="text-2xl font-bold mb-4">{t('home.configuredArchitectures')}</h2>
        <ImageGallery />
      </div>

      <Separator className="my-8" />

      {/* Section 2: Configuration personnalisée */}
      <div>
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">{t('home.customConfiguration')}</h2>
          <p className="text-muted-foreground">
            {t('home.customConfigurationDesc')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Choix du protocole */}
          <div>
            <ProtocolSection onSelectionChange={setSelectedProtocol} />
          </div>

          {/* Configuration de l'architecture */}
          <div>
            <ArchitectureSection onSelectionChange={setSelectedArchitecture} />
          </div>

          {/* Configuration du scénario */}
          <div>
            <ScenarioSection onSelectionChange={setSelectedScenario} />
          </div>
        </div>

        {/* YAML Input Section */}
        <div className="mt-8 p-6 border rounded-lg shadow-sm">
          <h3 className="text-xl font-semibold mb-4">Input Configuration YAML</h3>
          <Textarea
            placeholder="Paste your YAML configuration here..."
            value={yamlContent}
            onChange={(e) => setYamlContent(e.target.value)}
            rows={10}
            className="font-mono text-sm"
          />
          <Button onClick={handleProcessYaml} className="mt-4">
            Process YAML
          </Button>
        </div>

        {/* Bouton de déploiement global */}
        <div className="mt-8 flex justify-center">
          <button 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-3 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl"
            onClick={handleDeploy}
          >
            {t('home.deployFullConfiguration')}
          </button>
        </div>
      </div>

      <Separator className="my-8" />

      {/* Section 3: YAML Input */}
      <div>
        <YamlInputSection />
      </div>
    </div>
  )
}