import express from 'express'
import Joi from 'joi'
import yaml from 'js-yaml'

const router = express.Router()

const yamlDeploymentSchema = Joi.object({
  protocol: Joi.object().required(),
  architecture: Joi.object().required(),
  scenario: Joi.object().required()
})

router.post('/', async (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'string' || req.body.trim() === '') {
      return res.status(400).json({ error: 'YAML input is empty.' })
    }
    let doc
    try {
      doc = yaml.load(req.body)
    } catch (parseErr) {
      return res.status(400).json({ error: 'YAML parsing error: ' + parseErr.message })
    }
    if (!doc || typeof doc !== 'object') {
      return res.status(400).json({ error: 'YAML does not contain a valid object.' })
    }
    const { error, value } = yamlDeploymentSchema.validate(doc)
    if (error) {
      return res.status(400).json({ error: `YAML validation failed: ${error.details[0].message}` })
    }
    // Pour l’instant, on ne crée pas de déploiement, on renvoie juste l’objet structuré
    res.status(200).json({ parsed: value })
  } catch (e) {
    res.status(500).json({ error: 'Unexpected server error.' })
  }
})

export default router