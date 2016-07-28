'use strict';

const {Context} = require('./context');
const {STATIC, DYNAMIC} = require('./Store');

class Herux {
    constructor() {
        this.dynamicStores = [];
        this.handlers = new Map();
        this.staticStores = new Map();
    }

    /**
     * @returns {Context} new Herux Context
     */
    createContext() {
        return new Context(this);
    }

    registerStore(storeClass) {
        let selector = null;

        // todo validation in dev mode
        if (storeClass.storeType === STATIC) {
            this.staticStores.set(storeClass.storeName, storeClass);
            selector = storeClass.storeName;
        } else if (storeClass.storeType === DYNAMIC) {
            this.dynamicStores.push(storeClass);
        } else {
            throw new Error(`Unknown Store.type '${storeClass.type}'`);
        }

        const {handlers} = storeClass;
        for (let hi = 0; hi < handlers.length; ++hi) {
            const handler = handlers[hi];
            this.addHandler(handler.type, {
                selector: selector || handler.selector,
                method: handler.method
            });
        }
    }

    /**
     * @private
     * @param {String} type - action type
     * @param {Object} handlerObj - handler method name
     * @returns {void}
     */
    addHandler(type, handlerObj) {
        let list = this.handlers.get(type);
        if (!list) {
            list = [];
            this.handlers.set(type, list);
        }
        list.push(handlerObj);
    }

    /**
     * @private
     * @param {String} name for dynamic store
     * @returns {Function} store constructor
     */
    getStoreClass(name) {
        // search static store
        let storeClass = this.staticStores.get(name);
        if (storeClass) {
            return storeClass;
        }
        // search dynamic store
        for (let i = 0; i < this.dynamicStores.length; ++i) {
            storeClass = this.dynamicStores[i];
            if (storeClass.storePattern.test(name)) {
                return storeClass;
            }
        }
        throw new Error('Can not find static or dynamic store');
    }
}

exports.Herux = Herux;
