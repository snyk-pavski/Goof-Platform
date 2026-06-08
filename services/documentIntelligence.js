'use strict';

const Handlebars = require('handlebars');
const { DOMParser } = require('@xmldom/xmldom');
const _ = require('underscore');
const Iconv = require('iconv').Iconv;

function parseXML(xmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'text/xml');
  return doc;
}

function renderTemplate(templateString, context) {
  const template = Handlebars.compile(templateString);
  return template(context);
}

function normalizeText(text) {
  return _.chain(text)
    .value()
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

function convertEncoding(buffer, fromEncoding, toEncoding) {
  const converter = new Iconv(fromEncoding, toEncoding);
  return converter.convert(buffer);
}

module.exports = {
  parseXML,
  renderTemplate,
  normalizeText,
  convertEncoding,
};
