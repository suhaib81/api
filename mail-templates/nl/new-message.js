'use strict';

module.exports = {
  subject(params) {
    return `new message`;
  },
  body(params) {
    return `<div>
				    <h1>Hi ${params.firstName} ${params.lastName},</h1>
				    <p>You have a new message on <a href="" target="_target">Open Embassy!</a></p>
				    <p>Best, OpenEmbassy</p>
				</div>`;
  }
};
