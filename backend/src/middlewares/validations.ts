import { Joi, celebrate } from 'celebrate'
import { Types } from 'mongoose'
import sanitizeHtml from 'sanitize-html'

export const phoneRegExp = /^\+?[\d\s()-]{5,20}$/

export enum PaymentType {
    Card = 'card',
    Online = 'online',
}

const clean = (value: string) =>
    sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} })

const text = (max: number, min = 1) =>
    Joi.string().min(min).max(max).custom(clean)

const objectId = Joi.string().custom((value, helpers) =>
    Types.ObjectId.isValid(value)
        ? value
        : helpers.message({ custom: 'Невалидный id' })
)

const image = Joi.object().keys({
    fileName: Joi.string()
        .pattern(/^\/?(images|temp)\/[\w-]+\.(png|jpe?g|gif)$/i)
        .required(),
    originalName: text(100).required(),
})

export const validateOrderBody = celebrate({
    body: Joi.object().keys({
        items: Joi.array().items(objectId).min(1).max(100).required(),
        payment: Joi.string()
            .valid(...Object.values(PaymentType))
            .required(),
        email: Joi.string().email().max(100).required(),
        phone: Joi.string().pattern(phoneRegExp).required(),
        address: text(200).required(),
        total: Joi.number().required(),
        comment: text(500).allow('').optional(),
    }),
})

export const validateProductBody = celebrate({
    body: Joi.object().keys({
        title: text(30, 2).required(),
        image,
        category: text(50).required(),
        description: text(1000).required(),
        price: Joi.number().allow(null),
    }),
})

export const validateProductUpdateBody = celebrate({
    body: Joi.object().keys({
        title: text(30, 2),
        image,
        category: text(50),
        description: text(1000),
        price: Joi.number().allow(null),
    }),
})

export const validateObjId = celebrate({
    params: Joi.object().keys({
        productId: objectId.required(),
    }),
})

export const validateUserBody = celebrate({
    body: Joi.object().keys({
        name: text(30, 2),
        password: Joi.string().min(6).max(64).required(),
        email: Joi.string().email().max(100).required(),
    }),
})

export const validateUserUpdate = celebrate({
    body: Joi.object().keys({
        name: text(30, 2),
        email: Joi.string().email().max(100),
    }),
})

export const validateCustomerUpdate = celebrate({
    body: Joi.object().keys({
        name: text(30, 2),
        email: Joi.string().email().max(100),
        phone: Joi.string().pattern(phoneRegExp),
    }),
})

export const validateAuthentication = celebrate({
    body: Joi.object().keys({
        email: Joi.string().email().max(100).required(),
        password: Joi.string().max(64).required(),
    }),
})
