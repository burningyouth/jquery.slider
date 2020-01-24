import Model from '../bundles/model';
import { expect, assert } from 'chai';
import 'mocha';

describe('pow', () => {
  it('возводит в степень n', () => {
    assert.equal(Model.pow(2, 3), 8);
  });
});
