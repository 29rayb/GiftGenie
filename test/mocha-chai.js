'use strict';
let chai = require('chai');
let expect = chai.expect;
let assert = chai.assert;

describe('whatever the name >', () => {
  beforeEach(() => {

  });
  afterEach(() => {

  });
  it('i dont know', () => {
    console.log('true')
  })
  it('should fail', (done) => {
    expect('to 5').to.equal('to 5')
    done();
  })
})

describe('String#split', () => {
  it('should equal', () => {
    assert.equal(4, 4)
  });
  it('should not equal', () => {
    assert.notEqual(5, 5.01)
  })
});

describe('hooks', () => {
  before(() => {
    // runs before all tests in this block;
  });
  beforeEach('some description', () => {
    // runs before each test in this block;
  });
})

// --watch, --recursive,