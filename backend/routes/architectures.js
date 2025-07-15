import express from 'express'
import Joi from 'joi'
import { Architecture } from '../models/Architecture.js'

const router = express.Router()

// Validation schemas
const architectureSchema = Joi.object({
  name: Joi.string().required(),
  topology: Joi.string().valid('linear', 'star', 'mesh', 'ring', 'tree', 'hybrid').required(),
  description: Joi.string().allow(''),
  nodesCount: Joi.number().integer().min(1).required(),
  difficulty: Joi.string().valid('Simple', 'Medium', 'Complex').required(),
  configuration: Joi.object().optional()
})

const updateArchitectureSchema = Joi.object({
  name: Joi.string(),
  topology: Joi.string().valid('linear', 'star', 'mesh', 'ring', 'tree', 'hybrid'),
  description: Joi.string().allow(''),
  nodesCount: Joi.number().integer().min(1),
  difficulty: Joi.string().valid('Simple', 'Medium', 'Complex'),
  configuration: Joi.object()
})

/**
 * @swagger
 * /api/architectures:
 *   get:
 *     summary: Get all architectures
 *     tags: [Architectures]
 *     parameters:
 *       - in: query
 *         name: topology
 *         schema:
 *           type: string
 *           enum: [linear, star, mesh, ring, tree, hybrid]
 *         description: Filter by topology type
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Simple, Medium, Complex]
 *         description: Filter by difficulty level
 *       - in: query
 *         name: minNodes
 *         schema:
 *           type: integer
 *         description: Minimum number of nodes
 *       - in: query
 *         name: maxNodes
 *         schema:
 *           type: integer
 *         description: Maximum number of nodes
 *     responses:
 *       200:
 *         description: List of architectures
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Architecture'
 */
router.get('/', (req, res) => {
  try {
    let architectures = Architecture.getAll()
    
    // Filter by topology if provided
    if (req.query.topology) {
      architectures = Architecture.getByTopology(req.query.topology)
    }
    
    // Filter by difficulty if provided
    if (req.query.difficulty) {
      architectures = architectures.filter(a => a.difficulty === req.query.difficulty)
    }
    
    // Filter by nodes range if provided
    if (req.query.minNodes || req.query.maxNodes) {
      const min = parseInt(req.query.minNodes) || 0
      const max = parseInt(req.query.maxNodes) || Infinity
      architectures = architectures.filter(a => a.nodesCount >= min && a.nodesCount <= max)
    }
    
    res.json(architectures)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve architectures' })
  }
})

/**
 * @swagger
 * /api/architectures/{id}:
 *   get:
 *     summary: Get architecture by ID
 *     tags: [Architectures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Architecture ID
 *     responses:
 *       200:
 *         description: Architecture details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Architecture'
 *       404:
 *         description: Architecture not found
 */
router.get('/:id', (req, res) => {
  try {
    const architecture = Architecture.getById(req.params.id)
    if (!architecture) {
      return res.status(404).json({ error: 'Architecture not found' })
    }
    res.json(architecture)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve architecture' })
  }
})

/**
 * @swagger
 * /api/architectures:
 *   post:
 *     summary: Create a new architecture
 *     tags: [Architectures]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Architecture'
 *     responses:
 *       201:
 *         description: Architecture created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Architecture'
 *       400:
 *         description: Invalid input data
 */
router.post('/', (req, res) => {
  try {
    const { error, value } = architectureSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    const architecture = Architecture.create(value)
    res.status(201).json(architecture)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create architecture' })
  }
})

/**
 * @swagger
 * /api/architectures/{id}:
 *   put:
 *     summary: Update an architecture
 *     tags: [Architectures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Architecture ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Architecture'
 *     responses:
 *       200:
 *         description: Architecture updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Architecture'
 *       404:
 *         description: Architecture not found
 *       400:
 *         description: Invalid input data
 */
router.put('/:id', (req, res) => {
  try {
    const { error, value } = updateArchitectureSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    const architecture = Architecture.update(req.params.id, value)
    if (!architecture) {
      return res.status(404).json({ error: 'Architecture not found' })
    }
    
    res.json(architecture)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update architecture' })
  }
})

/**
 * @swagger
 * /api/architectures/{id}:
 *   delete:
 *     summary: Delete an architecture
 *     tags: [Architectures]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Architecture ID
 *     responses:
 *       204:
 *         description: Architecture deleted successfully
 *       404:
 *         description: Architecture not found
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Architecture.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Architecture not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete architecture' })
  }
})

export default router