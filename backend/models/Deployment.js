/**
 * @swagger
 * components:
 *   schemas:
 *     Deployment:
 *       type: object
 *       required:
 *         - protocolId
 *         - architectureId
 *         - scenarioId
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the deployment
 *         protocolId:
 *           type: string
 *           description: ID of the protocol to deploy
 *         architectureId:
 *           type: string
 *           description: ID of the architecture to use
 *         scenarioId:
 *           type: string
 *           description: ID of the scenario to execute
 *         name:
 *           type: string
 *           description: Deployment name
 *         status:
 *           type: string
 *           enum: [pending, deploying, running, completed, failed, stopped]
 *           description: Current deployment status
 *         kubernetesNamespace:
 *           type: string
 *           description: Kubernetes namespace for the deployment
 *         resources:
 *           type: object
 *           description: Kubernetes resources configuration
 *         logs:
 *           type: array
 *           items:
 *             type: object
 *           description: Deployment logs
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         id: "deploy-001"
 *         protocolId: "proto-001"
 *         architectureId: "arch-001"
 *         scenarioId: "scen-001"
 *         name: "TCP Linear Test"
 *         status: "running"
 *         kubernetesNamespace: "cyberlab-tcp-001"
 */

import { v4 as uuidv4 } from 'uuid'

// Mock database
let deployments = [
  {
    id: 'deploy-001',
    protocolId: 'proto-001',
    architectureId: 'arch-001',
    scenarioId: 'scen-001',
    name: 'TCP Linear Test',
    status: 'running',
    kubernetesNamespace: 'cyberlab-tcp-001',
    resources: {
      cpu: '2000m',
      memory: '4Gi',
      storage: '10Gi'
    },
    logs: [
      {
        timestamp: new Date().toISOString(),
        level: 'INFO',
        message: 'Deployment started successfully'
      }
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export class Deployment {
  static getAll() {
    return deployments
  }

  static getById(id) {
    return deployments.find(d => d.id === id)
  }

  static create(data) {
    const deployment = {
      id: uuidv4(),
      ...data,
      status: 'pending',
      kubernetesNamespace: `cyberlab-${data.name?.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      logs: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    deployments.push(deployment)
    return deployment
  }

  static update(id, data) {
    const index = deployments.findIndex(d => d.id === id)
    if (index === -1) return null
    
    deployments[index] = {
      ...deployments[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return deployments[index]
  }

  static delete(id) {
    const index = deployments.findIndex(d => d.id === id)
    if (index === -1) return false
    
    deployments.splice(index, 1)
    return true
  }

  static getByStatus(status) {
    return deployments.filter(d => d.status === status)
  }

  static addLog(id, logEntry) {
    const deployment = this.getById(id)
    if (!deployment) return null
    
    deployment.logs.push({
      timestamp: new Date().toISOString(),
      ...logEntry
    })
    deployment.updatedAt = new Date().toISOString()
    
    return deployment
  }

  static updateStatus(id, status) {
    return this.update(id, { status })
  }
}

export default Deployment