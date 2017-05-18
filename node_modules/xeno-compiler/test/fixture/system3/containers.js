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
    proxyPort: ['auto'],
    servicePort: ['auto'],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      args: '-e POSTGRESQL=1 -e PORT=10005 -p 10005:10005 --dns 172.17.42.1 -d',
      exec: 'node /wibble/srv/permissions.js'
    }
  }
};

exports['business-logic'] = {
  shared$: {
    type: 'docker',
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
    proxyPort: ['auto'],
    servicePort: ['auto'],
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
    proxyPort: ['auto'],
    servicePort: ['auto'],
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
    proxyPort: ['auto'],
    servicePort: ['auto'],
    buildScript: 'buildsrv.sh',
    repositoryUrl: 'fish',
    execute: {
      args: '-e PORT=8000 -p 8000:8000 --dns 172.17.42.1 -d',
      exec: '/bin/bash -c "cd /wibble/wibble; node index.js"'
    }
  }
};


exports.unreferenced = {
  shared$: {
    type: 'docker',
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

