'use strict';

class Context {
    constructor(app) {
        this.app = app;

        this.instances = new Map();

        this.changedStores = new Set();
        this.listeners = [];
        this.actions = [];
    }

    /**
     * @param {Object|Array<Object>} action - some data for change stores
     * @returns {void}
     */
    dispatch(action) {
        const inProcessing = this.actions.length;

        if (Array.isArray(action)) {
            this.actions.push(...action); // or push.apply
        } else {
            this.actions.push(action);
        }

        if (!inProcessing) {
            this.processActions();
        }
    }

    processActions() {
        for (let ai = 0; ai < this.actions.length; ++ai) {
            const action = this.actions[ai];
            const handlers = this.app.handlers.get(action.type);
            if (!handlers) {
                continue;
            }
            for (let si = 0; si < handlers.length; ++si) {
                const { selector, method } = handlers[si];
                const storeName = typeof selector === 'function' ? selector(action.data) : selector;
                const store = this.getStore(storeName);
                if (store[method](action.data)) {
                    this.changedStores.add(storeName);
                }
            }
        }


        if (this.changedStores.size) {
            const processedActions = this.actions.length;

            for (let li = 0; li < this.listeners.length; ++li) {
                const listener = this.listeners[li];
                const {names} = listener;
                for (let ni = 0; ni < names.length; ++ni) {
                    if (this.changedStores.has(names[ni])) {
                        listener.cb.apply(
                            null,
                            names.map((name) => this.getStore(name))
                        );
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
        const storeClass = this.app.getStoreClass(name);
        store = new storeClass(this);
        this.instances.set(name, store);
        return store;
    }

    deleteStore(name) {
        this.instances.delete(name);
    }

    listen(name, cb) {
        this.canChangeListeners();

        const names = Array.isArray(name) ? name : [name];
        const listener = {
            names,
            cb
        };

        this.listeners.push(listener);

        return () => {
            this.canChangeListeners();

            this.listeners.splice(this.listeners.indexOf(listener), 1);
        };
    }

    canChangeListeners() {
        if (this.actions.length) {
            throw new Error(
                'Can not listen/unlisten while actions processing is in progress'
            );
        }
    }
}

exports.Context = Context;
