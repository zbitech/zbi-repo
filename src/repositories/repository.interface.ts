
export interface IRepository<T> {

    /**
     * Insert one item in the colleciton
     * @param data 
     */
    create(data: T): Promise<T>;


}