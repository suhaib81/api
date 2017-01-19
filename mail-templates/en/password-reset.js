'use strict';

module.exports = {
  subject(params) {
    return `Your password has been reset`;
  },
  body(params) {
    return `<div>
				    <h1>Hi ${params.firstName},</h1>
				    <p>We've just reset your password. If that wasn't you send an email to admin@openembassy.nl</p>
				    <p>Best, OpenEmbassy</p>
				</div>`;
  }
};
