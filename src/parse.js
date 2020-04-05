'use strict'

const path = require('path')
const fs = require('fs')
const cmd = require('command-line-args')
const toposort = require('toposort')
const _ = require('lodash')

module.exports = {
  parseCmd(argv) {
    if (argv === undefined) {
      const argv = process.argv
    }

    const { tex, argv0 } = cmd(
      { name: 'tex', defaultOption: true },
      { argv }
    )

    const options = cmd(
      [
        { name: 'scripts', alias: 's', type: String, multiple: true },
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

  findFiles(directories) {
    return directories.flatMap(dir => {
      return fs.readdirSync(dir).map(script => {
        return dir.concat(script)
      })
    })
  },

  parseDeps(file) {
    return fs.readFileSync(file, 'utf8')
      .trim()
      .split('\n')
      .map((pair) => {
        if (pair.indexOf('->') === -1) {
          throw new TypeError(`Pair '${pair}' does not contain '->'`)
        }
        return pair.split('->').map(x => x.trim())
      })
  },

  depGraph({ scripts, dependencies }) {
    return {
      scripts: this.findFiles(scripts),
      dependencies: this.parseDeps(dependencies)
    }
  },

  schedule(files) {
    const { scripts, dependencies } = this.depGraph(files)
    return toposort.array(scripts, dependencies)
  }
}
