import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { readdirSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const FAVICON_DIR = resolve(root, 'public/images/favicon')
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp']

const files = readdirSync(FAVICON_DIR).filter((f) =>
  IMAGE_EXTENSIONS.some((ext) => f.toLowerCase().endsWith(ext)),
)

if (files.length === 0) {
  console.error(`Error: No image found in ${FAVICON_DIR}`)
  process.exit(1)
}
if (files.length > 1) {
  console.error(
    `Error: Multiple images found in ${FAVICON_DIR}: ${files.join(', ')}`,
  )
  console.error('Place exactly one image in this directory.')
  process.exit(1)
}

const SOURCE = resolve(FAVICON_DIR, files[0])
console.log(`Source: ${SOURCE}`)

const TARGETS = [
  { output: resolve(root, 'src/app/icon.png'), size: 32 },
  { output: resolve(root, 'src/app/apple-icon.png'), size: 180 },
  { output: resolve(root, 'public/favicon.ico'), size: 32 },
]

const { width, height } = await sharp(SOURCE).metadata()
const cropSize = Math.min(width, height)
const left = Math.round((width - cropSize) / 2)
const top = Math.round((height - cropSize) / 2)

for (const { output, size } of TARGETS) {
  await sharp(SOURCE)
    .extract({ left, top, width: cropSize, height: cropSize })
    .resize(size, size)
    .png()
    .toFile(output)

  console.log(`Generated: ${output} (${size}x${size})`)
}
