# chrome-canary-experiment-enabler-osx
## Enable experimental flags in Canary on OS X

`npm i chrome-canary-experiment-enabler-osx -g`

### Enable this
![harmony](http://f.cl.ly/items/2Q3t1Y0o3x1E0L3s2D3E/Screen%20Shot%202016-01-05%20at%2012.50.22.png)

### And this
![canvas](http://f.cl.ly/items/3e3p041T1Z2i192Q3544/Screen%20Shot%202016-01-05%20at%2012.52.31.png)

### Like this
`ccee`

### Or programmatically like this
```
const ExperimentEnabler = require('chrome-canary-experiment-enabler-osx')
ExperimentEnabler()
  .enableCanvasAndHarmony()
  .save()
```

### Additional CLI techniques
* `ccee "~/Path/to/Canary/local state/file"`
* `ccee --flags enable-experimental-canvas-features`
