import Joi, { ObjectSchema } from "joi";
import { NodeType } from "./zbi.enum";

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
        name: Joi.string().alphanum().required(),
        type: Joi.string().valid(NodeType.zcash, NodeType.lwd).required(),
        description: Joi.string()

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