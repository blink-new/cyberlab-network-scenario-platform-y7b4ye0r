import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const yamlDataDir = path.resolve(__dirname, '../data/yaml')

export const readYamlFile = (filename) => {
  try {
    const filePath = path.join(yamlDataDir, filename)
    const fileContents = fs.readFileSync(filePath, 'utf8')
    return yaml.load(fileContents)
  } catch (e) {
    console.error(`Error reading YAML file ${filename}:`, e)
    return null
  }
}

export const listYamlFiles = () => {
  try {
    return fs.readdirSync(yamlDataDir).filter(file => file.endsWith('.yaml'))
  } catch (e) {
    console.error("Error listing YAML files:", e)
    return []
  }
}