'use strict';

var _ = require('lodash');
var surnames = [
  'der Strauttenn',
  'Noobancio',
  'de la rue',
  'Pedrolo',
  'Villuencia',
  'Durandes',
  'Montiuses',
  'Salamander',
  'Topacio',
  'Jar Jam',
  'Commitment',
  'Freeman',
  'Asimov'
];

var names = [
  'Heston',
  'Santiagous',
  'Oscarweb',
  'Kulunguelele',
  'Sinsorus',
  'Moeba',
  'Ardilla',
  'Alicate',
  'Lambda',
  'Morgan',
  'Isaac'
];

var titles = [
  'Dr.',
  'Dra.',
  'Miss',
  'Mr',
  'Señor',
  '',
  'Don',
  'Doña'
]

module.exports = function generate(){
  var indexTitle = _.random(0, titles.length -1);
  var indexName = _.random(0, names.length -1);
  var indexSurName = _.random(0, surnames.length -1);

  return titles[indexTitle] + ' ' + names[indexName] + ' ' + surnames[indexSurName];
}