import 'dotenv/config'

const {
    DB_ADDRESS = 'mongodb://localhost:27017/weblarek',
    AUTH_ACCESS_TOKEN_SECRET,
    AUTH_REFRESH_TOKEN_SECRET,
} = process.env

const accessSecret = AUTH_ACCESS_TOKEN_SECRET || 'secret-dev'
const refreshSecret = AUTH_REFRESH_TOKEN_SECRET || 'secret-dev-refresh'

export const ACCESS_TOKEN = {
    secret: accessSecret,
    expiry: '15m',
}

export const REFRESH_TOKEN = {
    secret: refreshSecret,
    expiry: '7d',
    cookie: {
        name: 'refreshToken',
        options: {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
    },
}

export { DB_ADDRESS }
