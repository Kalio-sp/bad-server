import { NextFunction, Request, Response } from 'express'
import { unlink } from 'fs/promises'
import { constants } from 'http2'
import sharp from 'sharp'
import BadRequestError from '../errors/bad-request-error'

export const uploadFile = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        if (!req.file) {
            return next(new BadRequestError('Файл не загружен'))
        }

        try {
            if (req.file.size < 2 * 1024) {
                throw new BadRequestError('Файл слишком маленький')
            }
            await sharp(req.file.path).metadata()
        } catch (error) {
            await unlink(req.file.path).catch(() => {})
            return next(
                error instanceof BadRequestError
                    ? error
                    : new BadRequestError('Файл не является изображением')
            )
        }

        const fileName = process.env.UPLOAD_PATH
            ? `/${process.env.UPLOAD_PATH}/${req.file.filename}`
            : `/${req.file.filename}`

        return res.status(constants.HTTP_STATUS_CREATED).json({
            fileName,
            originalName: Buffer.from(req.file.originalname, 'latin1')
                .toString('utf8')
                .slice(0, 100),
        })
    } catch (error) {
        return next(error)
    }
}

export default {}
