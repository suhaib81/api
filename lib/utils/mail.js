'use strict';

const Promise = require('bluebird');
const errorHandling = require('./error-handling');
const logger = require('./logger');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

const templates = require('../../mail-templates');

const config = {
  from: 'noreply@openembassy.nl',
};

const templateId = process.env.SENDGRID_TEMPLATE_ID;

const enableEmail = process.env.SEND_EMAILS === 'true';
const appOrigin = process.env.APP_ORIGIN;

function getTemplate(template, language) {

  if (templates.hasOwnProperty(language) && templates[language].hasOwnProperty(template)) {
    return templates[language][template];
  } else if (templates['en'].hasOwnProperty(template)) {
    return templates['en'][template];
  } else {
    throw new Error(`Requested email template that doesn't exist: ${template}`)
  }
}

function sendgridMail(label, params) {
  let template = getTemplate(label, params);
  let mail = new helper.Mail();
  let personalization = new helper.Personalization();

  mail.setTemplateId(templateId);

  mail.setSubject(template.subject(params));

  let fromEmail = new helper.Email('noreply@openembassy.nl');
  mail.setFrom(fromEmail);

  let content = new helper.Content('text/html', template.body(params));
  mail.addContent(content);

  let toEmail = new helper.Email(params.email, `${params.firstName} ${params.lastName}`);
  personalization.addTo(toEmail);

  mail.addPersonalization(personalization);

  return sg.API({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });


}

function consoleMail(template, params) {
  return new Promise(resolve => {
    logger.info('---- START DUMMY EMAIL -----');
    logger.info(`using template ${template}`);
    logger.info(params);
    logger.info('----- END DUMMY EMAIL ------');
    resolve();
  });
}

module.exports = function(template, params) {
  if (!params.email) {
    throw new Error('Error sending email: missing to email');
  }

  if (enableEmail) {
    return sendgridMail(template, params);
  } else {
    return consoleMail(template, params);
  }
}
