'use strict';

const bcrypt = require('bcrypt');

module.exports = {
	compare(passOne, passTwo) {
		bcrypt.compare(password, hash, function(error, res) {

      if (error) {
        callback({
          status: 500,
          message: 'Error comparing password hash',
          error: error
        }, null);
        return;
      }

      callback(null, res);
      return;

    });
	}
}