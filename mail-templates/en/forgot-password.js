'use strict';

module.exports = {
  subject(params) {
    return `Some subject`
  },
  body(params) {
    return `<div>
				    <p>Hello ${params.firstName}</p>
				    <p>Kind regards, the open embassy team</p>
				</div>`
  }
};
