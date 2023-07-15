import { UserRepository } from "../../interfaces";
import { Team, User, TeamMember, QueryParam, Registration } from "../../model/model";
import { FilterConditionType, InviteStatusType, LoginProvider, RoleType, UserFilterType, UserStatusType } from "../../model/zbi.enum";
import model from "./mongo.model";
import * as helper from "./helper";
import { getLogger } from "../../libs/logger";
import { hashPassword, comparePassword } from "../../libs/auth.libs";
import { BadRequestError, DataError, ItemAlreadyExistsError, ItemNotFoundError, ItemType, ServiceError, ServiceType, UnAuthorizedError } from "../../libs/errors";

export default class UserMongoRepository implements UserRepository {

    userModel: any;
    teamModel: any;
    
    constructor() {
        this.userModel = model.userModel;
        this.teamModel = model.teamModel;
    }

    async createUser(email: string, role: RoleType, status: UserStatusType): Promise<User> {
        const logger = getLogger("repo-create-user");
        try {
            const uc = new this.userModel({email, role, status, registration: {acceptedTerms: false}});
            await uc.save();
            return helper.createUser(uc);
        } catch(err: any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            const err_type = helper.getErrorType(err);

            if( err_type === helper.MongoErrorType.DUPLICATE_KEY) {
                throw new ItemAlreadyExistsError(ItemType.user, "user with email already exists");
            }

            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async updateUser(email: string, name: string, status: UserStatusType): Promise<User> {
        const logger = getLogger("repo-update-user");
        try {

            const uc = await this.userModel.findOneAndUpdate({email}, {email, name, status});
            if(uc) {
                return helper.createUser(uc);
            }

            throw new ItemNotFoundError(ItemType.user, "user not found");
        } catch (err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findRegistration(email: string): Promise<Registration> {
        const logger = getLogger("repo-find-registration");
        try {
            const uc = await this.userModel.findOne({email});
            if(!uc) throw new ItemNotFoundError(ItemType.user,'user not found');

            return helper.createRegistration(uc.registration);
        } catch (err: any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async createRegistration(email: string, name: string, provider: LoginProvider): Promise<Registration> {
        const logger = getLogger("repo-create-registration");
        try {
            const reg = await this.userModel.findOneAndUpdate({email}, {name, status: UserStatusType.active, registration:{acceptedTerms: true, provider}});
            if(reg) {
                return helper.createRegistration(reg);
            }
            throw new ItemNotFoundError(ItemType.user,"user not found");

        } catch(err: any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findUsers(params: QueryParam): Promise<User[]> {
        const logger = getLogger("repo-create-registration");
        try {
            const p = helper.createParam(params);
            const uc = await this.userModel.find(p);
            if(uc) {
                return helper.createUsers(uc);
            }
            return [];
        } catch (err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findUser(params: QueryParam): Promise<User> {
        const logger = getLogger("find-user");
        try {
            const p = helper.createParam(params);
            const uc = await this.userModel.findOne(p);

            if(uc) {
                return helper.createUser(uc);
            }

            return uc;
        } catch(err: any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async getUserByEmail(email: string): Promise<User> {
        const logger = getLogger("repo-get-user(email)");
        try {
            const param: QueryParam = {name: UserFilterType.email, condition: FilterConditionType.equal, value: email};
            const uc = await this.findUser(param);                
            if(uc) {
                return helper.createUser(uc);
            }

            return uc;
        } catch (err: any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async getUserById(userid: string): Promise<User> {
        const logger = getLogger("repo-get-user(id)");
        try {
            const param: QueryParam = {name: UserFilterType.userid, condition: FilterConditionType.equal, value: userid};
            const uc =  await this.findUser(param);                
            if(uc) {
                return helper.createUser(uc);
            }

            return uc;
        } catch (err: any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }        
    }

    async activateUser(userid: string): Promise<User> {
        const logger = getLogger("repo-activate-user");
        try {
            const uc = await this.userModel.findById(userid);
            if(uc) {
                uc.status = UserStatusType.active;
                await uc.save();
                return helper.createUser(uc);
            }
            throw new ItemNotFoundError(ItemType.user,"user not found");
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async deactivateUser(userid: string): Promise<User> {
        const logger = getLogger("repo-deactivate-user");
        try {
            const uc = await this.userModel.findById(userid);
            if(uc) {
                uc.status = UserStatusType.inactive;
                await uc.save();
                return helper.createUser(uc);
            }
            throw new ItemNotFoundError(ItemType.user,"user not found");
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async deleteUser(userid: string): Promise<void> {
        const logger = getLogger("repo-delete-user");
        try {
            await this.userModel.deleteOne({_id: userid});
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async setPassword(email: string, password: string): Promise<void> {
        const logger = getLogger("repo-set-password");

        try {
            const user = await this.userModel.findOne({email});
            if(!user) throw new ItemNotFoundError(ItemType.user,'user not found');

            user.password = await hashPassword(password);
            await user.save();
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async validatePassword(email: string, password: string): Promise<User|undefined> {
        const logger = getLogger("repo-validate-password");
        try {
            const user = await this.userModel.findOne({email});
            if(!user) throw new ItemNotFoundError(ItemType.user,'user not found');

            logger.debug(`found user: ${JSON.stringify(user)}`);
            if(await comparePassword(password, user.password)) {
                return helper.createUser(user);
            }

            throw new UnAuthorizedError("unauthorized user")
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async createTeam(owner: string, name: string): Promise<Team> {
        const logger = getLogger("repo-create-team");
        try {
            const team = {name, owner: owner};
            logger.debug(`creating new team - ${JSON.stringify(team)}`);
            const tc = new this.teamModel(team);
            if(tc) {
                await tc.save();

                await tc.populate({path: "owner", select: {userName: 1, email: 1, name: 1}});
                return helper.createTeam(tc);
            }
            throw new ItemNotFoundError(ItemType.team, "team not found");
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw err;
        }
    }

    async deleteTeam(teamid: string): Promise<void> {
        const logger = getLogger("repo-delete-team");
        try {
            await this.teamModel.deleteOne({teamid});
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async updateTeam(teamid: string, name: string): Promise<Team> {
        const logger = getLogger("repo-update-team");
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

            throw new ItemNotFoundError(ItemType.team, "team not found");
            
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findTeams(): Promise<Team[]> {
        const logger = getLogger("repo-find-teams");
        try {

            const tc = await this.teamModel.find({}, {_id: 1, name: 1, owner: 1, created: 1, updated: 1}).populate({
                path: "owner", select: {email: 1, name: 1}
            });

            if(tc) {
                return helper.createTeams(tc);
            }
            return [];
        } catch (err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findTeam(teamId: string): Promise<Team> {
        const logger = getLogger("repo-find-team");
        try {
            const tc = await this.teamModel.findById(teamId).populate({
                path: "members.user", select: {email: 1, name: 1}
            }).populate({
                path: "owner", select: {email: 1, name: 1}
            });

            if(tc) {
                return helper.createTeam(tc);
            }

            throw new ItemNotFoundError(ItemType.team, "team not found");
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async findTeamMemberships(userId: string): Promise<Array<Team>> {
        const logger = getLogger("repo-find-team-membershps");
        try {
            const tc = await this.teamModel.find({"members.user": userId}, {
                name: 1,
                members: {
                    $elemMatch: {user: userId}
                }
            }).populate({path: "members.user", select: {_id: 1, email: 1, name: 1}});

            if(tc) return helper.createTeams(tc);

            throw new Error("team memberships not found");
        } catch(err:any) {
            logger.error(err);
            if(err instanceof DataError) throw err;
            throw new ServiceError(ServiceType.database, err.message);
        }
    }

    async removeTeamMembership(teamId: string, userId: string): Promise<Team> {
        try {
            const tc = await this.teamModel.findOneAndUpdate({"_id": teamId}, {"$pull": {
                "members": {"user": userId}
            }}).populate({path: "members.user", select: {user: 1, email: 1, name: 1}});
            if(tc) return helper.createTeam(tc);
            throw new Error("team memberships not found");
        } catch(err) {
            throw err;
        }
    }

    async addTeamMembership(teamId: string, userid: string): Promise<Team> {
        const logger = getLogger("repo-add-member");
        try {
            const tc = await this.teamModel.findById(teamId);
            if(tc) {
                tc.members.push({_id: userid, user: userid, role: RoleType.user});
                logger.debug(`added new member to ${JSON.stringify(tc)}`);
                await tc.save();

                await (await tc.populate({path: "owner", select: {userid: 1, email: 1, name: 1}}))
                        .populate({path: "members.user", select: {userid: 1, email: 1, name: 1}})
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
