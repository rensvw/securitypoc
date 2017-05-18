exports.name = 'isnc';
exports.id = '12121212-bf98-4d29-b1c8-d1885bc5c294';
exports.path = '/Users/pelger/work/nearform/code/microbial/xeno/xeno-compiler/test/fixture/system4';
exports.topology = {
  local: {
    root: [
      'postgres',
      'redis',
      'elasticsearch',
      'consul-onemachine',
      'users',
      'permissions',
      'business-logic',
      'audit',
      'emails',
      'frontend'
    ]
  },

  direct: {
    machine$fe1: {contains: ['frontend', 'frontend'],
                  specific: { ipAddress: '1.2.3.4'}},
    machine$svc: {contains: ['users', 'permissions', 'business-logic', 'audit', 'emails'],
                  specific: { ipAddress: '10.20.30.40'}},
    machine$fe2: {contains: ['frontend', 'frontend'],
                  specific: { ipAddress: '5.6.7.8'}}
  }
};

