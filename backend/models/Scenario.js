/**
 * @swagger
 * components:
 *   schemas:
 *     Scenario:
 *       type: object
 *       required:
 *         - name
 *         - testType
 *         - complexity
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the scenario
 *         name:
 *           type: string
 *           description: Scenario name
 *         testType:
 *           type: string
 *           enum: [ping, load, fault, performance, security]
 *           description: Type of test to perform
 *         description:
 *           type: string
 *           description: Scenario description
 *         complexity:
 *           type: string
 *           enum: [Basic, Intermediate, Advanced]
 *           description: Scenario complexity level
 *         duration:
 *           type: integer
 *           description: Test duration in seconds
 *         parameters:
 *           type: object
 *           description: Scenario-specific parameters
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *       example:
 *         id: "scen-001"
 *         name: "Basic Connectivity Test"
 *         testType: "ping"
 *         description: "Simple ping test to verify connectivity"
 *         complexity: "Basic"
 *         duration: 300
 *         parameters: {
 *           "packetSize": 64,
 *           "interval": 1000
 *         }
 */

import { v4 as uuidv4 } from 'uuid'

// Mock database
let scenarios = [
  {
    id: 'scen-001',
    name: 'Basic Connectivity Test',
    testType: 'ping',
    description: 'Simple ping test to verify network connectivity',
    complexity: 'Basic',
    duration: 300,
    parameters: {
      packetSize: 64,
      interval: 1000,
      timeout: 5000
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'scen-002',
    name: 'Load Simulation Test',
    testType: 'load',
    description: 'Stress test to evaluate network performance under load',
    complexity: 'Intermediate',
    duration: 900,
    parameters: {
      concurrentConnections: 100,
      dataRate: '10Mbps',
      rampUpTime: 60
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'scen-003',
    name: 'Fault Tolerance Test',
    testType: 'fault',
    description: 'Test network resilience by simulating failures',
    complexity: 'Advanced',
    duration: 1800,
    parameters: {
      failureRate: 0.1,
      recoveryTime: 30,
      failureTypes: ['link', 'node', 'congestion']
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
]

export class Scenario {
  static getAll() {
    return scenarios
  }

  static getById(id) {
    return scenarios.find(s => s.id === id)
  }

  static create(data) {
    const scenario = {
      id: uuidv4(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    scenarios.push(scenario)
    return scenario
  }

  static update(id, data) {
    const index = scenarios.findIndex(s => s.id === id)
    if (index === -1) return null
    
    scenarios[index] = {
      ...scenarios[index],
      ...data,
      updatedAt: new Date().toISOString()
    }
    return scenarios[index]
  }

  static delete(id) {
    const index = scenarios.findIndex(s => s.id === id)
    if (index === -1) return false
    
    scenarios.splice(index, 1)
    return true
  }

  static getByTestType(testType) {
    return scenarios.filter(s => s.testType === testType)
  }

  static getByComplexity(complexity) {
    return scenarios.filter(s => s.complexity === complexity)
  }

  static getByDuration(maxDuration) {
    return scenarios.filter(s => s.duration <= maxDuration)
  }
}

export default Scenario