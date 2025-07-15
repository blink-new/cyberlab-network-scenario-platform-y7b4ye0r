import React, { useState, useEffect, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plus, 
  X, 
  Upload, 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  Code2,
  FileText,
  Split
} from 'lucide-react'
import * as yaml from 'js-yaml'
import debounce from 'lodash.debounce'

interface ProtocolTool {
  name: string
  supported: boolean
  note?: string
}

interface ProtocolData {
  name: string
  version: string
  description: string
  tags: string[]
  category: string
  layer: string
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  features: string[]
  tools: ProtocolTool[]
}

interface ProtocolFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (protocol: ProtocolData) => void
}

const CATEGORIES = [
  'Authentication',
  'VPN', 
  'Encryption',
  'Transport',
  'Network',
  'Application',
  'Security',
  'Routing'
]

const LAYERS = [
  'Physical',
  'Data Link',
  'Network', 
  'Transport',
  'Session',
  'Presentation',
  'Application'
]

const EXAMPLE_YAML = `name: TLS
version: "1.2"
description: "Secure transport protocol"
tags: 
  - transport
  - encryption
layer: "Transport"
category: "Encryption"
difficulty_level: beginner
features:
  - handshake
  - cipher_negotiation
  - certificate_validation
tools:
  - name: openssl
    supported: true
    note: "Can be used for both server and client"
  - name: gnutls-cli
    supported: true
    note: "Alternative TLS client implementation"`

export function ProtocolFormDialog({ open, onOpenChange, onSubmit }: ProtocolFormDialogProps) {
  const [viewMode, setViewMode] = useState<'form' | 'yaml' | 'split'>('form')
  const [yamlContent, setYamlContent] = useState(EXAMPLE_YAML)
  const [yamlError, setYamlError] = useState<string | null>(null)
  const [isValid, setIsValid] = useState(true)
  
  const [formData, setFormData] = useState<ProtocolData>({
    name: '',
    version: '',
    description: '',
    tags: [],
    category: '',
    layer: '',
    difficulty_level: 'beginner',
    features: [],
    tools: []
  })

  const [newTag, setNewTag] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newTool, setNewTool] = useState({ name: '', supported: true, note: '' })

  const debouncedYamlUpdate = useRef(
    debounce((data: ProtocolData) => {
      const yamlData = {
        name: data.name || 'ProtocolName',
        version: data.version || '1.0',
        description: data.description || 'Protocol description',
        tags: data.tags.length > 0 ? data.tags : ['tag1', 'tag2'],
        layer: data.layer || 'Transport',
        category: data.category || 'Encryption',
        difficulty_level: data.difficulty_level,
        features: data.features.length > 0 ? data.features : ['feature1', 'feature2'],
        tools: data.tools.length > 0 ? data.tools : [
          { name: 'tool1', supported: true, note: 'Example tool' }
        ]
      }
      try {
        setYamlContent(yaml.dump(yamlData, { 
          indent: 2, 
          lineWidth: -1,
          quotingType: '"',
          forceQuotes: false
        }))
        setYamlError(null)
        setIsValid(true)
      } catch (error) {
        setYamlError('Error generating YAML: ' + (error as Error).message)
        setIsValid(false)
      }
    }, 300)
  ).current

  useEffect(() => {
    if (viewMode !== 'yaml') {
      debouncedYamlUpdate(formData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, viewMode])

  // Sync YAML to form data when YAML changes
  const handleYamlChange = (newYaml: string) => {
    setYamlContent(newYaml)
    
    try {
      const parsed = yaml.load(newYaml) as Record<string, unknown>
      
      // Validate required fields
      if (!parsed.name || !parsed.version || !parsed.description) {
        throw new Error('Required fields: name, version, description')
      }

      // Helper function to safely cast tool objects
      const parseTools = (toolsArray: unknown[]): ProtocolTool[] => {
        return toolsArray.map((tool: unknown) => {
          const toolObj = tool as Record<string, unknown>
          return {
            name: (toolObj.name as string) || '',
            supported: Boolean(toolObj.supported),
            note: (toolObj.note as string) || ''
          }
        })
      }

      // Update form data
      setFormData({
        name: (parsed.name as string) || '',
        version: (parsed.version as string) || '',
        description: (parsed.description as string) || '',
        tags: Array.isArray(parsed.tags) ? parsed.tags as string[] : [],
        category: (parsed.category as string) || '',
        layer: (parsed.layer as string) || '',
        difficulty_level: (parsed.difficulty_level as ProtocolData['difficulty_level']) || 'beginner',
        features: Array.isArray(parsed.features) ? parsed.features as string[] : [],
        tools: Array.isArray(parsed.tools) ? parseTools(parsed.tools) : []
      })
      
      setYamlError(null)
      setIsValid(true)
    } catch (error) {
      setYamlError('YAML Error: ' + (error as Error).message)
      setIsValid(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        handleYamlChange(content)
        setViewMode('yaml')
      }
      reader.readAsText(file)
    }
  }

  const downloadYaml = () => {
    const blob = new Blob([yamlContent], { type: 'text/yaml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${formData.name || 'protocol'}.yaml`
    a.click()
    URL.revokeObjectURL(url)
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, newTag] }))
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }))
  }

  const addFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature] }))
      setNewFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter(f => f !== feature) }))
  }

  const addTool = () => {
    if (newTool.name && !formData.tools.find(t => t.name === newTool.name)) {
      setFormData(prev => ({ ...prev, tools: [...prev.tools, newTool] }))
      setNewTool({ name: '', supported: true, note: '' })
    }
  }

  const removeTool = (toolName: string) => {
    setFormData(prev => ({ ...prev, tools: prev.tools.filter(t => t.name !== toolName) }))
  }

  const handleSubmit = () => {
    if (isValid && formData.name && formData.version && formData.description) {
      onSubmit(formData)
      onOpenChange(false)
      // Reset form
      setFormData({
        name: '',
        version: '',
        description: '',
        tags: [],
        category: '',
        layer: '',
        difficulty_level: 'beginner',
        features: [],
        tools: []
      })
      setYamlContent(EXAMPLE_YAML)
    }
  }

  const FormContent = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Nom du protocole *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="ex: TLS, IPSec"
              required
            />
          </div>
          <div>
            <Label htmlFor="version">Version *</Label>
            <Input
              id="version"
              value={formData.version}
              onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
              placeholder="ex: 1.2, 1.3, WPA3"
              required
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Courte description pédagogique ou technique"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="category">Catégorie</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="layer">Couche OSI</Label>
            <Select 
              value={formData.layer} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, layer: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une couche" />
              </SelectTrigger>
              <SelectContent>
                {LAYERS.map(layer => (
                  <SelectItem key={layer} value={layer}>{layer}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="difficulty">Niveau de difficulté</Label>
          <Select 
            value={formData.difficulty_level} 
            onValueChange={(value: ProtocolData['difficulty_level']) => setFormData(prev => ({ ...prev, difficulty_level: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Débutant</SelectItem>
              <SelectItem value="intermediate">Intermédiaire</SelectItem>
              <SelectItem value="advanced">Avancé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Tags */}
      <div>
        <Label>Mots-clés (tags)</Label>
        <div className="flex gap-2 mt-2 mb-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="ex: transport, VPN, encrypted"
            onKeyPress={(e) => e.key === 'Enter' && addTag()}
          />
          <Button type="button" size="sm" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Features */}
      <div>
        <Label>Fonctionnalités</Label>
        <div className="flex gap-2 mt-2 mb-2">
          <Input
            value={newFeature}
            onChange={(e) => setNewFeature(e.target.value)}
            placeholder="ex: handshake, cipher_negotiation"
            onKeyPress={(e) => e.key === 'Enter' && addFeature()}
          />
          <Button type="button" size="sm" onClick={addFeature}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.features.map(feature => (
            <Badge key={feature} variant="outline" className="flex items-center gap-1">
              {feature}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeFeature(feature)} />
            </Badge>
          ))}
        </div>
      </div>

      <Separator />

      {/* Tools */}
      <div>
        <Label>Outils possibles</Label>
        <div className="space-y-2 mt-2 mb-3">
          <div className="grid grid-cols-4 gap-2">
            <Input
              value={newTool.name}
              onChange={(e) => setNewTool(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nom de l'outil"
            />
            <div className="flex items-center space-x-2">
              <Switch
                checked={newTool.supported}
                onCheckedChange={(checked) => setNewTool(prev => ({ ...prev, supported: checked }))}
              />
              <Label className="text-sm">Supporté</Label>
            </div>
            <Input
              value={newTool.note}
              onChange={(e) => setNewTool(prev => ({ ...prev, note: e.target.value }))}
              placeholder="Note (optionnel)"
            />
            <Button type="button" size="sm" onClick={addTool}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {formData.tools.map(tool => (
            <div key={tool.name} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-3">
                <span className="font-medium">{tool.name}</span>
                <Badge variant={tool.supported ? 'default' : 'secondary'}>
                  {tool.supported ? 'Supporté' : 'Non supporté'}
                </Badge>
                {tool.note && <span className="text-sm text-gray-600">{tool.note}</span>}
              </div>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={() => removeTool(tool.name)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Nouveau protocole</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={downloadYaml}>
                <Download className="h-4 w-4 mr-1" />
                Export YAML
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept=".yaml,.yml"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-1" />
                  Import YAML
                </Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* View Mode Selector */}
        <div className="flex items-center gap-2 border-b pb-3">
          <Button
            variant={viewMode === 'form' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('form')}
          >
            <FileText className="h-4 w-4 mr-1" />
            Formulaire
          </Button>
          <Button
            variant={viewMode === 'yaml' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('yaml')}
          >
            <Code2 className="h-4 w-4 mr-1" />
            YAML
          </Button>
          <Button
            variant={viewMode === 'split' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('split')}
          >
            <Split className="h-4 w-4 mr-1" />
            Vue divisée
          </Button>
        </div>

        {/* Validation Status */}
        {yamlError && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{yamlError}</AlertDescription>
          </Alert>
        )}

        {isValid && formData.name && formData.version && formData.description && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Configuration valide - Prêt à enregistrer</AlertDescription>
          </Alert>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto">
          {viewMode === 'form' && (
            <div className="pr-2">
              <FormContent />
            </div>
          )}

          {viewMode === 'yaml' && (
            <div className="h-96">
              <Textarea
                value={yamlContent}
                onChange={(e) => handleYamlChange(e.target.value)}
                className="font-mono text-sm h-full resize-none"
                placeholder="Contenu YAML..."
              />
            </div>
          )}

          {viewMode === 'split' && (
            <div className="grid grid-cols-2 gap-4 h-96">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Formulaire</CardTitle>
                </CardHeader>
                <CardContent className="h-80 overflow-auto">
                  <FormContent />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">YAML</CardTitle>
                </CardHeader>
                <CardContent className="h-80 overflow-auto">
                  <Textarea
                    value={yamlContent}
                    onChange={(e) => handleYamlChange(e.target.value)}
                    className="font-mono text-sm h-full resize-none"
                    placeholder="Contenu YAML..."
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!isValid || !formData.name || !formData.version || !formData.description}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Confirmer et enregistrer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}