const Assert   = require('assert-plus')
const FS       = require('fs')
const defaults = require('lodash.defaults')
const equal    = require('lodash.isequal')
const get      = require('lodash.get')
const isArray  = require('lodash.isarray')
const isObject = require('lodash.isobject')
const set      = require('lodash.set')
const write    = require('write-file-atomic')
const values   = require('lodash.values')


const Flags = {
  CANVAS : 'enable-experimental-canvas-features',
  ESNEXT : 'enable-javascript-harmony'
}


function ExperimentEnablerOSX (options) {
  if (!(this instanceof ExperimentEnablerOSX)) {
    return new ExperimentEnablerOSX(options)
  }

  this.options = defaults({ }, options, {
    xpKeyPath   : 'browser.enabled_labs_experiments',
    pathToState : '~/Library/Application Support/Google/Chrome Canary/Local State'
  })

  if (this.options.pathToState[0] === '~') {
    const expandTilde = require('expand-tilde')
    this.options.pathToState = expandTilde(this.options.pathToState)
  }

  console.info('Using path ' + this.options.pathToState)

  ; [ 'xpKeyPath', 'pathToState' ].forEach(function (k) {
    Assert.string(this.options[k], 'this.options.' + k + ' must be a string')
  }.bind(this))
}


const $$ = ExperimentEnablerOSX.prototype


$$.read = function readJSON () {
  var json

  try {
    const string = FS.readFileSync(this.options.pathToState, 'utf-8')
    json = JSON.parse(string)
  }

  catch (e) {
    console.error('Missing ' + this.options.pathToState)
    console.error('Try re-running ccee with a path to your Chrome Canary LocalState')
    console.error(e)
    process.exit(1)
  }

  this.jsonRead = json

  return this // chaining support
}


$$.getLabExperiments = function getLabExperiments () {
  !isObject(this.jsonRead) && this.read()

  const labExperiments = [ ]
  this.originalLabExperiments = Object.freeze(get(this.jsonRead, this.options.xpKeyPath))
  const wasAnArray = isArray(this.originalLabExperiments)

  wasAnArray && labExperiments.push.apply(labExperiments, this.originalLabExperiments)

  this.labExperiments = labExperiments

  return this // chaining support
}


$$.enableFlags = function enableExperimentalFlags (flags) {
  !this.labExperiments && this.getLabExperiments()

  Assert.object(this.jsonRead)
  Assert.string(this.options.xpKeyPath)
  Assert.arrayOfString(this.labExperiments)
  Assert.arrayOfString(flags)

  flags.forEach(function (flag) {
    if (this.labExperiments.indexOf(flag) === -1) {
      this.labExperiments.push(flag)
    } else {
      console.info('Flag ' + flag + ' was already added')
    }
  }.bind(this))

  set(this.jsonRead, this.options.xpKeyPath, this.labExperiments)

  return this // chaining support
}


$$.enableCanvasAndHarmony = function enableCanvasAndHarmonyFlags () {
  return this.enableFlags(values(Flags))
}


$$.save = function saveJSON (flags) {
  flags && this.enableFlags(flags)

  const primaryMessage = 'We\'re not going to save dude—the experimental flags weren\'t changed!'

  if (equal(this.originalLabExperiments, this.labExperiments)) {
    console.error(new Error(primaryMessage + ' (code0)'))
  } else if (equal(this.originalLabExperiments, get(this.jsonRead, this.options.xpKeyPath))) {
    console.error(new Error(primaryMessage + ' (code1)'))
  }

  write.sync(this.options.pathToState, JSON.stringify(this.jsonRead))

  return this // chaining support
}

module.exports = ExperimentEnablerOSX
