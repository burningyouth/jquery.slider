import { expect, assert } from 'chai';
import 'mocha';
import { Model } from '../modules/model';

describe('pow', () => {
  it('возводит в степень n', () => {
    assert.equal(Model.pow(2, 3), 8);
  });
});
