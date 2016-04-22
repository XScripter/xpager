module.exports = {

  filename: 'xpager',

  banner: [
    '/**',
    ' * <%= pkg.name %> <%= pkg.version %>',
    ' * <%= pkg.description %>',
    ' * ',
    ' * <%= pkg.homepage %>',
    ' * ',
    ' * Copyright <%= date.year %>, <%= pkg.author %>',
    ' * The XScripter.com',
    ' * http://www.xscripter.com/',
    ' * ',
    ' * Licensed under <%= pkg.license.join(" & ") %>',
    ' * ',
    ' * Released on: <%= date.month %> <%= date.day %>, <%= date.year %>',
    ' */',
    ''
  ].join('\n'),

  date: {
    year: new Date().getFullYear(),
    month: ('January February March April May June July August September October November December').split(' ')[new Date().getMonth()],
    day: new Date().getDate()
  },

  paths: {
    root: './',
    build: 'build',
    source: {
      root: 'src/',
      scripts: 'src/*.js'
    }
  },

  'scripts': [
    'src/xpager.prefix',
    'src/xpager.js',
    'src/xpager.suffix'
  ]

};