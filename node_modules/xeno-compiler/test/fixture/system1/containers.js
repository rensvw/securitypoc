exports.root = {
  shared$: {
    type: 'blank-container'
  }
};

exports.docsrv = {
  dev: {
    type: 'process',
    execute: {
      exec: 'node srv/doc-srv'
    }
  },
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system1/docsrv',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    buildScript: 'echo hello world',
    execute: {
      exec: '/usr/bin/node /srv/doc-srv'
    }
  }
};

exports.histsrv = {
  dev: {
    type: 'process',
    execute: {
      exec: 'node srv/hist-srv'
    }
  },
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system1/histsrv',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    execute: {
      exec: '/usr/bin/node /srv/hist-srv'
    }
  }
};

exports.realsrv = {
  dev: {
    type: 'process',
    execute: {
      exec: 'node srv/real-srv'
    }
  },
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system1/realsrv',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    execute: {
      exec: '/usr/bin/node /srv/real-srv'
    }
  }
};

exports.web = {
  dev: {
    type: 'process',
    execute: {
      exec: 'sh web/run.sh'
    }
  },
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system1/web',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    execute: {
      exec: 'sh /web/run.sh',
      env: { fish: 'wibble',
             bibble: 'frob',
             PROXY_HOST: 'ni' }
    }
  }
};

exports.redis = {
  shared$: {
    type: 'docker',
    execute: {
      args: '-d --appendonly -p 6379:6379',
      name: 'redis'
    }
  }
};

