import express from 'express'
import Joi from 'joi'
import { Scenario } from '../models/Scenario.js'

const router = express.Router()

// Validation schemas
const scenarioSchema = Joi.object({
  name: Joi.string().required(),
  testType: Joi.string().valid('ping', 'load', 'fault', 'performance', 'security').required(),
  description: Joi.string().allow(''),
  complexity: Joi.string().valid('Basic', 'Intermediate', 'Advanced').required(),
  duration: Joi.number().integer().min(1).optional(),
  parameters: Joi.object().optional()
})

const updateScenarioSchema = Joi.object({
  name: Joi.string(),
  testType: Joi.string().valid('ping', 'load', 'fault', 'performance', 'security'),
  description: Joi.string().allow(''),
  complexity: Joi.string().valid('Basic', 'Intermediate', 'Advanced'),
  duration: Joi.number().integer().min(1),
  parameters: Joi.object()
})

/**
 * @swagger
 * /api/scenarios:
 *   get:
 *     summary: Get all scenarios
 *     tags: [Scenarios]
 *     parameters:
 *       - in: query
 *         name: testType
 *         schema:
 *           type: string
 *           enum: [ping, load, fault, performance, security]
 *         description: Filter by test type
 *       - in: query
 *         name: complexity
 *         schema:
 *           type: string
 *           enum: [Basic, Intermediate, Advanced]
 *         description: Filter by complexity level
 *       - in: query
 *         name: maxDuration
 *         schema:
 *           type: integer
 *         description: Maximum duration in seconds
 *     responses:
 *       200:
 *         description: List of scenarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Scenario'
 */
router.get('/', (req, res) => {
  try {
    let scenarios = Scenario.getAll()
    
    // Filter by test type if provided
    if (req.query.testType) {
      scenarios = Scenario.getByTestType(req.query.testType)
    }
    
    // Filter by complexity if provided
    if (req.query.complexity) {
      scenarios = scenarios.filter(s => s.complexity === req.query.complexity)
    }
    
    // Filter by duration if provided
    if (req.query.maxDuration) {
      const maxDuration = parseInt(req.query.maxDuration)
      scenarios = scenarios.filter(s => s.duration <= maxDuration)
    }
    
    res.json(scenarios)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scenarios' })
  }
})

/**
 * @swagger
 * /api/scenarios/{id}:
 *   get:
 *     summary: Get scenario by ID
 *     tags: [Scenarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scenario ID
 *     responses:
 *       200:
 *         description: Scenario details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 *       404:
 *         description: Scenario not found
 */
router.get('/:id', (req, res) => {
  try {
    const scenario = Scenario.getById(req.params.id)
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' })
    }
    res.json(scenario)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve scenario' })
  }
})

/**
 * @swagger
 * /api/scenarios:
 *   post:
 *     summary: Create a new scenario
 *     tags: [Scenarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scenario'
 *     responses:
 *       201:
 *         description: Scenario created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 *       400:
 *         description: Invalid input data
 */
router.post('/', (req, res) => {
  try {
    const { error, value } = scenarioSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    const scenario = Scenario.create(value)
    res.status(201).json(scenario)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create scenario' })
  }
})

/**
 * @swagger
 * /api/scenarios/{id}:
 *   put:
 *     summary: Update a scenario
 *     tags: [Scenarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scenario ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Scenario'
 *     responses:
 *       200:
 *         description: Scenario updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Scenario'
 *       404:
 *         description: Scenario not found
 *       400:
 *         description: Invalid input data
 */
router.put('/:id', (req, res) => {
  try {
    const { error, value } = updateScenarioSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    const scenario = Scenario.update(req.params.id, value)
    if (!scenario) {
      return res.status(404).json({ error: 'Scenario not found' })
    }
    
    res.json(scenario)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update scenario' })
  }
})

/**
 * @swagger
 * /api/scenarios/{id}:
 *   delete:
 *     summary: Delete a scenario
 *     tags: [Scenarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Scenario ID
 *     responses:
 *       204:
 *         description: Scenario deleted successfully
 *       404:
 *         description: Scenario not found
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Scenario.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Scenario not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete scenario' })
  }
})

export default router