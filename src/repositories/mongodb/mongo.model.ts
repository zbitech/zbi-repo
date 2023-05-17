import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { NetworkType, NodeType, RoleType, UserStatusType, InviteStatusType, ResourceType, LoginProvider } from "../../model/zbi.enum";

class MongoModel {

//    private registrationSchema: Schema;
    private userSchema: Schema;
    private teamSchema: Schema;
    private instanceSchema: Schema;
    private projectSchema: Schema;
    private projectJobSchema: Schema;
    private instanceJobSchema: Schema;

//    registrationModel: any;
    userModel: any;
    teamModel: any;
    projectModel: any;
    instanceModel: any;
    projectJobModel: any;
    instanceJobModel: any;

    constructor() {

 //       this.registrationSchema = new Schema({email: {type: String}, acceptedTerms: {type: Boolean}}, {timestamps: true});
 //       this.registrationModel = mongoose.model("registration", this.registrationSchema);

        const registrationSchema = new Schema({acceptedTerms: {type: Boolean}, provider: {type: String, enum:[LoginProvider.local, LoginProvider.google]}}, {timestamps: true});

        this.userSchema = new Schema({
            email: {type: String, unique: true, required: true, trim: true, match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], lowercase: true},
            name: {type: String, required: false},
            role: {type: String, required: true, enum:[RoleType.admin, RoleType.owner, RoleType.user]},
            status: {type: String, enum:[UserStatusType.invited, UserStatusType.active, UserStatusType.inactive], default: UserStatusType.invited},
            password: { type: String, required: false },
            registration: {type: registrationSchema}
        }, { timestamps: true});
        
        this.userModel = mongoose.model("user", this.userSchema);

        const teamMemberSchema = new Schema({
            user: {type: Schema.Types.ObjectId, ref: "user"},
            role: {type: String, required: true, enum:[RoleType.user]},
            status: {type: String, required: true, enum:[InviteStatusType.pending, InviteStatusType.accepted, InviteStatusType.rejected], default: InviteStatusType.pending},
        }, { timestamps: true});

        this.teamSchema = new Schema({
            name: {type: String},
            owner: {type: Schema.Types.ObjectId, ref: "user"},
            members: {type: [teamMemberSchema]},
        }, { timestamps: true});

        this.teamModel = mongoose.model("team", this.teamSchema);
        
        this.projectSchema = new Schema({
            name: {type: String, required: true, immutable: true},
            network: {type: String, required: true, immutable: true, enum: [NetworkType.testnet, NetworkType.regnet, NetworkType.mainnet]},
            status: {type: String},
            owner: {type: Schema.Types.ObjectId, ref: "user"},
            team: {type: Schema.Types.ObjectId, ref: "team"},
            description: {type: String},
        }, { timestamps: true});

        this.projectModel = mongoose.model("project", this.projectSchema);

        const resourceRequest = new Schema({
            dataVolumeType: {type: String},
            dataVolumeSize: {type: String},
            dataSourceType: {type: String},
            dataSource: {type: String},
            cpu: {type: String},
            memory: {type: String},
            peers: {type: [String]},
        }, { timestamps: true});

        const resourceSchema = new Schema({
            name: {type: String},
            type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                        ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
            status: {type: String},
            properties: {type: Map, of: Object},
        }, { timestamps: true});
        resourceSchema.index({name: 1, type: 1}, {unique: true});

        const resourcesSchema = new Schema({
            configmap: {type: resourceSchema, default: {}},
            secret: {type: resourceSchema, default: {}},
            persistentvolumeclaim: {type: resourceSchema, default: {}},
            deployment: {type: resourceSchema, default: {}},
            service: {type: resourceSchema, default: {}},
            httpproxy: {type: resourceSchema, default: {}},
            volumesnapshot: {type: [resourceSchema], default: []},
            snapshotschedule: {type: resourceSchema, default: {}}
        });

        this.instanceSchema = new Schema({
            name: {type: String, required: true, immutable: true},
            type: {type: String, required: true, immutable: true, enum: [NodeType.zcash, NodeType.lwd, NodeType.zebra]},
            description: {type: String},
            status: {type: String},
            project: {type: Schema.Types.ObjectId, ref: "project", immutable: true},
            request: {type: resourceRequest},
            resources: {type: resourcesSchema, default: {}},
        }, { timestamps: true});
        this.instanceSchema.index({name: 1, type: 1}, {unique: true});
        
        this.instanceModel = mongoose.model("instance", this.instanceSchema);

        this.projectJobSchema = new Schema({
            user: {type: Schema.Types.ObjectId, ref: "user", immutable: true},
            id: {type: Schema.Types.ObjectId, ref: "project", immutable: true},
            payload: {type: String},
            type: {type: String, enum: ["create_project", "delete_project", "repair_project"]},
            scheduled: {type: Date},
            completed: {type: Date},
            status: {type: String, enum: ["pending", "scheduled", "started", "failed", "completed"]}
        }, { timestamps: true});

        this.projectJobSchema.index({"completedAt": 1}, {expireAfterSeconds: 86400});
        this.projectJobModel = mongoose.model("project_jobs", this.projectJobSchema);

        this.instanceJobSchema = new Schema({
            user: {type: Schema.Types.ObjectId, ref: "user", immutable: true},
            id: {type: Schema.Types.ObjectId, ref: "instance", immutable: true},
            payload: {type: String},
            type: {type: String, enum: ["create_instance", "delete_instance", "update_instance", "repair_instance", "start_instance", "stop_instance", "create_snapshot", "delete_snapshot", "create_schedule", "delete_schedule"]},
            scheduled: {type: Date},
            completedAt: {type: Date},
            status: {type: String, enum: ["pending", "scheduled", "started", "failed", "completed"]}
        }, { timestamps: true});

        this.instanceJobSchema.index({"completedAt": 1}, {expireAfterSeconds: 86400});
        this.instanceJobModel = mongoose.model("instance_jobs", this.instanceJobSchema);
    }
}

export default new MongoModel();