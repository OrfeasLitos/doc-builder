const cmd = require('command-line-args')
const path = require('path')
const fs = require('fs')

module.exports = {
  parseCmd: function(argv) {
    if (argv === undefined) {
      const argv = process.argv
    }

    const { tex, argv0 } = cmd(
      { name: 'tex', defaultOption: true },
      { argv }
    )

    const options = cmd(
      [
        { name: 'scripts', alias: 's', type: String },
        { name: 'dependencies', alias: 'd', type: String }
      ],
      { argv: argv0 }
    )

    return {
      tex,
      scripts: options.scripts,
      dependencies: options.dependencies
    }
  },

  findFiles: function(directory) {
    return fs.readdirSync(directory)
  }
}
