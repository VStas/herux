'use strict';

const Context = require('./context'); 

class Herux {
    constructor() {
        this.dynamicStores = [];
        this.handlers = new Map();
        this.staticStores = new Map();
    }

    createContext() {
        return new Context(this);
    }

    registerStore(storeClass) {
        if (storeClass.name instanceof RegExp) {
            this.dynamicStores.push(storeClass);
        } else {
            this.staticStores.set(storeClass.name, storeClass);
        }

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

    /**
     * @private
     * @param {String} name for dynamic store
     * @returns {Function} store constructor
     */
    getStoreClass(name) {
        let storeClass = this.staticStores.get(name);
        if (!storeClass) {
            // search dynamic store
            for (let i = 0; this.dynamicStores.length; ++i) {
                storeClass = this.dynamicStores[i];
                if (storeClass.name.test(name)) {
                    break;
                }
            }
            // dev!
            if (!storeClass) {
                throw new Error('Can not find static or dynamic store');
            }
        }
        return storeClass;
    }
}
