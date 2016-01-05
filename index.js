#!/usr/bin/env node

const enabler = require('./chrome-canary-experiment-enabler-osx')

if (!module.parent) {
  var pathToStateCLIArg, flagsCLIArgs
  const args = process.argv.slice(2)

  args.length && (pathToStateCLIArg = args[0])
  args.length > 1 && (flagsCLIArgs = args.slice(1))

  enabler({
      pathToState : pathToStateCLIArg === '--flags' ? undefined : pathToStateCLIArg
    })
    [flagsCLIArgs?'enableFlags':'enableCanvasAndHarmony'](flagsCLIArgs)
    .save()
}

module.exports = enabler
