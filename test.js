const tap = require('tap')
const ExperimentEnabler = require('./chrome-canary-experiment-enabler-osx')

tap.test('ExperimentEnabler called as a function returns an instance', function (t) {
  t.type(ExperimentEnabler(), ExperimentEnabler)
  t.end()
})
