'use strict';

const buildStandardGelf = require('./standard-gelf');

module.exports = function () {
  return function (data) {
    const standardGelf = buildStandardGelf(data);

    return Object.assign({}, standardGelf);
  };
};
