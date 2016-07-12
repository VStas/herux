'use strict';

class Context {
    constructor(app) {
        this.app = app;

        this.instances = new Map();

        this.changedStores = new Set();
        this.listeners = [];
        this.actions = [];
    }

    dispatch(action) {
        const startProcess = !this.actions.length;

        if (Array.isArray(action)) {
            this.actions.push.apply(this.actions, action);
        } else {
            this.actions.push(action);
        }

        if (startProcess) {
            this.processActions();
        }

    }

    processActions() {
        // todo this.handlers -> this.app.handlers
        for (let ai = 0; ai < this.actions.length; ++ai) {
            const action = this.actions[ai];
            const toStores = this.handlers.get(action.type);
            if (!toStores) {
                continue;
            }
            for (let si = 0; si < toStores.length; ++si) {
                const { storeName, handler } = toStores[si];
                const store = this.getStore(storeName);
                if (store[handler](action.data)) {
                    this.changedStores.add(storeName);
                }
            }
        }


        if (this.changedStores.size) {
            const processedActions = this.actions.length;

            for (let li = 0; li < this.listeners.length; ++li) {
                const listener = this.listeners[li];
                for (let ni = 0; ni < listener.names.length; ++ni) {
                    if (this.changedStores.has(listener.names[ni])) {
                        listener.cb();
                        break;
                    }
                }
            }

            this.changedStores.clear();

            if (this.actions.length !== processedActions) {
                this.actions = this.actions.slice(processedActions);
                this.processActions();
            } else {
                this.actions = [];
            }
        }

    }

    getStore(name) {
        let store = this.instances.get(name);
        if (store) {
            return store;
        }

        store = new this.app.getStoreClassName(this);
        this.instances.set(name, store);
        return store;
    }

    listen(name, cb) {
        const names = Array.isArray(name) ? name : [name];
        const listener = {
            names,
            cb
        };

        this.listeners.push(listener);

        return () => {
            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
    }
}
