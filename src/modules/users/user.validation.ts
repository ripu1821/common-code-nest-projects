/**
 * @format
 * User Joi Validation
 */

import * as Joi from 'joi';

const isValidEmail = (value, helpers) => {
  // Regular expression for email validation
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  const emojiRegex = /[\u0020-\u007e\u00a0-\u00ff\u0152\u0153\u0178]/g;

  if (!emailRegex.test(value)) {
    return helpers.error('any.invalid');
  }

  if (!emojiRegex.test(value)) {
    return helpers.error('any.invalid');
  }

  if (value.length > 50) {
    return helpers.error('string.max', { limit: 50 });
  }

  return value;
};

// registration user
const createUserSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .custom(isValidEmail)
    .messages({
      'any.invalid': 'Invalid email format',
      'string.max': 'Email address is too long (max {#limit} characters)',
    }),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be exactly 10 digits',
      'any.required': 'Mobile number is required',
    }),
  name: Joi.string().required().messages({
    'string.pattern.base': 'User name  is required.',
  }),
});

// update user by id
const updateUserSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'User id does not exist.',
    })
    .required(),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .custom(isValidEmail)
    .messages({
      'any.invalid': 'Invalid email format',
      'string.max': 'Email address is too long (max {#limit} characters)',
    })
    .optional()
    .allow(''),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Mobile number must be exactly 10 digits',
    })
    .optional()
    .allow(''),
  name: Joi.string().optional().allow(''),
});

// update user by id
const updateUserProfileSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'User id does not exist.',
    })
    .optional()
    .allow(''),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .custom(isValidEmail)
    .messages({
      'any.invalid': 'Invalid email format',
      'string.max': 'Email address is too long (max {#limit} characters)',
    })
    .optional()
    .allow(''),
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .messages({
      'string.pattern.base': 'Mobile number must be exactly 10 digits',
    })
    .optional()
    .allow(''),
  name: Joi.string().optional().allow(''),
});

// Find all User
const getAllUserSchema = Joi.object({
  search: Joi.string().allow(''),
});

// Delete User
const deleteUserSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'User id does not exist.',
  })
  .required();

// Find User By Id
const getUserByIdSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'User id does not exist.',
  })
  .required();

// login user
const createLoginSchema = Joi.object({
  mobile_number: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Mobile number must be exactly 10 digits',
      'any.required': 'Mobile number is required',
    }),
  otp: Joi.string()
    .pattern(/^[0-9]{4}$/)
    .required()
    .messages({
      'string.pattern.base': 'Otp must be exactly 4 digits',
      'any.required': 'Otp is required',
    }),
  device_details: Joi.object({
    user_id: Joi.string().optional().allow(''),
    device_unique_id: Joi.string().optional().allow(''),
    device_token_fcm: Joi.string().optional().allow(''),
    device_model: Joi.string().optional().allow(''),
    operating_system: Joi.string().optional().allow(''),
    os_version: Joi.string().optional().allow(''),
    is_login: Joi.boolean().optional().allow(''),
    app_version: Joi.string().optional().allow(''),
    last_login: Joi.string().optional().allow(''),
    last_logout: Joi.string().optional().allow(''),
    created_ts: Joi.string().optional().allow(''),
    force_logout: Joi.boolean().optional().allow(''),
  })
    .optional()
    .allow(''),
});

export default {
  createUserSchema,
  createLoginSchema,
  updateUserSchema,
  getAllUserSchema,
  deleteUserSchema,
  getUserByIdSchema,
  updateUserProfileSchema,
};
