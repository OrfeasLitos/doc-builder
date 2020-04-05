'use strict'

const Parser = require('../src/parse')

const path = require('path')
const _ = require('lodash')
require('should-sinon')

describe('Command line parser', function() {
  function parsed() {
    return {
      tex: 'latex/main.tex',
      scripts: ['example/public-sources/', 'example/private-sources/'],
      dependencies: 'example/deps.txt'
    }
  }

  // Useless test
  it('findFiles should return a list of files', function() {
    const files = Parser.findFiles(parsed().scripts)

    Array.isArray(files).should.be.true()
    for (const file of files) {
      should.exist(file)
    }
  })

  it('parseDeps should return a list of pairs of scripts', function() {
    const scripts = Parser.findFiles(parsed().scripts)
    const pairs = Parser.parseDeps(parsed().dependencies)

    Array.isArray(pairs).should.be.true()
    for (const pair of pairs) {
      Array.isArray(pair).should.be.true()
      for (const el of pair) {
       scripts.some(file => _.isEqual(file, el)).should.be.true(
         `Script '${path.format(el)}' not in ${parsed().scripts}`
       )
      }
    }
  })

  it('should output graph of files', function() {
    
  })
})
