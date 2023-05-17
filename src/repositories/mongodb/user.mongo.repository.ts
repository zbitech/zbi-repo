import { UserRepository } from "../../interfaces";
import { Team, User, TeamMember, QueryParam, Registration } from "../../model/model";
import { FilterConditionType, InviteStatusType, LoginProvider, RoleType, UserFilterType, UserStatusType } from "../../model/zbi.enum";
import model from "./mongo.model";
import * as helper from "./helper";
import { getLogger } from "../../libs/logger";
import { Logger } from "winston";
import { hashPassword, comparePassword } from "../../libs/auth.libs";

export default class UserMongoRepository implements UserRepository {

    userModel: any;
    teamModel: any;
    
    constructor() {
        this.userModel = model.userModel;
        this.teamModel = model.teamModel;
    }

    async createUser(email: string, role: RoleType, status: UserStatusType): Promise<User> {
        try {
            const uc = new this.userModel({email, role, status, registration: {acceptedTerms: false}});
            await uc.save();
            return helper.createUser(uc);
        } catch(err) {
            throw err;
        }
    }

    async updateUser(email: string, name: string, status: UserStatusType): Promise<User> {
        const logger = getLogger("update-user");
        try {

            const uc = await this.userModel.findOneAndUpdate({email}, {email, name, status});
            if(uc) {
                return helper.createUser(uc);
            }

            throw new Error("user not found");
        } catch (err) {
            throw err;
        }
    }

    async findRegistration(email: string): Promise<Registration> {
        try {
            const logger = getLogger("find-reg");
            const uc = await this.userModel.findOne({email});
            if(uc) {
                return helper.createRegistration(uc.registration);
            }
            throw new Error("registration not found");
        } catch (err: any) {
            throw err;
        }
    }

    async createRegistration(email: string, name: string, provider: LoginProvider): Promise<Registration> {
        try {
            const logger = getLogger("create-registration");
            const reg = await this.userModel.findOneAndUpdate({email}, {name, status: UserStatusType.active, registration:{acceptedTerms: true, provider}});
            if(reg) {
                return helper.createRegistration(reg);
            }
            throw new Error("could not create registration");

        } catch(err: any) {
            throw err;
        }
    }

    async findUsers(params: QueryParam, size: number, page: number): Promise<User[]> {
        try {
            const p = helper.createParam(params);
            const skip = page>0 ? (page-1) * size : 0;
            const uc = await this.userModel.find(p).skip(skip).limit(size);
            if(uc) {
                return helper.createUsers(uc);
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    async findUser(params: QueryParam): Promise<User> {
        try {
            const p = helper.createParam(params);
            const uc = await this.userModel.findOne(p);
            if(uc) {
                return helper.createUser(uc);
            }
            throw new Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: email};
            const uc = await this.userModel.findUser(param);                
            if(uc) {
                return helper.createUser(uc);                
            }
            throw new Error("user not found");
        } catch (err: any) {
            throw err;
        }
    }

    async activateUser(email: string): Promise<User> {
        try {
            const uc = await this.userModel.findOne({email});
            if(uc) {
                uc.status = UserStatusType.active;
                await uc.save();
                return helper.createUser(uc);
            }
            throw new Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async deactivateUser(email: string): Promise<User> {
        try {
            const uc = await this.userModel.findOne({email});
            if(uc) {
                uc.status = UserStatusType.inactive;
                await uc.save();
                return helper.createUser(uc);
            }
            throw new Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async deleteUser(email: string): Promise<void> {
        try {
            await this.userModel.deleteOne({email});
        } catch(err) {
            throw err;
        }
    }

    async setPassword(email: string, password: string): Promise<void> {
        try {
            const user = await this.userModel.findOne({email});
            user.password = await hashPassword(password);
            await user.save();
        } catch(err) {
            throw err;
        }
    }

    async validatePassword(email: string, password: string): Promise<User|undefined> {
        const logger = getLogger("validate-password");
        try {
            const user = await this.userModel.findOne({email});
            logger.debug(`found user: ${JSON.stringify(user)}`);
            if(await comparePassword(password, user.password)) {
                return helper.createUser(user);
            }

            return undefined;
        } catch(err) {
            throw err;
        }
    }

    async createTeam(owner: string, name: string): Promise<Team> {
        try {
            const team = {name, owner: owner};
            const tc = new this.teamModel(team);
            if(tc) {
                await tc.save();

                await tc.populate({path: "owner", select: {userName: 1, email: 1, name: 1}});
                return helper.createTeam(tc);
            }
            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async updateTeam(teamid: string, name: string): Promise<Team> {
        try {
            const tc = await this.teamModel.findById(teamid);

            if(tc) {
                tc.name = name;
                await tc.save();

                tc.populate({
                    path: "owner", select: {userName: 1, email: 1, name: 1}
                }).populate({
                    path: "members.user", select: {userName: 1, email: 1, name: 1}
                });

                return helper.createTeam(tc);
            }

            throw new Error("team not found");
            
        } catch(err) {
            throw err; //TODO - service error
        }
    }

    async findTeams(size: number, page: number): Promise<Team[]> {
        try {

            const skip = page>0 ? (page-1) * size : 0;
            const tc = await this.teamModel.find({}, {_id: 1, name: 1, owner: 1, created: 1, updated: 1}).populate({
                path: "owner", select: {userName: 1, email: 1, name: 1}
            }).skip(skip).limit(size);

            if(tc) {
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
            throw new Error("team memberships not found");
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

    async updateTeamMembership(teamid: string, userid: string, status: InviteStatusType): Promise<Team> {
        const logger = getLogger("user-repo");
        try {
            const tc = await this.teamModel.findById(teamid);
            if(tc) {
                logger.debug(`Team detail: ${JSON.stringify(tc)}`);
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
            }).populate({path: "members.user", select: {username: 1, email: 1, name: 1}});

            if(tc) return helper.createTeams(tc);

            throw new Error("pending memberships not found");
        } catch(err) {
            throw err;
        }
    }

}
