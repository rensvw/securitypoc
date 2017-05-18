exports.machine = {
  shared$: {
    type: 'machine',
    name: 'machine',
  }
};

exports.root = {
  shared$: {
    type: 'blank-container'
  }
};

exports.users = {
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system4/users',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      args: '-e PORT=10002 -p 10002:10002 --dns 172.17.42.1 -d',
      exec: 'node /wibble/srv/users.js'
    }
  }
};

exports.permissions = {
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system4/permissions',
    proxyPort: [50005],
    servicePort: [50006],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      environment: {
        variable: 'test'
      },
      args: '-e POSTGRESQL=1 -e PORT=10005 -p 10005:10005 --dns 172.17.42.1 -d',
      exec: 'node /wibble/srv/permissions.js'
    }
  }
};

exports['business-logic'] = {
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system4/bl',
    proxyPort: ['auto'],
    servicePort: ['auto'],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      args: '-e POSTGRESQL=1 -e PORT=10001 -p 10001:10001 --dns 172.17.42.1 -d',
      exec: 'node /wibble/srv/business-logic.js'
    }
  }
};

exports.audit = {
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system4/audit',
    proxyPort: [5001, 5002],
    servicePort: [40001, 40002],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      args: '-e POSTGRESQL=1 -e PORT=10003 -p 10003:10003 --dns 172.17.42.1 -d',
      exec: 'node /wibble/srv/audit.js'
    }
  }
};

exports.emails = {
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system4/emails',
    proxyPort: ['auto'],
    servicePort: [30001, 30002],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      args: '-e PORT=10006 -p 10006:10006 --dns 172.17.42.1 -d',
      exec: 'node /wibble/srv/emails.js'
    }
  }
};

exports.frontend = {
  shared$: {
    type: 'docker',
    path: '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system4/frontend',
    proxyPort: ['auto'],
    servicePort: [50001],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      args: '-e PORT=8000 -p 8000:8000 --dns 172.17.42.1 -d',
      exec: '/bin/bash -c "cd /wibble/wibble; node index.js"'
    }
  }
};

