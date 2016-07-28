/*eslint-env mocha */

const {Herux, Store, action, STATIC, DYNAMIC} = require('..');

const T1 = 'type1';
const T2 = 'type2';

class StaticStore extends Store {
    constructor(h) {
        super(h);
        this.arr = [];
    }
    add(x) {
        this.arr.push(x);
        return true;
    }
}
StaticStore.storeType = STATIC;
StaticStore.storeName = 'StaticStore';
StaticStore.handlers = [
    {
        method: StaticStore.prototype.add.name,
        type: T1
    }
];

class DynamicStore extends Store {
    constructor(app) {
        super(app);
        this.str = '';
    }
    concat(data) {
        this.str += data.s;
        return true;
    }
}
DynamicStore.storeType = DYNAMIC;
DynamicStore.storePattern = /store\d+/;
DynamicStore.handlers = [
    {
        method: DynamicStore.prototype.concat.name,
        selector: (data) => 'store' + data.id, 
        type: T2
    }
];

describe('integration', () => {

    it('static store', () => {
        const app = new Herux();
        app.registerStore(StaticStore);

        const ctx = app.createContext();

        let calls = 0;

        ctx.listen([StaticStore.storeName], (staticStore) => {
            calls += 1;
            staticStore.should.instanceof(StaticStore);
        });

        ctx.dispatch(action(T1, 1));
        ctx.dispatch([action(T1, 2), action(T1, 3)]);

        calls.should.eql(2);
        ctx.getStore(StaticStore.storeName).arr.should.eql([1, 2, 3]);
    });

    it('dynamic stores', () => {
        const app = new Herux();
        app.registerStore(DynamicStore);

        const ctx = app.createContext();
        let calls1 = 0;
        let calls2 = 0;

        ctx.listen(['store1'], (store1) => {
            calls1 += 1;
            store1.should.instanceof(DynamicStore);
        });
        ctx.listen(['store2'], (store2) => {
            calls2 += 1;
            store2.should.instanceof(DynamicStore);
        });

        ctx.dispatch([
            action(T2, { id: 1, s: 1 }),
            action(T2, { id: 2, s: 2 }),
            action(T2, { id: 1, s: 3 }),
            action(T2, { id: 2, s: 4 })
        ]);

        calls1.should.eql(1);
        calls2.should.eql(1);
    });

});
