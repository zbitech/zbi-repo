import Joi, { ObjectSchema } from "joi";
import { NetworkType, NodeType, RoleType, UserFilterType } from "./zbi.enum";

//import { object, string, TypeOf } from "zod";


export const schemas = {

    localAuthRequest: Joi.object({
        body: Joi.object({
            email: Joi.string().email().required().label("email").messages({"any.required": "Email is required"}),
            password: Joi.string().required().label("password").messages({"any.required": "Password is required"})
        }),
        query: {},
        params: Joi.object({
            provider: "local"
        })
    }),

    externalAuthRequest: Joi.object({
        body: {},
        query: Joi.object({
            code: Joi.string().required().label("code").messages({"any.required": "code is required"})
        }),
        params: {}
    }),

    inviteResourceOwner: Joi.object({
        body: Joi.object({
            email: Joi.string().required().email().label("email").messages({"any.required": "email is required"})
        }),
        query: {},
        params: {}
    }),

    inviteTeamMember: Joi.object({
        body: Joi.object({
            email: Joi.string().required().email().label("email").messages({"any.required": "email is required"}),
            teamid: Joi.string().required().label("team").messages({"any.required": "team is required"})
        }),
        query: {},
        params: {}
    }),

    registerLocalRequest: Joi.object({
        body: Joi.object({
            name: Joi.string().required().label("name").messages({"any.required": "name is required"}),
            email: Joi.string().required().email().label("email").messages({"any.required": "email is required"}),
            password: Joi.string().required(),
            confirmPassword: Joi.ref('password'),
            acceptedTerms: Joi.boolean().required()
        }), //.with('password', 'confirmPassword')
        query: {},
        params: {}
    }),

    registerExternalRequest: Joi.object({
        body: Joi.object({
            name: Joi.string().required().label("name").messages({"any.required": "name is required"}),
            acceptedTerms: Joi.boolean().required()
        })
    }),

    findUsersRequest: Joi.object({
        body: {},
        query: Joi.object({
            name: Joi.string().valid(UserFilterType.role, UserFilterType.status).label("name"),
            value: Joi.string().label("value"),
            size: Joi.number().label("size"),
            page: Joi.number().label("page")
        }),
        params: {}
    }),

    findUserRequest: Joi.object({
        body: {},
        query: Joi.object({
            name: Joi.string().required().label("name"),
            condition: Joi.string().required().label("condition"),
            value: Joi.string().required().label("value"),
        }),
        params: {}
    }),

    updateUserRequest: Joi.object({
        body: Joi.object({
            email: Joi.string().required().email(),
            name: Joi.string().required()
        }),
        query: {},
        params: {}
    }),

    changePasswordRequest: Joi.object({
        body: Joi.object({
            email: Joi.string().required().email(),
            currentPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
            confirmPassword: Joi.string().required()
        }),
        query: {},
        params: {}
    }),

    findTeams: Joi.object({
        body: {},
        query: Joi.object({
            name: Joi.string().required().label("name"),
            condition: Joi.string().required().label("condition"),
            value: Joi.string().required().label("value"),
            size: Joi.number().label("size"),
            page: Joi.number().label("page")
        }),
        params: {}
    }),

    findTeam: Joi.object({
        body: {},
        query: Joi.object({
            name: Joi.string().required().label("name"),
            condition: Joi.string().required().label("condition"),
            value: Joi.string().required().label("value"),
        }),
        params: {}
    }),

    projectRequest: Joi.object().keys({
        body: Joi.object({
            name: Joi.string().alphanum().required(),
            network: Joi.string().valid(NetworkType.testnet,NetworkType.mainnet).required(),
            team: Joi.string().alphanum().required(),
            description: Joi.string()
        }),
        query: {},
        params: {}
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