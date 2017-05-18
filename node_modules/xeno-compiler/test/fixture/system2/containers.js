exports.root = {
  shared$: {
    type: 'blank-container'
  }
};

exports.docsrv = {
  dev: {
    type: 'process',
    execute: {
      process: 'node srv/doc-srv'
    }
  },
  sared: {
    type: 'docker',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    execute: {
      exec: '/usr/bin/node /srv/doc-srv'
    }
  }
};

exports.histsrv = {
  dev: {
    type: 'process',
    execute: {
      process: 'node srv/hist-srv'
    }
  },
  shared$: {
    type: 'docker',
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
      process: 'node srv/real-srv'
    }
  },
  shared$: {
    type: 'docker',
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
      process: 'sh web/run.sh'
    }
  },
  shared$: {
    type: 'docker',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    execute: {
      exec: 'sh /web/run.sh'
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

