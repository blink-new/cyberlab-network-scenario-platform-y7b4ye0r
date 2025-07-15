import express from 'express'
import Joi from 'joi'
import { Deployment } from '../models/Deployment.js'
import { Protocol } from '../models/Protocol.js'
import { Architecture } from '../models/Architecture.js'
import { Scenario } from '../models/Scenario.js'

const router = express.Router()

// Validation schemas
const deploymentSchema = Joi.object({
  protocolId: Joi.string().required(),
  architectureId: Joi.string().required(),
  scenarioId: Joi.string().required(),
  name: Joi.string().required(),
  resources: Joi.object({
    cpu: Joi.string().optional(),
    memory: Joi.string().optional(),
    storage: Joi.string().optional()
  }).optional()
})

const updateDeploymentSchema = Joi.object({
  name: Joi.string(),
  status: Joi.string().valid('pending', 'deploying', 'running', 'completed', 'failed', 'stopped'),
  resources: Joi.object({
    cpu: Joi.string(),
    memory: Joi.string(),
    storage: Joi.string()
  })
})

/**
 * @swagger
 * /api/deployments:
 *   get:
 *     summary: Get all deployments
 *     tags: [Deployments]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, deploying, running, completed, failed, stopped]
 *         description: Filter by deployment status
 *     responses:
 *       200:
 *         description: List of deployments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Deployment'
 */
router.get('/', (req, res) => {
  try {
    let deployments = Deployment.getAll()
    
    // Filter by status if provided
    if (req.query.status) {
      deployments = Deployment.getByStatus(req.query.status)
    }
    
    res.json(deployments)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve deployments' })
  }
})

/**
 * @swagger
 * /api/deployments/{id}:
 *   get:
 *     summary: Get deployment by ID
 *     tags: [Deployments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deployment ID
 *     responses:
 *       200:
 *         description: Deployment details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deployment'
 *       404:
 *         description: Deployment not found
 */
router.get('/:id', (req, res) => {
  try {
    const deployment = Deployment.getById(req.params.id)
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' })
    }
    res.json(deployment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve deployment' })
  }
})

/**
 * @swagger
 * /api/deployments:
 *   post:
 *     summary: Create a new deployment
 *     tags: [Deployments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deployment'
 *     responses:
 *       201:
 *         description: Deployment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deployment'
 *       400:
 *         description: Invalid input data
 */
router.post('/', async (req, res) => {
  try {
    const { error, value } = deploymentSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    // Validate that referenced entities exist
    const protocol = Protocol.getById(value.protocolId)
    const architecture = Architecture.getById(value.architectureId)
    const scenario = Scenario.getById(value.scenarioId)
    
    if (!protocol) {
      return res.status(400).json({ error: 'Protocol not found' })
    }
    if (!architecture) {
      return res.status(400).json({ error: 'Architecture not found' })
    }
    if (!scenario) {
      return res.status(400).json({ error: 'Scenario not found' })
    }
    
    const deployment = Deployment.create(value)
    
    // Simulate deployment process
    setTimeout(() => {
      Deployment.updateStatus(deployment.id, 'deploying')
      Deployment.addLog(deployment.id, {
        level: 'INFO',
        message: 'Starting Kubernetes deployment'
      })
      
      setTimeout(() => {
        Deployment.updateStatus(deployment.id, 'running')
        Deployment.addLog(deployment.id, {
          level: 'INFO',
          message: 'Deployment completed successfully'
        })
      }, 5000)
    }, 1000)
    
    res.status(201).json(deployment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deployment' })
  }
})

/**
 * @swagger
 * /api/deployments/{id}:
 *   put:
 *     summary: Update a deployment
 *     tags: [Deployments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deployment ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Deployment'
 *     responses:
 *       200:
 *         description: Deployment updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Deployment'
 *       404:
 *         description: Deployment not found
 *       400:
 *         description: Invalid input data
 */
router.put('/:id', (req, res) => {
  try {
    const { error, value } = updateDeploymentSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }
    
    const deployment = Deployment.update(req.params.id, value)
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' })
    }
    
    res.json(deployment)
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deployment' })
  }
})

/**
 * @swagger
 * /api/deployments/{id}:
 *   delete:
 *     summary: Delete a deployment
 *     tags: [Deployments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deployment ID
 *     responses:
 *       204:
 *         description: Deployment deleted successfully
 *       404:
 *         description: Deployment not found
 */
router.delete('/:id', (req, res) => {
  try {
    const deleted = Deployment.delete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ error: 'Deployment not found' })
    }
    
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deployment' })
  }
})

/**
 * @swagger
 * /api/deployments/{id}/logs:
 *   get:
 *     summary: Get deployment logs
 *     tags: [Deployments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deployment ID
 *     responses:
 *       200:
 *         description: Deployment logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   timestamp:
 *                     type: string
 *                     format: date-time
 *                   level:
 *                     type: string
 *                   message:
 *                     type: string
 *       404:
 *         description: Deployment not found
 */
router.get('/:id/logs', (req, res) => {
  try {
    const deployment = Deployment.getById(req.params.id)
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' })
    }
    
    res.json(deployment.logs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve logs' })
  }
})

/**
 * @swagger
 * /api/deployments/{id}/stop:
 *   post:
 *     summary: Stop a running deployment
 *     tags: [Deployments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Deployment ID
 *     responses:
 *       200:
 *         description: Deployment stopped successfully
 *       404:
 *         description: Deployment not found
 *       400:
 *         description: Deployment cannot be stopped
 */
router.post('/:id/stop', (req, res) => {
  try {
    const deployment = Deployment.getById(req.params.id)
    if (!deployment) {
      return res.status(404).json({ error: 'Deployment not found' })
    }
    
    if (deployment.status !== 'running') {
      return res.status(400).json({ error: 'Deployment is not running' })
    }
    
    Deployment.updateStatus(req.params.id, 'stopped')
    Deployment.addLog(req.params.id, {
      level: 'INFO',
      message: 'Deployment stopped by user'
    })
    
    res.json({ message: 'Deployment stopped successfully' })
  } catch (error) {
    res.status(500).json({ error: 'Failed to stop deployment' })
  }
})

export default router