import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import dotenv from 'dotenv'

// Routes
import protocolRoutes from './routes/protocols.js'
import architectureRoutes from './routes/architectures.js'
import scenarioRoutes from './routes/scenarios.js'
import deploymentRoutes from './routes/deployments.js'
import authRoutes from './routes/auth.js'
import yamlRoutes from './routes/yaml.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(helmet())
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.text({ type: 'application/yaml' }))

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CyberLab Network Scenario Platform API',
      version: '1.0.0',
      description: 'API pour la plateforme de configuration et déploiement de scénarios réseau',
      contact: {
        name: 'CyberLab Team',
        email: 'support@cyberlab.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './models/*.js']
}

const swaggerSpec = swaggerJsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/protocols', protocolRoutes)
app.use('/api/architectures', architectureRoutes)
app.use('/api/scenarios', scenarioRoutes)
app.use('/api/deployments', deploymentRoutes)
app.use('/api/yaml', yamlRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'CyberLab Network Scenario Platform API',
    version: '1.0.0',
    documentation: '/api-docs'
  })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
  console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs`)
  console.log(`🏥 Health check available at http://localhost:${PORT}/health`)
})

export default app