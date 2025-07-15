import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useLanguage } from '@/contexts/LanguageContext'
import { processYaml } from '@/services/api'
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react'

export function YamlInputSection() {
  const { t } = useLanguage()
  const [yaml, setYaml] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleProcessYaml = async () => {
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await processYaml(yaml)
      setResult(res.data)
    } catch (err) {
      setError(err?.response?.data?.error || err?.message || 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setYaml('')
    setResult(null)
    setError('')
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle>{t('home.yamlInputTitle')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          {t('home.yamlInputDescription')}
        </p>
        <Textarea
          value={yaml}
          onChange={(e) => setYaml(e.target.value)}
          placeholder="Paste your YAML here..."
          rows={10}
          className="font-mono text-sm"
        />
        <div className="flex gap-2 mt-4">
          <Button onClick={handleProcessYaml} disabled={loading || !yaml.trim()}>
            {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />} {t('home.processYaml')}
          </Button>
          <Button onClick={handleReset} variant="outline" disabled={loading && !result && !error}>
            Réinitialiser
          </Button>
        </div>
        {error && (
          <div className="flex items-center gap-2 mt-4 text-destructive bg-destructive/10 rounded p-3 animate-fade-in">
            <AlertTriangle className="h-5 w-5" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        {result && (
          <div className="mt-4 p-4 bg-muted/50 rounded-lg animate-fade-in">
            <div className="flex items-center gap-2 mb-2 text-green-700">
              <CheckCircle className="h-4 w-4" />
              <span className="font-medium">YAML valide</span>
            </div>
            <pre className="text-xs bg-muted p-2 rounded overflow-x-auto max-h-64">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}