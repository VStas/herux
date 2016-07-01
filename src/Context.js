'use strict';

class Context {
    constructor(stores, handlers) {
        this.stores = stores;
        this.handlers = handlers;

        this.instances = new Map();
        this.listeners = new Map();

        this.changedStores = new Set();
        this.listeners = [];
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
            if (store[handler](action.data)) {
                this.changedStores.add(storeName);
            }
        }

        if (this.changedStores.size) {

            this.changedStores.clear();
            this.calledListeners.clear();
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

    listen(name, cb) {
        const names = Array.isArray(name) ? name : [name];

        this.listeners.push({
            names,
            cb
        });

        return () => {
            for (let ni = 0; ni < names.length; ++ni) {
                const callbacks = this.listeners.get(names[ni]);
                callbacks.splice(callbacks.indexOf(cb), 1);
            }
        };
    }
}
