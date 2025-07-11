/**
 * @swagger
 * components:
 *   schemas:
 *     Architecture:
 *       type: object
 *       required:
 *         - name
 *         - topology
 *         - nodesCount
 *         - difficulty
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the architecture
 *         name:
 *           type: string
 *           description: Architecture name
 *         topology:
 *           type: string
 *           enum: [linear, star, mesh, ring, tree, hybrid]
 *           description: Network topology type
 *         description:
 *           type: string
 *           description: Architecture description
 *         nodesCount:
 *           type: integer
 *           minimum: 1
 *           description: Number of nodes in the architecture
 *         difficulty:
 *           type: string
 *           enum: [Simple, Medium, Complex]
 *           description: Architecture complexity level
 *         configuration:
 *           type: object
 *           description: Architecture-specific configuration
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         id: "arch-001"
 *         name: "Basic Star Network"
 *         topology: "star"
 *         description: "Simple star topology with central hub"
 *         nodesCount: 5
 *         difficulty: "Simple"
 *         configuration: {
 *           "centralNode": "hub-01",
 *           "bandwidth": "1Gbps"
 *         }
 */

import { v4 as uuidv4 } from 'uuid'

// Mock database
let architectures = [
  {
    id: 'arch-001',
    name: 'Basic Linear Network',
    topology: 'linear',
    description: 'Simple linear topology for basic testing',
    nodesCount: 5,
    difficulty: 'Simple',
    configuration: {
      bandwidth: '100Mbps',
      latency: '10ms'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'arch-002',
    name: 'Star Network Hub',
    topology: 'star',
    description: 'Centralized star topology with control point',
    nodesCount: 8,
    difficulty: 'Medium',
    configuration: {
      centralNode: 'hub-01',
      bandwidth: '1Gbps',
      redundancy: false
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'arch-003',
    name: 'Mesh Network',
    topology: 'mesh',
    description: 'Complex mesh topology with multiple redundancy',
    nodesCount: 12,
    difficulty: 'Complex',
    configuration: {
      redundancyLevel: 'high',
      bandwidth: '10Gbps',
      failoverTime: '1s'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export class Architecture {
  static getAll() {
    return architectures
  }

  static getById(id) {
    return architectures.find(a => a.id === id)
  }

  static create(data) {
    const architecture = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    architectures.push(architecture)
    return architecture
  }

  static update(id, data) {
    const index = architectures.findIndex(a => a.id === id)
    if (index === -1) return null
    
    architectures[index] = {
      ...architectures[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return architectures[index]
  }

  static delete(id) {
    const index = architectures.findIndex(a => a.id === id)
    if (index === -1) return false
    
    architectures.splice(index, 1)
    return true
  }

  static getByTopology(topology) {
    return architectures.filter(a => a.topology === topology)
  }

  static getByDifficulty(difficulty) {
    return architectures.filter(a => a.difficulty === difficulty)
  }

  static getByNodesRange(min, max) {
    return architectures.filter(a => a.nodesCount >= min && a.nodesCount <= max)
  }
}

export default Architecture