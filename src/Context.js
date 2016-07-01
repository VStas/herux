'use strict';

const CB_KEY = 'HeruxCbKey';
let CB_ID = 0;

class Context {
    constructor(stores, handlers) {
        this.stores = stores;
        this.handlers = handlers;

        this.instances = new Map();
        this.callbacks = new Map();
    }

    dispatch(action) {
        const toStores = this.handlers.get(action.type);
        if (!toStores) {
            return;
        }
        for (let si = 0; si < toStores.length; ++si) {
            const { storeName, handler } = toStores[si];
            let store = this.instances.get(storeName);
            if (!store) {
                store = new this.stores.get(storeName);
            }
            store[handler](action.data);
        }
    }

    getStore(name) {
        let store = this.instances.get(storeName);
        if (!store) {
            store = new this.stores.get(storeName)(storeName);
            this.stores.set(storeName, store);
        }
        return store;
    }

    listen(storeName, cb) {
        if (!cb[CB_KEY]) {
            cb[CB_KEY] = ++CB_ID;
        }
        this.callbacks.set(cb[CB_KEY], cb);
    }
}
