import { Context } from './Context';

class Herux {
    constructor() {
        this.stores = new Map();
        this.handlers = new Map();
    }

    createContext() {
        return new Context(this.stores, this.handlers);
    }

    registerStore(storeClass) {
        this.stores.set(storeClass.name, storeClass);

        if (Array.isArray(storeClass.handlers)) {
            for (let hi = 0; hi < storeClass.handlers.length; ++hi) {
                const handler = storeClass.handlers[hi];
                let list = this.handlers.get(handler.type);
                if (!list) {
                    list = [];
                    this.handlers.set(handler.type, list);
                }
                list.push({
                    storeName: storeClass.name,
                    handler: handler.name
                });
            }
        } else {
            // todo
        }
    }
}
