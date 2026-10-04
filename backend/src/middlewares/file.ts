import crypto from 'crypto'
import { Express, Request } from 'express'
import { mkdirSync } from 'fs'
import multer, { FileFilterCallback } from 'multer'
import { extname, join } from 'path'
import BadRequestError from '../errors/bad-request-error'

type DestinationCallback = (error: Error | null, destination: string) => void

type FileNameCallback = (error: Error | null, filename: string) => void

const allowedTypes = ['image/png', 'image/jpeg', 'image/gif']

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.gif']

const storage = multer.diskStorage({
    destination: (
        _req: Request,
        _file: Express.Multer.File,
        cb: DestinationCallback
    ) => {
        const destinationPath = join(
            __dirname,
            '../public',
            process.env.UPLOAD_PATH_TEMP || 'temp'
        )

        mkdirSync(destinationPath, { recursive: true })

        cb(null, destinationPath)
    },

    filename: (
        _req: Request,
        file: Express.Multer.File,
        cb: FileNameCallback
    ) => {
        const extension = extname(file.originalname).toLowerCase()

        cb(null, `${crypto.randomUUID()}${extension}`)
    },
})

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const extension = extname(file.originalname).toLowerCase()

    if (
        !allowedTypes.includes(file.mimetype) ||
        !allowedExtensions.includes(extension)
    ) {
        return cb(new BadRequestError('Недопустимый тип файла'))
    }

    return cb(null, true)
}

export default multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1,
    },
})
