import { Team, User, TeamMember } from "../../model/model";
import { InviteStatusType, RoleType, UserStatusType } from "../../model/zbi.enum";
import { IAMRepository } from "../repository.interface";
import { UserSchema, TeamSchema } from "./schema.mongo";

export default class IAMMongoRepository implements IAMRepository {

    async createUser(user: User): Promise<User> {
        try {
            const uc = new UserSchema({...user});
            await uc.save();
            return createUser(uc);
        } catch(err) {
            throw err;
        }
    }

    async updateUser(user: User): Promise<User> {
        try {
            const uc = await UserSchema.findOne({userName: user.userName});
            if(uc) {
                uc.userName = uc.userName;
                uc.email = uc.email;
                uc.name = user.name;
                uc.role = user.role!;
                uc.status = user.status!;
                uc.updated = new Date();
                await uc.save();

                return createUser(uc);
            
            } else {
                throw Error("user not found!");
            }
        } catch (err) {
            throw err;
        }
    }

    async findUsers(params: {}, limit: number, skip: number): Promise<User[]> {
        try {
            const uc = await UserSchema.find(params).limit(limit).skip(skip);
            if(uc) {
                return createUsers(uc);
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    async findUser(params: {}): Promise<User> {
        try {
            const uc = await UserSchema.findOne(params);
            if(uc) {
                return createUser(uc);
            }
            throw Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async resetUserPassword(userName: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async activateUser(userName: string): Promise<void> {
        try {
            const uc = await UserSchema.findOne({userName});
            if(uc) {
                uc.status = UserStatusType.active;
                await uc.save();
            }
            throw Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async deactivateUser(userName: string): Promise<void> {
        try {
            const uc = await UserSchema.findOne({userName});
            if(uc) {
                uc.status = UserStatusType.inactive;
                await uc.save();
            }
            throw Error("user not found");
        } catch(err) {
            throw err;
        }
    }

    async validateAuth(type: string, value: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    async createTeam(ownerId: string, name: string): Promise<Team> {
        try {
            const team = {name, owner: ownerId};
            const tc = new TeamSchema(team);
            await tc.save();

            await tc.populate({path: "owner", select: {userName: 1, email: 1, name: 1}});
            return createTeam(tc);
        } catch(err) {
            throw err;
        }
    }

    async findTeams(limit: number, skip: number): Promise<Team[]> {
        try {
            const tc = await TeamSchema.find({}, {_id: 1, name: 1, owner: 1, created: 1, updated: 1}).populate({
                path: "owner", select: {userName: 1, email: 1, name: 1}
            }); //.limit(limit).skip(skip);
            if(tc) {
                console.log(JSON.stringify(tc));
                return createTeams(tc);
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    async findTeam(teamId: string): Promise<Team> {
        try {
            const tc = await TeamSchema.findById(teamId).populate({
                path: "owner", select: {userName: 1, email: 1, name: 1}
            }).populate({
                path: "members.user", select: {userName: 1, email: 1, name: 1}
            });
            if(tc) {
                return createTeam(tc);
            }

            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async findTeamMemberships(userId: string): Promise<Array<Team>> {
        try {
            const tc = await TeamSchema.find({"members.user": userId}, {
                name: 1,
                members: {
                    $elemMatch: {user: userId}
                }
            }).populate({path: "members.user", select: {userName: 1, email: 1, name: 1}});

            if(tc) return createTeams(tc);

            throw new Error("team memberships not found");
        } catch(err) {
            throw err;
        }
    }

    async removeTeamMembership(teamId: string, userId: string): Promise<Team> {
        try {
            const tc = await TeamSchema.findOneAndUpdate({"_id": teamId}, {"$pull": {
                "members": {"user": userId}
            }}).populate({path: "members.user", select: {username: 1, email: 1, name: 1}});
            if(tc) return createTeam(tc);
            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async addTeamMembership(teamId: string, userId: string): Promise<Team> {
        try {
            const tc = await TeamSchema.findById(teamId);
            if(tc) {
                tc.members.push({userId, role: RoleType.user});
                await tc.save();

                await (await tc.populate({path: "owner", select: {username: 1, email: 1, name: 1}}))
                        .populate({path: "members.user", select: {username: 1, email: 1, name: 1}})
                return createTeam(tc);
            }
    
            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async findPendingMemberships(): Promise<Array<Team>> {
        try {
            const tc = await TeamSchema.find({"members.status": InviteStatusType.pending}, {
                name: 1,
                members: {
                    $elemMatch: {status: InviteStatusType.pending}
                }
            }).populate({path: "members.user", select: {userName: 1, email: 1, name: 1}});

            if(tc) return createTeams(tc);

            throw new Error("pending memberships not found");
        } catch(err) {
            throw err;
        }
    }

}

function createUser(uc: any): User {
    if(uc) {
        return {
            userId: uc._id,
            userName: uc.userName, name: uc.name, email: uc.email, 
            status: uc.status, role: uc.role
        }
    }

    return uc;
}

function createUsers(uc: Array<any>): Array<User> {
    return uc.map( user => createUser(user));
}

function createTeam(tc: any): Team {
    return {
        id: tc._id,
        name: tc.name,
        owner: createUser(tc.owner),
        members: tc.members ? tc.members.map((mbr:any) => createTeamMember(mbr)) : undefined
    }
}

function createTeamMember(tmc: any): TeamMember {
    return {
        user: tmc.user, role: tmc.role, status: tmc.status
    }
}

function createTeams(tc: Array<any>): Array<Team> {
//    console.log("processing array: ", tc.length);
    return tc.map( team => createTeam(team) );
}
