const {
  findFiles,
  parseCmd
} = require('../src/parse')

const path = require('path')
require('should-sinon')

describe('Command line parser', function() {
  function parsed() {
    return {
      tex: 'latex/main.tex',
      scripts: 'example/public-sources/',
      dependencies: 'deps.txt'
    }
  }

  // Useless test
  it('findFiles should output a list of files', function() {
    const files = findFiles(parsed().scripts)
    Array.isArray(files).should.be.true()
    for (file of files) {
      should.exist(path.parse(file))
    }
  })

  it('should output graph of files', function() {
    
  })
})
