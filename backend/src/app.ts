import { errors } from 'celebrate'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import 'dotenv/config'
import express, { json, urlencoded } from 'express'
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'
import mongoose from 'mongoose'
import path from 'path'

import { DB_ADDRESS } from '../config'
import errorHandler from './middlewares/error-handler'
import routes from './routes'

const { PORT = 3000 } = process.env

const app = express()

app.disable('x-powered-by')

app.set('trust proxy', 1)

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
)

app.use(
    rateLimit({
        windowMs: 10 * 1000,
        limit: 30,
        standardHeaders: true,
        legacyHeaders: false,
    })
)

app.use(
    cors({
        origin:
            process.env.ORIGIN_ALLOW ||
            process.env.FRONTEND_URL ||
            'http://localhost:5173',
        credentials: true,
    })
)

app.use(cookieParser())

app.use(
    express.static(path.join(__dirname, 'public'), {
        dotfiles: 'deny',
        index: false,
        maxAge: '7d',
    })
)

app.use(
    urlencoded({
        extended: false,
        limit: '1mb',
        parameterLimit: 50,
    })
)

app.use(
    json({
        limit: '1mb',
    })
)

app.use(routes)

app.use(errors())

app.use(errorHandler)

const connectWithRetry = async (attempts = 30) => {
    for (let i = 1; i <= attempts; i += 1) {
        try {
            await mongoose.connect(DB_ADDRESS)
            console.log('MongoDB connected')
            return
        } catch (error) {
            console.error(`Подключение к MongoDB не удалось (${i}/${attempts})`)

            if (i === attempts) {
                throw error
            }

            await new Promise((resolve) => {
                setTimeout(resolve, 2000)
            })
        }
    }
}

const bootstrap = async () => {
    try {
        await connectWithRetry()

        app.listen(PORT, () => {
            console.log(`Server started on ${PORT}`)
        })
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

bootstrap()
