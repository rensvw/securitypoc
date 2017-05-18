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

var _ = require('lodash');
var exec = require('child_process').exec;
var async = require('async');
var pidList;



var childPids = function(pid, cb) {
  exec('wmic process where(ParentProcessId=' + pid + ') get ProcessId', function(err, stdout, stderr) {
    if (err) { return cb(err); }

    var pids = stdout.toString().trim().split('\r\n');
    if (pids.length >= 1) {
      pids = pids.slice(1);
      pids = _.map(pids, function(pid) { return pid.trim(); });
    }
    cb(null, pids);
  });
};




var recursePids= function recursePids(pid, cb) {
  childPids(pid, function(err, pids) {
    if (err) { return cb(err); }
    if (pids.length > 0) {
      async.eachSeries(pids, function(childPid, next) {
        pidList = pidList.concat(pids);
        recursePids(childPid, function(err, pids) {
          if (err) { return next(err); }
          next();
        });
      }, function(err) {
        cb(err);
      });
    }
    else {
      cb(null);
    }
  });
};



var tree = function tree(pid, cb) {
  pidList = [];
  recursePids(pid, function(err) {
    pidList = _.uniq(pidList);
    cb(err, pidList);
  });
};



module.exports = tree;

