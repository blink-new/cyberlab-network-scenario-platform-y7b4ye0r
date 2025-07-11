import express from 'express'
import Joi from 'joi'
import { Protocol } from '../models/Protocol.js'

const router = express.Router()

// Validation schemas
const protocolSchema = Joi.object({
  name: Joi.string().required(),
  version: Joi.string().required(),
  description: Joi.string().allow(''),
  category: Joi.string().valid('transport', 'routing', 'application', 'security').required(),
  complexity: Joi.string().valid('Beginner', 'Intermediate', 'Advanced').required(),
  parameters: Joi.object().optional()
})

const updateProtocolSchema = Joi.object({
  name: Joi.string(),
  version: Joi.string(),
  description: Joi.string().allow(''),
  category: Joi.string().valid('transport', 'routing', 'application', 'security'),
  complexity: Joi.string().valid('Beginner', 'Intermediate', 'Advanced'),
  parameters: Joi.object()
})

/**
 * @swagger
 * /api/protocols:
 *   get:
 *     summary: Get all protocols
 *     tags: [Protocols]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [transport, routing, application, security]
 *         description: Filter by protocol category
 *       - in: query
 *         name: complexity
 *         schema:
 *           type: string
 *           enum: [Beginner, Intermediate, Advanced]
 *         description: Filter by complexity level
 *     responses:
 *       200:
 *         description: List of protocols
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Protocol'
 */
router.get('/', (req, res) => {
  try {
    let protocols = Protocol.getAll()
    
    // Filter by category if provided
    if (req.query.category) {
      protocols = Protocol.getByCategory(req.query.category)
    }
    
    // Filter by complexity if provided
    if (req.query.complexity) {
      protocols = protocols.filter(p => p.complexity === req.query.complexity)
    }
    
    res.json(protocols)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve protocols' })
  }
})

/**
 * @swagger
 * /api/protocols/{id}:
 *   get:
 *     summary: Get protocol by ID
 *     tags: [Protocols]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Protocol ID
 *     responses:
 *       200:
 *         description: Protocol details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Protocol'
 *       404:
 *         description: Protocol not found
 */
router.get('/:id', (req, res) => {
  try {
    const protocol = Protocol.getById(req.params.id)
    if (!protocol) {
      return res.status(404).json({ error: 'Protocol not found' })
    }
    res.json(protocol)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve protocol' })
  }
})

/**
 * @swagger
 * /api/protocols:
 *   post:
 *     summary: Create a new protocol
 *     tags: [Protocols]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Protocol'
 *     responses:
 *       201:
 *         description: Protocol created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Protocol'
 *       400:
 *         description: Invalid input data
 */
router.post('/', (req, res) => {
  try {
    const { error, value } = protocolSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    const protocol = Protocol.create(value)
    res.status(201).json(protocol)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create protocol' })
  }
})

/**
 * @swagger
 * /api/protocols/{id}:
 *   put:
 *     summary: Update a protocol
 *     tags: [Protocols]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Protocol ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Protocol'
 *     responses:
 *       200:
 *         description: Protocol updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Protocol'
 *       404:
 *         description: Protocol not found
 *       400:
 *         description: Invalid input data
 */
router.put('/:id', (req, res) => {
  try {
    const { error, value } = updateProtocolSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    const protocol = Protocol.update(req.params.id, value)
    if (!protocol) {
      return res.status(404).json({ error: 'Protocol not found' })
    }
    
    res.json(protocol)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update protocol' })
  }
})

/**
 * @swagger
 * /api/protocols/{id}:
 *   delete:
 *     summary: Delete a protocol
 *     tags: [Protocols]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Protocol ID
 *     responses:
 *       204:
 *         description: Protocol deleted successfully
 *       404:
 *         description: Protocol not found
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Protocol.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Protocol not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete protocol' })
  }
})

export default router