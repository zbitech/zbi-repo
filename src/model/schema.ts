import Joi, { ObjectSchema } from "joi";

export const schemas = {

    userRequest: Joi.object({

    }),

    ownerRequest: Joi.object({

    }),

    projectRequest: Joi.object().keys({
        name: Joi.string().alphanum().required(),
        network: Joi.string().valid('testnet','mainnet').required(),
        team: Joi.string().alphanum().required(),
        description: Joi.string()
    }),

    newInstanceRequest: Joi.object({

    }),

    newZcashRequest: Joi.object({

    }),

    newLwdRequest: Joi.object({

    }),

    updateProjectRequest: Joi.object({

    }),

    updateInstanceRequest: Joi.object({

    }),

    updateZcashRequest: Joi.object({

    }),

    updateLwdRequest: Joi.object({

    })

}