'use strict';

describe('Service: ConnSocketio', function () {

  // load the service's module
  beforeEach(module('gdlSocketsApp'));

  // instantiate service
  var ConnSocketio;
  beforeEach(inject(function (_ConnSocketio_) {
    ConnSocketio = _ConnSocketio_;
  }));

  it('should do something', function () {
    expect(!!ConnSocketio).toBe(true);
  });

});
