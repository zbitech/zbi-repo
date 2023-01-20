// import mongoose from "mongoose";
// import { NetworkType, NodeType, RoleType, UserStatusType, InviteStatusType } from "../../model/zbi.enum";

// const Schema = mongoose.Schema;

// const userSchema = new Schema({
//     userName: {type: String, unique: true, required: true, trim: true, lowercase: true},
//     email: {type: String, unique: true, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], lowercase: true},
//     name: {type: String, required: true},
//     role: {type: String, required: true, enum:[RoleType.admin, RoleType.owner, RoleType.user]},
//     status: {type: String, enum:[UserStatusType.invited, UserStatusType.active, UserStatusType.inactive], default: UserStatusType.invited},
//     created: {type: Date, immutable: true, default: Date.now},
//     updated: {type: Date}
// });
// userSchema.pre('save', function(next){
//     this.set({updated: new Date()});
//     next();
// })

// export const UserSchema = mongoose.model("user", userSchema);

// const teamMemberSchema = new Schema({
//     user: {type: Schema.Types.ObjectId, ref: "user"},
//     role: {type: String, required: true, enum:[RoleType.user]},
//     status: {type: String, required: true, enum:[InviteStatusType.pending, InviteStatusType.accepted, InviteStatusType.rejected], default: InviteStatusType.pending},
//     created: {type: Date, immutable: true, default: Date.now},
//     updated: {type: Date}
// });
// teamMemberSchema.pre('save', function(next){
//     this.set({updated: new Date()});
//     next();
// })

// const teamSchema = new Schema({
//     name: {type: String},
//     owner: {type: Schema.Types.ObjectId, ref: "user"},
//     members: {type: [teamMemberSchema]},
//     created: {type: Date, immutable: true, default: Date.now},
//     updated: {type: Date}
// });
// teamSchema.pre('save', function(next){
//     this.set({updated: new Date()});
//     next();
// });
// // teamSchema.pre('findOneAndUpdate', function(next){
// //     this.set({updated: new Date()});
// //     next();
// // })


// export const TeamSchema = mongoose.model("team", teamSchema);

// const resourceRequest = new Schema({
//     dataVolumeType: {type: String}, 
//     dataVolumeSize: {type: String}, 
//     dataSourceType: {type: String},
//     dataSource: {type: String}, 
//     cpu: {type: String}, 
//     memory: {type: String},
//     peers: {type: [String]},
//     created: {type: Date, immutable: true, default: Date.now},
//     updated: {type: Date}
// });
// resourceRequest.pre('save', function(next){
//     this.set({updated: new Date()});
//     next();
// });

// const resourceSchema = new Schema({
//     name: {type: String}, 
//     type: {type: String}, 
//     status: {type: String}, 
//     properties: {type: Map, of: Object},
//     created: {type: Date, immutable: true, default: Date.now},
//     updated: {type: Date}
// });
// resourceSchema.index({name: 1, type: 1}, {unique: true});
// resourceSchema.pre('save', function(next){
//     this.set({updated: new Date()});
//     next();
// });

// const resourcesSchema = new Schema({
//     resources: {type: [resourceSchema]},
//     snapshots: {type: [resourceSchema]},
//     schedule: {type: resourceSchema}
// });

// const instanceSchema = new Schema({
//     name: {type: String}, 
//     type: {type: String, index: {unique: false}, enum: [NodeType.zcash, NodeType.lwd, NodeType.zebra]}, 
//     description: {type: String}, 
//     status: {type: String},
//     project: {type: Schema.Types.ObjectId, ref: "project"},
//     request: {type: resourceRequest}, 
//     resources: {type: resourcesSchema}, 
// //    activities: {type: [activitySchema]}, 
// //    policy: {type: instancePolicySchema},
//     created: {type: Date, immutable: true, default: Date.now},
//     updated: {type: Date}
// });
// instanceSchema.index({name: 1, type: 1}, {unique: true});
// instanceSchema.pre('save', function(next){
//     this.set({updated: new Date()});
//     next();
// });
// export const InstanceSchema = mongoose.model("instance", instanceSchema);


// const projectSchema = new Schema({
//     name: {type: String}, 
//     network: {type: String, required: true, enum: [NetworkType.testnet, NetworkType.regnet, NetworkType.mainnet]}, 
//     status: {type: String},
//     owner: {type: Schema.Types.ObjectId, ref: "user"},
//     team: {type: Schema.Types.ObjectId, ref: "team"},
//     description: {type: String},
// //    instances: {type: [instanceSchema]},
//     created: {type: Date, immutable: true, default: Date.now},
//     updated: {type: Date}
// });
// projectSchema.pre('save', function(next){
//     this.set({updated: new Date()});
//     next();
// })

// export const ProjectSchema = mongoose.model("project", projectSchema);
