/*eslint-env mocha */

var should = require('should');

var {Context} = require('..');

describe('Context', () => {

    it('constructor', () => {
        new Context('app').should.containEql({
            app: 'app',
            instances: new Map(),
            changedStores: new Set(),
            listeners: [],
            actions: []
        });
    });

});
