'use strict';

const Promise = require('bluebird');
const errorHandling = require('./error-handling');
var sendgrid = require('sendgrid')(process.env.MAIL_APIKEY);
const emaiTo = 'ahmadkbakibi@gmail.com';

module.exports = {
  send(label, params, callback) {
    var email = new sendgrid.Email({
      from: 'noreply@openembassy.nl',
      to: emaiTo,
      html: '<p>' + params.message + '</p>' + '<p>' + params.from + '</p>',
      subject: label
    })
    email.addFilter('templates', 'enable', 1)
    email.addFilter('templates', 'template_id', "06c88c52-3b1d-46c3-824f-ea113fc9a0c1")
    return sendgrid.send(email, (err, response) => {
      return callback(err, response)
    })
  },
  notify(label, params) {
    var email = new sendgrid.Email({
      from: 'noreply@openembassy.nl',
      to: emaiTo,
      html: '<h2>Hi ' + params.name + '</h2> </br> <h2>you have a new message on Open Embassy!</a><h2> </br>Question<br>' + params.message,
      subject: label
    })
    email.addFilter('templates', 'enable', 1)
    email.addFilter('templates', 'template_id', "06c88c52-3b1d-46c3-824f-ea113fc9a0c1")
    return sendgrid.send(email, (err, response) => {
      return callback(err, response)
    })
  }
};