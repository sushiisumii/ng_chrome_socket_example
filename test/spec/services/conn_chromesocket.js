'use strict';

describe('Service: ConnChromesocket', function () {

  // load the service's module
  beforeEach(module('gdlSocketsApp'));

  // instantiate service
  var ConnChromesocket;
  beforeEach(inject(function (_ConnChromesocket_) {
    ConnChromesocket = _ConnChromesocket_;
  }));

  it('should do something', function () {
    expect(!!ConnChromesocket).toBe(true);
  });

});
