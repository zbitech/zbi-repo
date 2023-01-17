import IAMMongoRepository from "../../../../src/repositories/mongodb/iam.mongo.repository";
import { User } from "../../../../src/model/model";

describe('IAMMongoRepository', () => {
    let instance: IAMMongoRepository;

    beforeEach(() => {
        instance = new IAMMongoRepository();
    });

    it('should create a user', async() => {
        expect(instance).toBeInstanceOf(IAMMongoRepository);
    });
});