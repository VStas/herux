Herux
=====
We look for Flux, Redux and Fluxible and want to take the best parts of them.

We like functional programming, but we like OOP more.

Main points
-----------
* actions are simple objects with type and data
* use Context for all operations (actions dispatching, get stores, change listening)
* keep your data in many dedicated stores
* you can use static stores (like 'Users') or dynamic stores (like 'Group1', 'Group2' and etc)

Static store
------------
```
class StaticStore {
    /* some class body */
}

StaticStore.storeType = 'static';
StaticStore.storeName = 'name';
StaticStore.handlers = [
    {
        method: 'methodName',
        type: 'ACTION_TYPE'
    }
];
```

Dynamic store
-------------
```
class DynamicStore {
    /* some class body */
}

DynamicStore.storeType = 'dynamic';
DynamicStore.storePattern = /Group\d+/;
DynamicStore.handlers = [
    {
        method: 'methodName',
        selector: (data) => 'Group' + data.groupId,
        type: 'ACTION_TYPE'
    }
]
```

Context
-------
* dispatch(action: Action): void
* getStore(name: String): Store
* listen(stores: String[], cb: (stores: Store[]) => void): void


