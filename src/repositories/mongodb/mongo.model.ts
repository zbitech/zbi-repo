import mongoose, { Schema } from "mongoose";
import { NetworkType, NodeType, RoleType, UserStatusType, InviteStatusType } from "../../model/zbi.enum";

class MongoModel {

    private userSchema: Schema;
    private teamSchema: Schema;
    private instanceSchema: Schema;
    private projectSchema: Schema;

    userModel: any;
    teamModel: any;
    projectModel: any;
    instanceModel: any;

    constructor() {

        this.userSchema = new Schema({
            userName: {type: String, unique: true, required: true, trim: true, lowercase: true},
            email: {type: String, unique: true, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], lowercase: true},
            name: {type: String, required: true},
            role: {type: String, required: true, enum:[RoleType.admin, RoleType.owner, RoleType.user]},
            status: {type: String, enum:[UserStatusType.invited, UserStatusType.active, UserStatusType.inactive], default: UserStatusType.invited},
            created: {type: Date, immutable: true, default: Date.now},
            updated: {type: Date}
        });
        this.userSchema.pre('save', function(next){
            this.set({updated: new Date()});
            next();
        })
        
        this.userModel = mongoose.model("user", this.userSchema);

        const teamMemberSchema = new Schema({
            user: {type: Schema.Types.ObjectId, ref: "user"},
            role: {type: String, required: true, enum:[RoleType.user]},
            status: {type: String, required: true, enum:[InviteStatusType.pending, InviteStatusType.accepted, InviteStatusType.rejected], default: InviteStatusType.pending},
            created: {type: Date, immutable: true, default: Date.now},
            updated: {type: Date}
        });        
        teamMemberSchema.pre('save', function(next){
            this.set({updated: new Date()});
            next();
        })

        this.teamSchema = new Schema({
            name: {type: String},
            owner: {type: Schema.Types.ObjectId, ref: "user"},
            members: {type: [teamMemberSchema]},
            created: {type: Date, immutable: true, default: Date.now},
            updated: {type: Date}
        });
        this.teamSchema.pre('save', function(next){
            this.set({updated: new Date()});
            next();
        });

        this.teamModel = mongoose.model("team", this.teamSchema);
        
        this.projectSchema = new Schema({
            name: {type: String},
            network: {type: String, required: true, enum: [NetworkType.testnet, NetworkType.regnet, NetworkType.mainnet]},
            status: {type: String},
            owner: {type: Schema.Types.ObjectId, ref: "user"},
            team: {type: Schema.Types.ObjectId, ref: "team"},
            description: {type: String},
            created: {type: Date, immutable: true, default: Date.now},
            updated: {type: Date}
        });
        this.projectSchema.pre('save', function(next){
            this.set({updated: new Date()});
            next();
        });

        this.projectModel = mongoose.model("project", this.projectSchema);

        const resourceRequest = new Schema({
            dataVolumeType: {type: String},
            dataVolumeSize: {type: String},
            dataSourceType: {type: String},
            dataSource: {type: String},
            cpu: {type: String},
            memory: {type: String},
            peers: {type: [String]},
            created: {type: Date, immutable: true, default: Date.now},
            updated: {type: Date}
        });
        resourceRequest.pre('save', function(next){
            this.set({updated: new Date()});
            next();
        })

        const resourceSchema = new Schema({
            name: {type: String},
            type: {type: String},
            status: {type: String},
            properties: {type: Map, of: Object},
            created: {type: Date, immutable: true, default: Date.now},
            updated: {type: Date}
        });
        resourceSchema.index({name: 1, type: 1}, {unique: true});
        resourceSchema.pre('save', function(next){
            this.set({updated: new Date()});
            next();
        });

        const resourcesSchema = new Schema({
            resources: {type: [resourceSchema]},
            snapshots: {type: [resourceSchema]},
            schedule: {type: resourceSchema}
        });

        this.instanceSchema = new Schema({
            name: {type: String},
            type: {type: String, index: {unique: false}, enum: [NodeType.zcash, NodeType.lwd, NodeType.zebra]},
            description: {type: String},
            status: {type: String},
            project: {type: Schema.Types.ObjectId, ref: "project"},
            request: {type: resourceRequest},
            resources: {type: resourcesSchema},
        //    activities: {type: [activitySchema]},
        //    policy: {type: instancePolicySchema},
            created: {type: Date, immutable: true, default: Date.now},
            updated: {type: Date}
        });
        this.instanceSchema.index({name: 1, type: 1}, {unique: true});
        this.instanceSchema.pre('save', function(next){
            this.set({updated: new Date()});
            next();
        });
        
        this.instanceModel = mongoose.model("instance", this.instanceSchema);
    }

}

export default new MongoModel();