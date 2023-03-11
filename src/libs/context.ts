import { AsyncLocalStorage } from "async_hooks";
import { Constants } from "../constants";

const context = new AsyncLocalStorage<Map<any, any>>();

export default context;

const getCurrentUser = () => {
    const store = context.getStore();
    return store?.get(Constants.USER_ID) as string;
}

export {
    getCurrentUser
}
