// d:/kaaya eco resort/server/src/services/cloudinaryService.js
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

/**
 * Upload a file buffer or URL to Cloudinary.
 * folder: e.g. 'kaaya/gallery', 'kaaya/rooms'
 */
export async function uploadImage(source, folder = 'kaaya/gallery', options = {}) {
  const result = await cloudinary.uploader.upload(source, {
    folder,
    resource_type: 'image',
    quality:       'auto:good',
    fetch_format:  'auto',
    ...options,
  })
  return {
    url:      result.secure_url,
    publicId: result.public_id,
    width:    result.width,
    height:   result.height,
    format:   result.format,
  }
}

/**
 * Delete an image from Cloudinary by its public_id.
 */
export async function deleteImage(publicId) {
  return cloudinary.uploader.destroy(publicId)
}

/**
 * Generate a responsive image URL with transformation.
 * Useful for generating thumbnails or resized versions.
 */
export function transformUrl(publicId, { width = 800, height, crop = 'fill', quality = 'auto' } = {}) {
  return cloudinary.url(publicId, {
    width,
    ...(height ? { height } : {}),
    crop,
    quality,
    fetch_format: 'auto',
    secure: true,
  })
}

/**
 * Generate a signed upload URL for direct browser → Cloudinary uploads.
 * Use this to get a signature for client-side uploads without exposing the API secret.
 */
export function generateSignature(params) {
  const timestamp = Math.round(new Date().getTime() / 1000)
  const signature = cloudinary.utils.api_sign_request(
    { ...params, timestamp },
    process.env.CLOUDINARY_API_SECRET
  )
  return {
    signature,
    timestamp,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey:    process.env.CLOUDINARY_API_KEY,
  }
}

export default { uploadImage, deleteImage, transformUrl, generateSignature }
