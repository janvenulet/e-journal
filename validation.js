const Joi = require("@hapi/joi");

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
                .min(6)
                .max(20)
                .required(),
        email: Joi.string()
            .min(5)
            .required()
            .email(),
        password: Joi.string()
            .min(6)
            .max(30)
            .required()
    });
    return schema.validate(data);
};

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string()
            .min(6)
            .required(),
        password: Joi.string()
            .min(6)
            .required()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;