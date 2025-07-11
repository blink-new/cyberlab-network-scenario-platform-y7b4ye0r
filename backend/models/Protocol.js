/**
 * @swagger
 * components:
 *   schemas:
 *     Protocol:
 *       type: object
 *       required:
 *         - name
 *         - version
 *         - category
 *         - complexity
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the protocol
 *         name:
 *           type: string
 *           description: Protocol name
 *         version:
 *           type: string
 *           description: Protocol version
 *         description:
 *           type: string
 *           description: Protocol description
 *         category:
 *           type: string
 *           enum: [transport, routing, application, security]
 *           description: Protocol category
 *         complexity:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *           description: Protocol complexity level
 *         parameters:
 *           type: object
 *           description: Protocol-specific parameters
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         id: "proto-001"
 *         name: "TCP"
 *         version: "v4"
 *         description: "Transmission Control Protocol for reliable communication"
 *         category: "transport"
 *         complexity: "Beginner"
 *         parameters: {
 *           "windowSize": 65535,
 *           "timeout": 30000
 *         }
 */

import { v4 as uuidv4 } from 'uuid'

// Mock database - remplacer par une vraie base de données
let protocols = [
  {
    id: 'proto-001',
    name: 'TCP',
    version: 'v4',
    description: 'Transmission Control Protocol for reliable communication',
    category: 'transport',
    complexity: 'Beginner',
    parameters: {
      windowSize: 65535,
      timeout: 30000
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'proto-002',
    name: 'OSPF',
    version: 'v2',
    description: 'Open Shortest Path First dynamic routing protocol',
    category: 'routing',
    complexity: 'Intermediate',
    parameters: {
      helloInterval: 10,
      deadInterval: 40,
      area: '0.0.0.0'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'proto-003',
    name: 'BGP',
    version: 'v4',
    description: 'Border Gateway Protocol for inter-domain routing',
    category: 'routing',
    complexity: 'Advanced',
    parameters: {
      asNumber: 65000,
      keepalive: 60,
      holdtime: 180
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export class Protocol {
  static getAll() {
    return protocols
  }

  static getById(id) {
    return protocols.find(p => p.id === id)
  }

  static create(data) {
    const protocol = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    protocols.push(protocol)
    return protocol
  }

  static update(id, data) {
    const index = protocols.findIndex(p => p.id === id)
    if (index === -1) return null
    
    protocols[index] = {
      ...protocols[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return protocols[index]
  }

  static delete(id) {
    const index = protocols.findIndex(p => p.id === id)
    if (index === -1) return false
    
    protocols.splice(index, 1)
    return true
  }

  static getByCategory(category) {
    return protocols.filter(p => p.category === category)
  }

  static getByComplexity(complexity) {
    return protocols.filter(p => p.complexity === complexity)
  }
}

export default Protocol