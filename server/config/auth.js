'use strict';

module.exports = {
  expTime: {num: 14, unit: 'days'},
  refreshToken: false,
  saltRounds: 10,
  validatePassword: function(password) {
    return true;
  },
  validateUsername: function(username) {
    return true;
  },
};