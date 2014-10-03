'use strict';

describe('Directive: ffGraph', function () {

  // load the directive's module
  beforeEach(module('fantasyFootballFrontendApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<ff-graph></ff-graph>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the ffGraph directive');
  }));
});
