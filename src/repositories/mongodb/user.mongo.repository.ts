import { UserRepository } from "../../interfaces";
import { Team, User, TeamMember } from "../../model/model";
import { InviteStatusType, RoleType, UserStatusType } from "../../model/zbi.enum";
import model from "./mongo.model";
import * as helper from "./helper";

export default class UserMongoRepository implements UserRepository {

    userModel: any;
    teamModel: any;
    
    constructor() {
        this.userModel = model.userModel;
        this.teamModel = model.teamModel;
    }

    async createUser(user: User): Promise<User> {
        try {
            const uc = new this.userModel({...user});
            await uc.save();
            return helper.createUser(uc);
        } catch(err) {
            throw err;
        }
    }

    async updateUser(user: User): Promise<User> {
        try {
            const uc = await this.userModel.findOne({username: user.username});
            if(uc) {
                uc.username = uc.username;
                uc.email = uc.email;
                uc.name = user.name;
                uc.role = user.role!;
                uc.status = user.status!;
                uc.updated = new Date();
                await uc.save();

                return helper.createUser(uc);
            
            } else {
                throw Error("user not found!");
            }
        } catch (err) {
            throw err;
        }
    }

    async findUsers(params: {}, limit: number, skip: number): Promise<User[]> {
        try {
            const uc = await this.userModel.find(params).limit(limit).skip(skip);
            if(uc) {
                return helper.createUsers(uc);
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    async findUser(params: {}): Promise<User> {
        try {
            const uc = await this.userModel.findOne(params);
            if(uc) {
                return helper.createUser(uc);
            }
            throw Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async activateUser(username: string): Promise<void> {
        try {
            const uc = await this.userModel.findOne({username});
            if(uc) {
                uc.status = UserStatusType.active;
                await uc.save();
            }
            throw Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async deactivateUser(username: string): Promise<void> {
        try {
            const uc = await this.userModel.findOne({username});
            if(uc) {
                uc.status = UserStatusType.inactive;
                await uc.save();
            }
            throw Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async deleteUser(username: string): Promise<void> {
        try {
            await this.userModel.deleteOne({username});
        } catch(err) {
            throw err;
        }
    }

    async createTeam(owner: string, name: string): Promise<Team> {
        try {
            const team = {name, owner: owner};
            const tc = new this.teamModel(team);
            await tc.save();

            await tc.populate({path: "owner", select: {userName: 1, email: 1, name: 1}});
            return helper.createTeam(tc);
        } catch(err) {
            throw err;
        }
    }

    async findTeams(limit: number, skip: number): Promise<Team[]> {
        try {
            const tc = await this.teamModel.find({}, {_id: 1, name: 1, owner: 1, created: 1, updated: 1}).populate({
                path: "owner", select: {userName: 1, email: 1, name: 1}
            }); //.limit(limit).skip(skip);
            if(tc) {
                console.log(JSON.stringify(tc));
                return helper.createTeams(tc);
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    async findTeam(teamId: string): Promise<Team> {
        try {
            const tc = await this.teamModel.findById(teamId).populate({
                path: "owner", select: {userName: 1, email: 1, name: 1}
            }).populate({
                path: "members.user", select: {userName: 1, email: 1, name: 1}
            });
            if(tc) {
                return helper.createTeam(tc);
            }

            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async findTeamMemberships(userId: string): Promise<Array<Team>> {
        try {
            const tc = await this.teamModel.find({"members.user": userId}, {
                name: 1,
                members: {
                    $elemMatch: {user: userId}
                }
            }).populate({path: "members.user", select: {userName: 1, email: 1, name: 1}});

            if(tc) return helper.createTeams(tc);

            throw new Error("team memberships not found");
        } catch(err) {
            throw err;
        }
    }

    async removeTeamMembership(teamId: string, userId: string): Promise<Team> {
        try {
            const tc = await this.teamModel.findOneAndUpdate({"_id": teamId}, {"$pull": {
                "members": {"user": userId}
            }}).populate({path: "members.user", select: {username: 1, email: 1, name: 1}});
            if(tc) return helper.createTeam(tc);
            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async addTeamMembership(teamId: string, userId: string): Promise<Team> {
        try {
            const tc = await this.teamModel.findById(teamId);
            if(tc) {
                tc.members.push({userId, role: RoleType.user});
                await tc.save();

                await (await tc.populate({path: "owner", select: {username: 1, email: 1, name: 1}}))
                        .populate({path: "members.user", select: {username: 1, email: 1, name: 1}})
                return helper.createTeam(tc);
            }
    
            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async findPendingMemberships(): Promise<Array<Team>> {
        try {
            const tc = await this.teamModel.find({"members.status": InviteStatusType.pending}, {
                name: 1,
                members: {
                    $elemMatch: {status: InviteStatusType.pending}
                }
            }).populate({path: "members.user", select: {userName: 1, email: 1, name: 1}});

            if(tc) return helper.createTeams(tc);

            throw new Error("pending memberships not found");
        } catch(err) {
            throw err;
        }
    }

}
