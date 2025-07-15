import React, { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Play, Eye, Calendar, Network, Loader2, AlertTriangle, RotateCw, Info } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getArchitectures } from '@/services/api'

interface ArchitectureImage {
  id: string
  name: string
  protocol: string
  description: string
  imageUrl: string
  scenario: string
  createdAt: string
  tags: string[]
}

interface ArchitectureData {
  id: string;
  name: string;
  topology: string;
  description: string;
  nodesCount: number;
  difficulty: 'Simple' | 'Medium' | 'Complex';
  createdAt: string;
}

export function ImageGallery() {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedImage, setSelectedImage] = useState<ArchitectureImage | null>(null)
  const [images, setImages] = useState<ArchitectureImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRetrying, setIsRetrying] = useState(false)

  const fetchImages = useCallback(async () => {
    setLoading(true)
    setError(null)
    setIsRetrying(false)
    try {
      const response = await getArchitectures() // Assuming getArchitectures fetches images for now
      setImages(Array.isArray(response.data) ? response.data.map((arch: ArchitectureData) => ({
        id: arch.id,
        name: arch.name,
        protocol: 'N/A', // Backend might not have protocol directly on architecture
        description: arch.description,
        imageUrl: '/api/placeholder/300/200', // Placeholder for now
        scenario: 'N/A', // Placeholder for now
        createdAt: arch.createdAt,
        tags: [arch.topology, arch.difficulty.toLowerCase()]
      })) : [])
    } catch (fetchErr: unknown) {
      if (fetchErr instanceof Error) {
        setError(t('error.imagesFetchFailed') + ': ' + fetchErr.message)
      } else {
        setError(t('error.imagesFetchFailed') + ': An unknown error occurred')
      }
    } finally {
      setLoading(false)
    }
  }, [t])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleRetry = async () => {
    setIsRetrying(true)
    setError(null)
    try {
      const response = await getArchitectures()
      setImages(Array.isArray(response.data) ? response.data.map((arch: ArchitectureData) => ({
        id: arch.id,
        name: arch.name,
        protocol: 'N/A',
        description: arch.description,
        imageUrl: '/api/placeholder/300/200', // Placeholder for now
        scenario: 'N/A',
        createdAt: arch.createdAt,
        tags: [arch.topology, arch.difficulty.toLowerCase()]
      })) : [])
      setError(null)
    } catch (retryErr: unknown) {
      if (retryErr instanceof Error) {
        setError(t('error.imagesFetchFailed') + ': ' + retryErr.message)
      } else {
        setError(t('error.imagesFetchFailed') + ': An unknown error occurred')
      }
    } finally {
      setIsRetrying(false)
    }
  }

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.protocol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('home.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

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
      {!loading && !error && images.length === 0 && (
        <div className="flex items-center justify-center py-8 text-muted-foreground">
          <Info className="h-5 w-5 mr-2" />
          <span>{t('empty.images') || 'Aucune image trouvée.'}</span>
        </div>
      )}
      {!loading && !error && images.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des images */}
          <div className="lg:col-span-2">
            <div className="grid gap-4">
              {filteredImages.map((image) => (
                <Card
                  key={image.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedImage?.id === image.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedImage(image)}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="h-24 w-32 rounded bg-muted flex items-center justify-center">
                        <Network className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{image.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {image.description}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge variant="secondary">{image.protocol}</Badge>
                              {image.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              {image.createdAt}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Détails de l'image sélectionnée */}
          <div className="lg:col-span-1">
            {selectedImage ? (
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    {t('details.architectureDetails')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="h-48 rounded bg-muted flex items-center justify-center">
                    <Network className="h-16 w-12 text-muted-foreground" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">{selectedImage.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      {selectedImage.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('details.protocol')}:</span>
                      <Badge>{selectedImage.protocol}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('details.scenario')}:</span>
                      <span>{selectedImage.scenario}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{t('details.createdAt')}:</span>
                      <span>{selectedImage.createdAt}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">{t('details.tags')}:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedImage.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    <Play className="mr-2 h-4 w-4" />
                    {t('home.deployOnKubernetes')}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="sticky top-4">
                <CardContent className="p-8 text-center">
                  <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {t('home.selectArchitecture')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  )
}