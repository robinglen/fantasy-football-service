'use strict';

describe('Service: Fantasyfootball', function () {

  // load the service's module
  beforeEach(module('fantasyFootballFrontendApp'));

  // instantiate service
  var Fantasyfootball;
  beforeEach(inject(function (_Fantasyfootball_) {
    Fantasyfootball = _Fantasyfootball_;
  }));

  it('should do something', function () {
    expect(!!Fantasyfootball).toBe(true);
  });

});
