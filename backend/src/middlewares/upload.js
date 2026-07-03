const multer = require('multer')
const sharp  = require('sharp')
const path   = require('path')
const fs     = require('fs')
const { v4: uuid } = require('uuid')
const { UPLOAD_DIR, MAX_FILE_SIZE } = require('../config/env')

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

function createUploader(folder) {
  const dest = path.join(UPLOAD_DIR, folder)
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })

  const storage = multer.memoryStorage()

  const fileFilter = (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true)
    else cb(new Error(`Only ${ALLOWED_TYPES.join(', ')} files allowed`), false)
  }

  return multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE },
  })
}

async function processAndSave(buffer, folder, options = {}) {
  const {
    width   = 800,
    height  = 800,
    quality = 85,
    fit     = 'cover',
  } = options

  const filename = `${uuid()}.webp`
  const filepath = path.join(UPLOAD_DIR, folder, filename)

  await sharp(buffer)
    .resize(width, height, { fit, withoutEnlargement: true })
    .webp({ quality })
    .toFile(filepath)

  return `/${UPLOAD_DIR}/${folder}/${filename}`
}

async function processMultiple(files, folder, options = {}) {
  return Promise.all(files.map(f => processAndSave(f.buffer, folder, options)))
}

module.exports = { createUploader, processAndSave, processMultiple }
