import yaml from 'js-yaml'

// Parse YAML string to JS object
export function parseYaml(yamlString: string): unknown {
  try {
    return yaml.load(yamlString)
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Invalid YAML format: ${error.message}`)
    } else {
      throw new Error('Invalid YAML format: An unknown error occurred')
    }
  }
}

// Validate required fields in protocol YAML
export function validateProtocolYaml(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false
  const protocol = obj as Record<string, unknown>
  if (typeof protocol.name !== 'string') return false
  if (typeof protocol.version !== 'string') return false
  if (typeof protocol.category !== 'string') return false
  if (typeof protocol.complexity !== 'string') return false
  return true
}

// Validate required fields in architecture YAML
export function validateArchitectureYaml(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false
  const architecture = obj as Record<string, unknown>
  if (typeof architecture.name !== 'string') return false
  if (typeof architecture.topology !== 'string') return false
  if (typeof architecture.nodesCount !== 'number') return false
  if (typeof architecture.difficulty !== 'string') return false
  return true
}

// Validate required fields in scenario YAML
export function validateScenarioYaml(obj: unknown): boolean {
  if (typeof obj !== 'object' || obj === null) return false
  const scenario = obj as Record<string, unknown>
  if (typeof scenario.name !== 'string') return false
  if (typeof scenario.testType !== 'string') return false
  if (typeof scenario.complexity !== 'string') return false
  return true
}

// Generate Kubernetes manifest for deployment
export function generateK8sManifest(deploymentConfig: Record<string, unknown>): Record<string, unknown> {
  // Basic example of a Kubernetes Deployment manifest
  return {
    apiVersion: 'apps/v1',
    kind: 'Deployment',
    metadata: {
      name: (deploymentConfig.name as string) || 'cyberlab-deployment',
      namespace: (deploymentConfig.kubernetesNamespace as string) || 'default'
    },
    spec: {
      replicas: (deploymentConfig.replicas as number) || 1,
      selector: {
        matchLabels: {
          app: (deploymentConfig.name as string) || 'cyberlab-app'
        }
      },
      template: {
        metadata: {
          labels: {
            app: (deploymentConfig.name as string) || 'cyberlab-app'
          }
        },
        spec: {
          containers: [
            {
              name: (deploymentConfig.name as string) || 'cyberlab-container',
              image: (deploymentConfig.image as string) || 'nginx:latest',
              ports: [
                {
                  containerPort: (deploymentConfig.port as number) || 80
                }
              ],
              resources: (deploymentConfig.resources as Record<string, unknown>) || {}
            }
          ]
        }
      }
    }
  }
}