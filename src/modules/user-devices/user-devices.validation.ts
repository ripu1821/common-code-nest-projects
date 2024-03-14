/**
 * @format
 * User Device Joi Validation
 */

import * as Joi from 'joi';

// Create User Device
const createUserDeviceSchema = Joi.object({
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
});

// Delete User Device
const deleteUserDeviceSchema = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'User Device id does not exist.',
  })
  .required();

// Find UserDevice By Id
const getUserDeviceById = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .messages({
    'string.pattern.base': 'User Device id does not exist.',
  })
  .required();

// Update User Device
const updateUserDeviceSchema = Joi.object({
  id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'User Device id does not exist.',
    })
    .required(),
  user_id: Joi.string().optional().allow(''),
  device_unique_id: Joi.string().optional().allow(''),
  device_token_fcm: Joi.string().optional().allow(''),
  device_model: Joi.string().optional().allow(''),
  operating_system: Joi.string().optional().allow(''),
  os_version: Joi.string().optional().allow(''),
  is_login: Joi.boolean().optional().allow(''),
  app_version: Joi.string().optional().allow(''),
  last_login: Joi.date().optional().allow(''),
  last_logout: Joi.date().optional().allow(''),
  created_ts: Joi.date().optional().allow(''),
  force_logout: Joi.boolean().optional().allow(''),
});

export default {
  createUserDeviceSchema,
  updateUserDeviceSchema,
  getUserDeviceById,
  deleteUserDeviceSchema,
};
