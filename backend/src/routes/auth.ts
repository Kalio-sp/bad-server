import { Router, Request, Response } from 'express'
import {
    getCurrentUser,
    getCurrentUserRoles,
    login,
    logout,
    refreshAccessToken,
    register,
    updateCurrentUser,
} from '../controllers/auth'
import auth from '../middlewares/auth'
import csrfProtection from '../middlewares/csrf'
import {
    validateAuthentication,
    validateUserBody,
    validateUserUpdate,
} from '../middlewares/validations'

const router = Router()

router.get('/csrf-token', csrfProtection, (req: Request, res: Response) => {
    res.json({
        csrfToken: req.csrfToken(),
    })
})

router.post('/login', validateAuthentication, login)

router.post('/register', validateUserBody, register)

router.get('/user', auth, getCurrentUser)

router.get('/roles', auth, getCurrentUserRoles)

router.get('/user/roles', auth, getCurrentUserRoles)

router.get('/logout', auth, logout)

router.get('/token', refreshAccessToken)

router.patch(
    '/user',
    auth,
    csrfProtection,
    validateUserUpdate,
    updateCurrentUser
)

export default router
