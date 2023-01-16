import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    name: {type: String, required: true},
    role: {type: String, required: true, enum:['admin', 'owner', 'user']},
    created: {type: Date, default: Date.now},
    updated: {type: Date}
});

export const UserSchema = mongoose.model("user", userSchema);

const teamMemberSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: "user"},
    role: {type: String, required: true, enum:['owner', 'user']},
    created: {type: Date, default: Date.now},
    updated: {type: Date}
});

const teamSchema = new Schema({
    teamId: {type: String, unique: true},
    name: {type: String},
    members: {type: [teamMemberSchema]},
    created: {type: Date, default: Date.now},
    updated: {type: Date}
});

export const TeamSchema = mongoose.model("team", teamSchema);

const resourceRequest = new Schema({
    dataVolumeType: {type: String}, 
    dataVolumeSize: {type: String}, 
    dataSourceType: {type: String},
    dataSource: {type: String}, 
    cpu: {type: String}, 
    memory: {type: String},
    peers: {type: [String]}
});


const resourceSchema = new Schema({
    name: {type: String}, 
    type: {type: String}, 
    status: {type: String}, 
    properties: {type: Map, of: Object},
    created: {type: Date, default: Date.now},
    updated: {type: Date}
});
resourceSchema.index({name: 1, type: 1}, {unique: true});


const instanceSchema = new Schema({
    name: {type: String}, 
    type: {type: String, index: {unique: false}, enum: ['zcash', 'lwd', 'zebra']}, 
    description: {type: String}, 
    status: {type: String},
    request: {type: resourceRequest}, 
    resources: {type: [resourceSchema]}, 
//    activities: {type: [activitySchema]}, 
//    policy: {type: instancePolicySchema},
    created: {type: Date, default: Date.now},
    updated: {type: Date}
});
instanceSchema.index({name: 1, type: 1}, {unique: true});


const projectSchema = new Schema({
    name: {type: String}, 
    network: {type: String, required: true, enum: ['testnet', 'regnet', 'mainnet']}, 
    status: {type: String},
    owner: {type: Schema.Types.ObjectId, ref: "user"},
    team: {type: Schema.Types.ObjectId, ref: "team"},
    description: {type: String},
    instances: {type: [instanceSchema]},
    created: {type: Date, default: Date.now},
    updated: {type: Date}
});

export const ProjectSchema = mongoose.model("project", projectSchema);
