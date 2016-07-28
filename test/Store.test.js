/*eslint-env mocha */

const {Store, STATIC, DYNAMIC} = require('..');

describe('Store', () => {
    it('constructor()', () => {
        new Store('context').should.containEql({
            context: 'context'
        });
    });

    it('STATIC', () => {
        STATIC.should.eql('static');
    });

    it('DYNAMIC', () => {
        DYNAMIC.should.eql('dynamic');
    });
});
