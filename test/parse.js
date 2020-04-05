'use strict'

const Parser = require('../src/parse')

const path = require('path')
const fs = require('fs')
const _ = require('lodash')
require('should-sinon')

describe('Arguments parser', function() {
  const args = {
    tex: 'latex/main.tex',
    scripts: ['example/public-sources/', 'example/private-sources/'],
    dependencies: 'example/deps.txt'
  }

  it('findFiles() should return a list of files', function() {
    const files = Parser.findFiles(args.scripts)

    files.should.be.Array()
    for (const file of files) {
      should.exist(file)
      fs.accessSync(file, fs.constants.R_OK)
    }
  })

  it('parseDeps() should return a list of pairs of scripts', function() {
    const scripts = Parser.findFiles(args.scripts)
    const pairs = Parser.parseDeps(args.dependencies)

    pairs.should.be.Array()
    for (const pair of pairs) {
      pair.should.be.Array()
      for (const el of pair) {
        scripts.should.containEql(el)
      }
    }
  })

  it('depGraph() should output graph of files', function() {
    const { scripts, dependencies } = Parser.depGraph(args)

    scripts.should.be.Array()
    for (const pair of dependencies) {
      pair.should.be.Array()
      pair.should.have.length(2)
      for (const el of pair) {
        scripts.should.containEql(el)
      }
    }
  })

  it('schedule() should output a list of all files', function() {
    function arraysShouldHaveSameElements(a, b) {
      a.should.containDeep(b)
      b.should.containDeep(a)
    }

    const scheduled = Parser.schedule(args)
    const unordered = Parser.findFiles(args.scripts)
    arraysShouldHaveSameElements(scheduled, unordered)
  })
})
