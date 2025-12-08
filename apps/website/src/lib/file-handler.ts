export function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const imageUrl = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(imageUrl)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(imageUrl)
      reject(new Error('Failed to load image'))
    }

    img.src = imageUrl
  })
}

export function validateImageFile(file: File): boolean {
  return file.type.startsWith('image/')
}
