import Joi from "joi";

export const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  usernameOrEmail: Joi.string().required(),
  password: Joi.string().required()
});

export const updateUsernameSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required()
});

export const updateEmailSchema = Joi.object({
  email: Joi.string().email().required()
});