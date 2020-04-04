'use strict'

const PDF_NAME = 'crypto-api-python'
const PUBLIC_SOURCES = 'public-sources'
const PRIVATE_SOURCES = 'private-sources'

const ENCRYPT_CLASSIFIED = 'encrypt-classified.js'
const CLASSIFIED_SOLUTION = 'aes-classified.py'

const BRUTEFORCE = 'bruteforce.py'
const GEN_PK = 'gen-pk.py'
const ENCRYPT_CTR = 'encrypt-ctr.py'
const CTR_SOLUTION = 'aes-ctr.py'

const PSS_ALICE = 'pkcs1-pss-usage-alice.py'
const PSS_BOB = 'pkcs1-pss-usage-bob.py'
const PUBLIC_KEY = 'pubkey.pem'
const SIGNATURE = 'signature'

const GEN_KEY_BOB = 'gen-key-bob.py'
const STORE_DATA_ALICE = 'store-data-alice.py'
const VERIFY_BOB = 'verify-bob.py'
const BOB_PUBLIC_KEY = 'bob-pubkey.pem'
const BOB_PRIVATE_KEY = 'bob-privkey.pem'
const ALICE_PUBLIC_KEY = 'alice-pubkey.pem'
const ALICE_CIPHER = 'alice-ciphertext'
const ALICE_SIG = 'alice-signature'

const ENCRYPT_PK = 'encrypt-pk.py'
const DECRYPT_PK = 'decrypt-pk.py'

const LINE_WIDTH = 72

const fs = require('fs')
const path = require('path')

const Utils = require('./utils')

function editClassifiedSource(lines, vars) {
  lines[2] = Utils.justifyRight(LINE_WIDTH,
    'key = bytes.fromhex(', vars.key)
  lines[3] = `iv = bytes.fromhex("${vars.iv.toString('hex')}")\n`
  lines[4] = Utils.justifyRight(LINE_WIDTH,
    'ciphertext = bytes.fromhex(', vars.ciphertext)

  return lines
}

function editCtrSource(lines, vars) {
  lines[2] = `key = bytes.fromhex("${vars.key}") * 12\n`
  lines[3] = `nonce = bytes.fromhex("${vars.nonce}")\n`
  lines[4] = Utils.justifyFull(LINE_WIDTH,
    'ciphertext = bytes.fromhex(', vars.ciphertext)

  return lines
}

function editPrivateCtr(lines, vars) {
  lines[5] = `key = bytes.fromhex("${vars.key}") * 12\n`
  lines[7] = Utils.justifyRight(LINE_WIDTH,
    'plaintext = bytes.fromhex(', vars.plaintext)

  return lines
}

function editKeypairEncryptPk(lines, key) {
  lines[5] = `key = RSA.import_key(bytes.fromhex("${key}"))\n`
  return lines
}

function editKeypairDecryptPk(lines, vars) {
  lines[4] = Utils.justifyFull(LINE_WIDTH,
    'key = RSA.import_key(bytes.fromhex(', vars.key)
  lines[5] = Utils.justifyFull(LINE_WIDTH,
    'ciphertext = bytes.fromhex(', vars.ciphertext)

  return lines
}

// TODO: use backupRunWrite here as well
function safeReplaceParty(source, changeLines) {
  const failureMessage =
    'Array of integer-string-char arrays expected in changeLines.'
  if (!Array.isArray(changeLines)) {
    throw new TypeError(failureMessage + ' Got non-array')
  }
  changeLines.map((x, i) => {
    if (!Array.isArray(x)) {
      throw new TypeError(failureMessage
        + ` Got non-array ${x} at index ${i}`)
    }
    if (!Number.isInteger(x[0])) {
      throw new TypeError(failureMessage
        + ` Got non-integer ${x[0]} at index ${i}, 0`)
    }
    if (typeof x[1] !== 'string') {
      throw new TypeError(failureMessage
        + ` Got non-string ${x[1]} at index ${i}, 1`)
    }
    if (typeof x[2] !== 'string' || x[2].length !== 1) {
      throw new TypeError(failureMessage
        + ` Got non-char ${x[2]} at index ${i}, 2`)
    }
    if (!['w', 'r'].includes(x[2])) {
      throw new TypeError('Either \'r\' (read) or \'w\''
        + ` (write) expected in 3rd inner element. Got ${x[2]}`)
    }
  })

  Utils.backup(source)
  const lines = Utils.readFileLines(source)

  lines[changeLines[0][0]] =
    `with open("${changeLines[0][1]}",`
      + ` "${changeLines[0][2]}b") as f:\n`
  lines[changeLines[1][0]] =
    `with open("${changeLines[1][1]}",`
      + ` "${changeLines[1][2]}b") as f:\n`

  fs.writeFileSync(source, lines.join(''))
}

function replaceKeySigPathsPractice() {
  safeReplaceParty(pssAlicePath,
    [[12, PUBLIC_KEY, 'w'], [21, SIGNATURE, 'w']])
  safeReplaceParty(pssBobPath,
    [[5, PUBLIC_KEY, 'r'],  [8, SIGNATURE, 'r']])
}

function replaceDataPathsExercise() {
  safeReplaceParty(exBobGenPath,
    [[4, BOB_PUBLIC_KEY, 'w'], [7, BOB_PRIVATE_KEY, 'w']])
  safeReplaceParty(exAlicePath, [
    [7, BOB_PUBLIC_KEY, 'r'], [18, ALICE_PUBLIC_KEY, 'w'],
    [21, ALICE_CIPHER, 'w'], [24, ALICE_SIG, 'w'],
  ])
  safeReplaceParty(exBobVerifyPath, [
    [5, BOB_PRIVATE_KEY, 'r'], [8, ALICE_PUBLIC_KEY, 'r'],
    [11, ALICE_CIPHER, 'r'], [14, ALICE_SIG, 'r']
  ])
}

const publicSources = fs.readdirSync(PUBLIC_SOURCES)
                        .filter(Utils.isPythonSource)
                        .map(x => {
                          return path.join(PUBLIC_SOURCES, x)
                        })

const classifiedPath = path.join(PUBLIC_SOURCES, CLASSIFIED_SOLUTION)
const genPkPath = path.join(PRIVATE_SOURCES, GEN_PK)
const ctrPath = path.join(PUBLIC_SOURCES, CTR_SOLUTION)
const privateCtrPath = path.join(PRIVATE_SOURCES, ENCRYPT_CTR)
const pssAlicePath = path.join(PUBLIC_SOURCES, PSS_ALICE)
const pssBobPath = path.join(PUBLIC_SOURCES, PSS_BOB)
const exBobGenPath = path.join(PUBLIC_SOURCES, GEN_KEY_BOB)
const exAlicePath = path.join(PUBLIC_SOURCES, STORE_DATA_ALICE)
const exBobVerifyPath = path.join(PUBLIC_SOURCES, VERIFY_BOB)
const encryptPkPath = path.join(PRIVATE_SOURCES, ENCRYPT_PK)
const decryptPkPath = path.join(PUBLIC_SOURCES, DECRYPT_PK)

;(async () => {
  const classifiedVars = require('./'
    + path.join(PRIVATE_SOURCES, ENCRYPT_CLASSIFIED))

  Utils.backupRunWrite(classifiedPath,
    classifiedVars, editClassifiedSource)

  const bruteforcePath = path.join(PUBLIC_SOURCES, BRUTEFORCE)
  // TODO: avoid running bruteforce twice. To fix this elegantlyr
  // a "requirements" + toposort system is needed
  const ctrSymKey = (await Utils.exec(`python3 ${bruteforcePath}`)
                             .catch(e => {
                               console.log(e.stderr)
                               throw new Utils.HandledError()
                             })).stdout.trim()
  const ctrAsymKey = JSON.parse(
    (await Utils.exec(`python3 ${genPkPath}`)
      .catch(e => {
        console.log(e.stderr)
        throw new Utils.HandledError()
      })
    ).stdout
  ).key
  Utils.backupRunWrite(privateCtrPath,
    {'key': ctrSymKey, 'plaintext': ctrAsymKey}, editPrivateCtr)
  const rawCtrVars = await Utils.exec(`python3 ${privateCtrPath}`)
                             .catch(e => {
                               console.log(e.stderr)
                               throw new Utils.HandledError()
                             })
  const ctrVars = JSON.parse(rawCtrVars.stdout)
  ctrVars['key'] = ctrSymKey
  Utils.backupRunWrite(ctrPath, ctrVars, editCtrSource)

  replaceKeySigPathsPractice()

  replaceDataPathsExercise()

  Utils.backupRunWrite(encryptPkPath,
    ctrAsymKey, editKeypairEncryptPk)

  const longQuoteCipher = JSON.parse(
    (await Utils.exec(`python3 ${encryptPkPath}`)
         .catch(e => {
           console.log(e.stderr)
           throw new Utils.HandledError()
         })
       ).stdout
    ).ciphertext
  Utils.backupRunWrite(decryptPkPath,
    {'key': ctrAsymKey, 'ciphertext': longQuoteCipher},
    editKeypairDecryptPk)

  // run all python code in current directory
  for (const filePath of publicSources) {
    fs.writeFileSync(`${filePath}.out`,
    `$ python3 ${path.basename(filePath)}\n`)
    const output = await Utils.exec(`python3 ${filePath}`)
                           .catch(e => {
                             console.log(e.stderr)
                             throw new Utils.HandledError()
                           })
    fs.appendFileSync(`${filePath}.out`, output.stdout)
  }

  const pdfCommand = `pdflatex -halt-on-error `
    + `-interaction=nonstopmode -jobname=${PDF_NAME} main.tex;`
    + `bibtex ${PDF_NAME}.aux;`
    + `pdflatex -halt-on-error `
    + `-interaction=nonstopmode -jobname=${PDF_NAME} main.tex;`
    + `pdflatex -halt-on-error `
    + `-interaction=nonstopmode -jobname=${PDF_NAME} main.tex;`

  // add all python filenames to environment used by pdflatex
  const env = process.env
  for (const filePath of publicSources) {
    const envVar = Utils.envVarFrom(Utils.pureName(filePath))
    env[envVar] = filePath
  }

  // add solutions if switch is provided by user
  env[Utils.envVarFrom('solutions')] =
    (process.argv[2] === '--with-solutions') ? 'true' : 'false'

  Utils.addNewVars(env, classifiedVars, 'classified')
  Utils.addNewVars(env, ctrVars, 'ctr')
  Utils.addNewVars(env, {'quote-cipher': longQuoteCipher})

  const output = await Utils.exec(pdfCommand, { env })
                         .catch(e => {
                             console.log(e.stdout)
                             throw new Utils.HandledError()
                           })
})()
.catch(e => {
  if (!(e instanceof Utils.HandledError)) {
    console.log(e)
  }
})
.then(() => {
  ['aux', 'log', 'bbl', 'blg'].map(extension => {
    Utils.tryUnlink(`${PDF_NAME}.${extension}`)
  })

  for (const filePath of publicSources) {
    Utils.tryUnlink(`${filePath}.out`)
  }

  Utils.restoreBackups([classifiedPath, ctrPath,
    privateCtrPath, pssAlicePath, pssBobPath,
    exBobGenPath, exAlicePath, exBobVerifyPath,
    encryptPkPath, decryptPkPath])

  const toRemove = [PUBLIC_KEY, SIGNATURE, BOB_PUBLIC_KEY,
  BOB_PRIVATE_KEY, ALICE_PUBLIC_KEY, ALICE_CIPHER,
  ALICE_SIG]
  toRemove.map(x => Utils.tryUnlink(x))
})
