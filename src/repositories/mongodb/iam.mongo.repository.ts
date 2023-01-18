import { Team, User, TeamMember } from "../../model/model";
import { RoleType, UserStatusType } from "../../model/zbi.enum";
import { IAMRepository } from "../repository.interface";
import { UserSchema, TeamSchema } from "./schema.mongo";

export default class IAMMongoRepository implements IAMRepository {

    async createUser(user: User): Promise<User | undefined> {
        try {
            const uc = new UserSchema({...user});
            if(!uc.status) {
                uc.status = UserStatusType.invited;
            }
            await uc.save();
            return createUser(uc);
        } catch(err) {
            throw err;
        }
    }

    async updateUser(user: User): Promise<User | undefined> {
        try {
            const uc = await UserSchema.findOne({userName: user.userName});
            if(uc) {
                uc.userName = uc.userName;
                uc.email = uc.email;
                uc.name = user.name;
                uc.role = user.role!;
                uc.status = user.status;
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

    async findUsers(params: {}, limit: number, skip: number): Promise<User[] | undefined> {
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

    async findUser(params: {}): Promise<User | undefined> {
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

    async findUserTeamMemberships(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async createTeam(ownerId: string, name: string): Promise<Team|undefined> {
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

    async findTeams(limit: number, skip: number): Promise<Team[] | undefined> {
        try {
            const tc = await TeamSchema.find().populate({
                path: "owner", select: {username: 1, email: 1, name: 1}
            }).limit(limit).skip(skip);
            if(tc) {
                return createTeams(tc);
            }
            return [];
        } catch (err) {
            throw err;
        }
    }

    async findTeam(teamId: string): Promise<Team | undefined> {
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

    async findTeamMemberships(userId: string): Promise<Array<Team>|undefined> {
        try {
            const tcagg = await TeamSchema.aggregate([
                {$match: {"members.user": userId}},
                {$project: {_id: 1, name: 1, members: 1}}
            ]);
            const tc = await TeamSchema.populate(tcagg, {path: "members.user"});
            console.log(JSON.stringify(tc));
            return undefined;
        } catch(err) {
            throw err;
        }
    }

    async removeTeamMembership(teamId: string, userId: string): Promise<Team|undefined> {
        try {
            const tc = await TeamSchema.findOneAndUpdate({"_id": teamId}, {"$pull": {
                "members": {"user": userId}
            }});
            if(tc) return createTeam(tc);
            throw new Error("team not found");
        } catch(err) {
            throw err;
        }
    }

    async addTeamMembership(teamId: string, userId: string): Promise<Team|undefined> {
        try {
            try {
                const tc = await TeamSchema.findById(teamId);
                if(tc) {
                    tc.members.push({userId, role: RoleType.user});
                    await tc.save();
                    return createTeam(tc);
                }
    
                throw new Error("team not found");
            } catch(err) {
                throw err;
            }
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
        members: tc.members.map((mbr:any) => createTeamMember(mbr))
    }
}

function createTeamMember(tmc: any): TeamMember {
    return {
        user: tmc.user, age: "", role: tmc.role
    }
}

function createTeams(tc: Array<any>): Array<Team> {
    return tc.map( team => createTeam(tc) );
}