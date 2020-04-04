'use strict'

const path = require('path')
const { promisify } = require('util')
const { exec } = require('child_process')
const fs = require('fs')

class HandledError extends Error {}

function envVarFrom(string) {
  return string.toUpperCase().replace(/-/g, '_')
}

function split(buf, char) {
  const res = []

  let remaining = buf
  let index = buf.indexOf(char)

  while (index !== -1) {
    res.push(remaining.subarray(0, index + 1))
    remaining = remaining.subarray(index + 1)
    index = remaining.indexOf(char)
  }

  return res
}

function tryCopyFile(source, target) {
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, target)
  }
}

function backupPath(path) {
  return path + '.bak'
}

function countOpenParentheses(str) {
  const res = str.split('').filter(x => x === '(').length
    - str.split('').filter(x => x === ')').length
  if (res < 1) {
    throw new ValueError(`"${str}" `
    + 'doesn\'t have one open parenthesis trailing')
  }

  return res
}

module.exports = {
  exec: promisify(exec),

  HandledError,

  isPythonSource: (filePath) => {
    return path.extname(filePath) === '.py'
  },

  pureName: (filePath) => {
    return path.basename(filePath, path.extname(filePath))
  },

  tryUnlink: (filePath) => {
    try {
      fs.unlinkSync(filePath)
    } catch (e) {
  //    console.error(e)
    }
  },

  envVarFrom,

  // `newVars`: key - value store of
  // desired environment variable names - contents
  // names prefixed with `prefix` (if provided)
  // \allowbreak{} is added after every character in contents
  // to enable optimal linebreaks in latex.
  addNewVars: (env, newVars, prefix) => {
    for (const name of Object.keys(newVars)) {
      const prefixedEnvVar = (prefix) ? (prefix + '-' + name) : name
      const formattedEnvVar = envVarFrom(prefixedEnvVar)
      env[formattedEnvVar] = newVars[name]
                               .toString(Buffer.isBuffer(newVars[name]) ?
                                  'hex' : undefined)
                               // regex-fu
                               .replace(/(.{1})/g, "$1\\allowbreak{}")
    }
  },

  readFileLines: (path) => {
    const source = fs.readFileSync(path)
    return split(source, '\n')
  },

  backup: (path) => {
    fs.copyFileSync(path, backupPath(path), fs.constants.COPYFILE_EXCL)
  },

  restoreBackups: (list) => {
    list.map(path => {
      tryCopyFile(backupPath(path), path)
      module.exports.tryUnlink(backupPath(path))
    })
  },

  justifyRight: (fullWidth, header, data) => {
    const shortWidth = fullWidth - header.length
    const noParens = countOpenParentheses(header)

    const multiLine = data.toString('hex').match(
      new RegExp(`.{1,${shortWidth}}`, 'g')
    ).join(`"\n${' '.repeat(header.length)}"`)

    return `${header}"${multiLine}"${')'.repeat(noParens)}\n`
  },

  justifyFull: (fullWidth, header, data) => {
    const shortWidth = fullWidth - header.length
    const noParens = countOpenParentheses(header)

    const firstLine = data.toString('hex').substring(0, shortWidth)
    const multiLine = data.toString('hex')
                          .substring(shortWidth)
                          .match(
                            new RegExp(`.{1,${fullWidth}}`, 'g')
                          )
    multiLine.unshift(`${header}"${firstLine}`)

    return `${multiLine.join(`"\n"`)}"${')'.repeat(noParens)}\n`
  },

  backupRunWrite: (targetPath, vars, processLines) => {
    module.exports.backup(targetPath)
    const lines = processLines(module.exports.readFileLines(targetPath), vars)
    fs.writeFileSync(targetPath, lines.join(''))
  }
}
