import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, X, Upload, Download, AlertTriangle, CheckCircle, Code2, FileText, Eye, Network, Package, Folder, Terminal } from 'lucide-react'
import * as yaml from 'js-yaml'

const OS_FAMILIES = [
  'Debian-based', 'Alpine', 'Kali', 'Ubuntu', 'CentOS', 'Fedora', 'Arch', 'Custom'
]
const BASE_IMAGES = [
  'debian:bullseye', 'ubuntu:22.04', 'alpine:latest', 'kali:latest', 'centos:7', 'fedora:latest', 'archlinux:latest'
]

const EXAMPLE_YAML = `name: tls-handshake-basic
description: "Basic TLS 1.2 handshake between client and server"
protocol: TLS
nodes:
  - name: client
    role: client
    image: debian:bullseye
    packages:
      - openssl
    command: "openssl s_client -connect server:443"
  - name: server
    role: server
    image: debian:bullseye
    packages:
      - openssl
    command: "openssl s_server -cert /etc/tls/cert.pem -key /etc/tls/key.pem -accept 443"
network:
  - source: client
    target: server
    type: direct
shared_volumes:
  - name: certs
    mount:
      - node: server
        path: /etc/tls
      - node: client
        path: /etc/tls
`

const ArchitectureVisualizer = ({ nodes, network }) => {
  if (!nodes || nodes.length === 0) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">Aucun nœud à visualiser.</div>
  }

  const nodePositions = nodes.map((_, index) => {
    const angle = (index / nodes.length) * 2 * Math.PI
    return {
      cx: 200 + 150 * Math.cos(angle),
      cy: 150 + 120 * Math.sin(angle)
    }
  })

  return (
    <div className="flex items-center justify-center p-4 bg-muted/50 rounded-lg h-full">
      <svg width="400" height="300" viewBox="0 0 400 300">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#9ca3af" />
          </marker>
        </defs>
        {network.map((link, index) => {
          const sourceNode = nodes.findIndex(n => n.name === link.source)
          const targetNode = nodes.findIndex(n => n.name === link.target)
          if (sourceNode === -1 || targetNode === -1) return null

          const { cx: x1, cy: y1 } = nodePositions[sourceNode]
          const { cx: x2, cy: y2 } = nodePositions[targetNode]

          return (
            <line
              key={index}
              x1={x1} y1={y1}
              x2={x2} y2={y2}
              stroke="#9ca3af"
              strokeWidth="2"
              markerEnd="url(#arrow)"
            />
          )
        })}
        {nodes.map((node, index) => {
          const { cx, cy } = nodePositions[index]
          return (
            <g key={node.name}>
              <circle cx={cx} cy={cy} r="20" fill="#fff" stroke="#3b82f6" strokeWidth="2" />
              <text x={cx} y={cy + 30} textAnchor="middle" fontSize="12" fill="#374151">{node.name}</text>
              <text x={cx} y={cy + 45} textAnchor="middle" fontSize="10" fill="#6b7280">({node.role})</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export function ArchitectureFormDialog({ open, onOpenChange, onSubmit }) {
  const [viewMode, setViewMode] = useState('form')
  const [yamlContent, setYamlContent] = useState(EXAMPLE_YAML)
  const [yamlError, setYamlError] = useState(null)
  const [isValid, setIsValid] = useState(true)
  const [formData, setFormData] = useState(yaml.load(EXAMPLE_YAML))

  const syncFormToYaml = () => {
    try {
      setYamlContent(yaml.dump(formData, { indent: 2, lineWidth: -1 }))
      setYamlError(null)
      setIsValid(true)
    } catch (error) {
      setYamlError('Erreur YAML: ' + error.message)
      setIsValid(false)
    }
  }

  const handleYamlChange = (newYaml) => {
    setYamlContent(newYaml)
    try {
      const parsed = yaml.load(newYaml)
      setFormData(parsed)
      setYamlError(null)
      setIsValid(true)
    } catch (error) {
      setYamlError('Erreur YAML: ' + error.message)
      setIsValid(false)
    }
  }

  const addNode = () => {
    setFormData(prev => ({ ...prev, nodes: [...prev.nodes, { name: '', role: '', image: '', os_family: '', packages: [], command: '' }] }))
  }
  const removeNode = (idx) => {
    setFormData(prev => ({ ...prev, nodes: prev.nodes.filter((_, i) => i !== idx) }))
  }

  const FormContent = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Nom de l'architecture *</Label>
          <Input value={formData.name} onChange={e => setFormData(f => ({ ...f, name: e.target.value }))} onBlur={syncFormToYaml} required />
        </div>
        <div>
          <Label>Protocole utilisé *</Label>
          <Input value={formData.protocol} onChange={e => setFormData(f => ({ ...f, protocol: e.target.value }))} onBlur={syncFormToYaml} required />
        </div>
      </div>
      <div>
        <Label>Description *</Label>
        <Textarea value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} onBlur={syncFormToYaml} required />
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium mb-2">Nœuds</h3>
        <div className="space-y-4">
          {formData.nodes.map((node, idx) => (
            <Card key={idx} className="p-4">
              <div className="flex justify-between items-center mb-2">
                <Input className="w-1/3 font-semibold" value={node.name} placeholder="Nom du nœud" onChange={e => {
                  const nodes = [...formData.nodes]; nodes[idx].name = e.target.value; setFormData(f => ({ ...f, nodes }));
                }} onBlur={syncFormToYaml} />
                <Button size="icon" variant="ghost" onClick={() => removeNode(idx)}><X className="h-4 w-4" /></Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input value={node.role} placeholder="Rôle (ex: client, server)" onChange={e => {
                  const nodes = [...formData.nodes]; nodes[idx].role = e.target.value; setFormData(f => ({ ...f, nodes }));
                }} onBlur={syncFormToYaml} />
                <Select value={node.image} onValueChange={val => {
                  const nodes = [...formData.nodes]; nodes[idx].image = val; setFormData(f => ({ ...f, nodes }));
                }}>
                  <SelectTrigger><SelectValue placeholder="Image Docker" /></SelectTrigger>
                  <SelectContent>{BASE_IMAGES.map(img => <SelectItem key={img} value={img}>{img}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="mt-4">
                <Label className="flex items-center gap-1"><Package className="h-4 w-4"/> Paquets</Label>
                {/* UI for adding/removing packages */}
              </div>
              <div className="mt-4">
                <Label className="flex items-center gap-1"><Terminal className="h-4 w-4"/> Commande</Label>
                <Textarea value={node.command} placeholder="Commande à exécuter" onChange={e => {
                  const nodes = [...formData.nodes]; nodes[idx].command = e.target.value; setFormData(f => ({ ...f, nodes }));
                }} onBlur={syncFormToYaml} />
              </div>
            </Card>
          ))}
          <Button size="sm" variant="outline" onClick={addNode}><Plus className="h-4 w-4 mr-1" />Ajouter un nœud</Button>
        </div>
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-1"><Network className="h-5 w-5"/>Réseau</h3>
        {/* UI for adding/removing network links */}
      </div>
      <Separator />
      <div>
        <h3 className="text-lg font-medium mb-2 flex items-center gap-1"><Folder className="h-5 w-5"/>Volumes Partagés</h3>
        {/* UI for adding/removing shared volumes */}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Nouvelle architecture</span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={syncFormToYaml}><Download className="h-4 w-4 mr-1" />Exporter YAML</Button>
              <div className="relative">
                <input type="file" accept=".yaml,.yml" onChange={e => {
                  const file = e.target.files?.[0]; if (file) { const reader = new FileReader(); reader.onload = ev => handleYamlChange(ev.target.result as string); reader.readAsText(file); }
                }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <Button variant="outline" size="sm"><Upload className="h-4 w-4 mr-1" />Importer YAML</Button>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b pb-3">
          <Button variant={viewMode === 'form' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('form')}> <FileText className="h-4 w-4 mr-1" />Formulaire </Button>
          <Button variant={viewMode === 'yaml' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('yaml')}> <Code2 className="h-4 w-4 mr-1" />YAML </Button>
          <Button variant={viewMode === 'visual' ? 'default' : 'outline'} size="sm" onClick={() => setViewMode('visual')}> <Eye className="h-4 w-4 mr-1" />Visualisation </Button>
        </div>
        {yamlError && (<Alert variant="destructive"><AlertDescription>{yamlError}</AlertDescription></Alert>)}
        {isValid && formData.name && formData.protocol && formData.description && (<Alert><CheckCircle className="h-4 w-4" /><AlertDescription>Configuration valide - Prêt à enregistrer</AlertDescription></Alert>)}
        <div className="flex-1 overflow-auto p-1">
          {viewMode === 'form' && (<div className="pr-2"><FormContent /></div>)}
          {viewMode === 'yaml' && (<div className="h-full"><Textarea value={yamlContent} onChange={e => handleYamlChange(e.target.value)} className="font-mono text-sm h-full resize-none" placeholder="Contenu YAML..." /></div>)}
          {viewMode === 'visual' && (<ArchitectureVisualizer nodes={formData.nodes} network={formData.network} />)}
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={() => { if (isValid) onSubmit(formData); }} disabled={!isValid || !formData.name || !formData.protocol || !formData.description}><CheckCircle className="h-4 w-4 mr-1" />Confirmer et enregistrer</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
