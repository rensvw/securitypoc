/*
 * THIS SOFTWARE IS PROVIDED ``AS IS'' AND ANY EXPRESSED OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 * OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED.  IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 * HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
 * STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING
 * IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

'use strict';

var assert = require('assert');
var _ = require('lodash');


/**
 * environment handler
 * for each target container generate an environment 
 * block that is made available to the process
 * running inside the continaer
 */
module.exports = function() {
  var proxyCurrent;
  var serviceCurrent;
  var auto;



  /**
   * generate envronment and port forwarding configuration
   *
   * supported inputs:
   *
   *  proxyPort: ['auto']
   *  servicePort: ['auto']
   *
   * proxyPort: ['auto']
   * servicePort: [1234]
   *
   * proxyPort: ['auto']
   * servicePort: [1234, 5678]
   *
   * proxyPort: [1234]
   * servicePort: [5678]
   *
   * proxyPort: [1234, 2233]
   * servicePort: [5678, 5566]
   */
  var generateEnvironment = function generateEnvironment(container) {
    var env = {PROXY_HOST: '__TARGETIP__',
               SERVICE_HOST: '0.0.0.0'};
    var idx = 0;

    if (container.specific && container.specific.servicePort && container.specific.proxyPort) {
      assert(_.isArray(container.specific.servicePort));
      assert(_.isArray(container.specific.proxyPort));
      assert(container.specific.servicePort.length >= container.specific.proxyPort.length);

      if (container.specific.servicePort.length === 1 && container.specific.servicePort[0] === 'auto') {
        container.specific.servicePort = serviceCurrent;
        ++serviceCurrent;
        container.specific.proxyPort = proxyCurrent;
        ++proxyCurrent;
        env[container.name + '_PORT'] = container.specific.proxyPort;
      }

      if (container.specific.servicePort.length === 1 && container.specific.servicePort[0] !== 'auto') {
        container.specific.servicePort = container.specific.servicePort[0];
        if (container.specific.proxyPort[0] === 'auto') {
          container.specific.proxyPort = proxyCurrent;
          ++proxyCurrent;
        }
        else {
          container.specific.proxyPort = container.specific.proxyPort[0];
        }
        env[container.name + '_PORT'] = container.specific.proxyPort;
      }

      if (container.specific.servicePort.length > 1 && container.specific.proxyPort.length === 1 && container.specific.proxyPort[0] === 'auto') {
          container.specific.proxyPort = [];
        _.each(container.specific.servicePort, function(servicePort) {
          container.specific.proxyPort.push(proxyCurrent);
          ++proxyCurrent;
          env[container.name + '_PORT_' + servicePort] = container.specific.proxyPort;
        });
      }

      if (container.specific.servicePort.length > 1 && container.specific.proxyPort.length > 1) {
        _.each(container.specific.servicePort, function(servicePort) {
          env[container.name + '_PORT_' + servicePort] = container.specific.proxyPort[0];
          ++idx;
        });
      }
    }
    return env;
  };



  var generate = function generate(system) {
    var globalEnv = {};
    proxyCurrent = 10000;
    serviceCurrent = 20000;
    auto = {};

    _.each(system.topology.containers, function(c) {
      globalEnv = _.merge(globalEnv, generateEnvironment(c));
    });

    _.each(system.topology.containers, function(c) {
      if (c.specific) {
        if (c.specific.execute && c.specific.execute.environment) {
          c.specific.environment = _.merge(_.cloneDeep(globalEnv), c.specific.execute.environment);
        }
        else {
          c.specific.environment = _.cloneDeep(globalEnv);
        }
      }
    });

    _.each(system.topology.containers, function(c) {
      if (c.specific &&  c.specific.servicePort) {
        c.specific.environment.SERVICE_PORT = c.specific.servicePort;
      }
    });
  };



  return {
    generate: generate
  };
};

