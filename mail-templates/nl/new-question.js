'use strict';

module.exports = {
  subject(params) {
    return `new question`;
  },
  body(params) {
    return `<div>
				    <h1>Hi ${params.firstName} ${params.lastName},</h1>
				    <p>There is a new Question</p>
				    <h2>Title: <p>${params.question.title}</p></h2>
				    <p>Best, OpenEmbassy</p>
				</div>`;
  }
};
