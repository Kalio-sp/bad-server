import { ErrorRequestHandler } from 'express'

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    const statusCode =
        err.name === 'MulterError' ? 400 : err.statusCode || err.status || 500
    if (statusCode >= 500) {
        console.error(err.message)
    }

    res.status(statusCode).send({
        message:
            statusCode === 500 ? 'На сервере произошла ошибка' : err.message,
    })
}

export default errorHandler
