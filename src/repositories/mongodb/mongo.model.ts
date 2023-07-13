import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import { NetworkType, NodeType, RoleType, UserStatusType, InviteStatusType, ResourceType, LoginProvider, StateType } from "../../model/zbi.enum";

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

        const jobSchema = new Schema({id: {type: String}, status: {type: String},
            /*name: {type: String},
            type: {type: String, required: true, enum: ['project', 'instance', 'resource']},
            active: {type: Boolean}, completed: {type: Boolean}, delayed: {type: Boolean}, failed: {type: Boolean},
            waiting: {type: Boolean}, finishedOn: {type: Number}, failedReason: {type: String},
            project: {type: String}, instance: {type: String},
            resource_name: {type: String},
            resource_type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                        ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]}*/
        }, {timestamps: true});

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
            user: {type: Schema.Types.ObjectId, ref: "user",},
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
            jobs: {type: [jobSchema]}
        }, { timestamps: true});

        this.projectModel = mongoose.model("project", this.projectSchema);

        // const resourceRequest = new Schema({
        //     dataVolumeType: {type: String},
        //     dataVolumeSize: {type: String},
        //     dataSourceType: {type: String},
        //     dataSource: {type: String},
        //     cpu: {type: String},
        //     memory: {type: String},
        //     peers: {type: [String]},
        // }, { timestamps: true});

        // const resourceSchema = new Schema({
        //     name: {type: String},
        //     type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
        //                                 ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
        //     status: {type: String},
        //     createdAt: {type: Date, immutable: true},
        //     updatedAt: {type: Date},
        //     properties: {type: Map, of: Object},
        //     jobs: {type: [jobSchema], default: []}
        // }, { timestamps: true});
        // resourceSchema.index({name: 1, type: 1}, {unique: true});

        this.instanceSchema = new Schema({
            name: {type: String, required: true, immutable: true},
            type: {type: String, required: true, immutable: true, enum: [NodeType.zcash, NodeType.lwd, NodeType.zebra]},
            description: {type: String},
            status: {type: String},
            state: {type: String, enum: [StateType.new, StateType.running, StateType.stopped, StateType.pending]},
            project: {type: Schema.Types.ObjectId, ref: "project", immutable: true},
            request: {
                cpu: {type: String},
                memory: {type: String},
                peers: {type: [String]},
                volume: {
                    type: {type: String}, 
                    size: {type: String},
                    source: {type: String},
                    instance: {type: String},
                    project: {type: String}
                }
            },
            resources: {
                configmap: {
                    name: {type: String},
                    type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                    status: {type: String},
                    createdAt: {type: Date},
                    updatedAt: {type: Date},
                    properties: {type: Schema.Types.Mixed},
                },
                secret: {
                    name: {type: String},
                    type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                    status: {type: String},
                    createdAt: {type: Date},
                    updatedAt: {type: Date},
                    properties: {type: Schema.Types.Mixed},
                },
                persistentvolumeclaim: {
                    name: {type: String},
                    type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                    status: {type: String},
                    createdAt: {type: Date},
                    updatedAt: {type: Date},
                    properties: {type: Schema.Types.Mixed},
                },
                deployment: {
                    name: {type: String},
                    type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                    status: {type: String},
                    createdAt: {type: Date},
                    updatedAt: {type: Date},
                    properties: {type: Schema.Types.Mixed},
                },
                service: {
                    name: {type: String},
                    type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                    status: {type: String},
                    createdAt: {type: Date},
                    updatedAt: {type: Date},
                    properties: {type: Schema.Types.Mixed},
                },
                httpproxy: {
                    name: {type: String},
                    type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                    status: {type: String},
                    createdAt: {type: Date},
                    updatedAt: {type: Date},
                    properties: {type: Schema.Types.Mixed},
                },
                volumesnapshot: [
                    {
                        name: {type: String},
                        type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                    ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                        status: {type: String},
                        createdAt: {type: Date},
                        updatedAt: {type: Date},
                        properties: {type: Schema.Types.Mixed},
                    }                    
                ],
                snapshotschedule: {
                    name: {type: String},
                    type: {type: String, enum:[ResourceType.configmap, ResourceType.secret, ResourceType.persistentvolumeclaim, ResourceType.deployment, 
                                                ResourceType.httpproxy, ResourceType.service, ResourceType.snapshotschedule, ResourceType.volumesnapshot]},
                    status: {type: String},
                    createdAt: {type: Date},
                    updatedAt: {type: Date},
                    properties: {type: Schema.Types.Mixed},
                }
            },
            jobs: {type: [jobSchema]}
        }, { timestamps: true});
        this.instanceSchema.index({project: 1, name: 1, type: 1}, {unique: true});
        
        this.instanceModel = mongoose.model("instance", this.instanceSchema);
    }
}

export default new MongoModel();