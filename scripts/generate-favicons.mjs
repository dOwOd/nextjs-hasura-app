import sharp from 'sharp'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const SOURCE = resolve(root, 'public/images/IMG_4236.png')

const TARGETS = [
  { output: resolve(root, 'src/app/icon.png'), size: 32 },
  { output: resolve(root, 'src/app/apple-icon.png'), size: 180 },
  { output: resolve(root, 'public/favicon.ico'), size: 32 },
]

const metadata = await sharp(SOURCE).metadata()
const { width, height } = metadata
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
