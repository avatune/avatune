/**
 * Resolve the model path relative to this file
 */
export const getModelPath = (): string => {
  const baseUrl = (globalThis as any).__TFJS_MODEL_BASE_URL__ || '/models'
  return `${baseUrl}/hair-color/model.json`
}

export const getClassesPath = (): string => {
  const modelPath = getModelPath()
  return modelPath.replace('model.json', 'classes.json')
}
