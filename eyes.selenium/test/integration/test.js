'use strict';

const parallel = require('mocha.parallel');

parallel('suite1', function () {
  it('test1', function (done) {
    setTimeout(done, 500);
  });

  it('test2', function (done) {
    setTimeout(done, 500);
  });
});

parallel('suite2', function () {
  it('test1', function (done) {
    setTimeout(done, 500);
  });

  it('test2', function (done) {
    setTimeout(done, 500);
  });
});
