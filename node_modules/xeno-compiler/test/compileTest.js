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

var fs = require('fs');
var test = require('tape');
var compiler = require('../main')();


test('compile test', function(t) {
  t.plan(2);

  var expected = require('./fixture/system1/expected.json');
  var sysdef = fs.readFileSync(__dirname + '/fixture/system1/system.js', 'utf8');
  var containers = fs.readFileSync(__dirname + '/fixture/system1/containers.js', 'utf8');
  compiler.compile({systemDef: sysdef, containers: containers}, 'dev', function(err, system) {
    t.equal(err, null);
    t.deepEqual(system, expected);
  });
});

test('broken compile test', function(t) {
  t.plan(1);

  var sysdef = fs.readFileSync(__dirname + '/fixture/system2/system.js', 'utf8');
  var containers = fs.readFileSync(__dirname + '/fixture/system2/containers.js', 'utf8');
  compiler.compile({systemDef: sysdef, containers: containers}, 'dev', function(err) {
    t.notEqual(err, null);
  });
});


test('more complex broken compile test', function(t) {
  t.plan(1);

  var sysdef = fs.readFileSync(__dirname + '/fixture/system3/system.js', 'utf8');
  var containers = fs.readFileSync(__dirname + '/fixture/system3/containers.js', 'utf8');
  compiler.compile({systemDef: sysdef, containers: containers}, 'direct', function(err) {
    t.notEqual(err, null);
  });
});


test('more complex compile test', function(t) {
  t.plan(2);

  var expected = require('./fixture/system4/expected.json');
  var sysdef = fs.readFileSync(__dirname + '/fixture/system4/system.js', 'utf8');
  var containers = fs.readFileSync(__dirname + '/fixture/system4/containers.js', 'utf8');
  compiler.compile({systemDef: sysdef, containers: containers}, 'direct', function(err, system) {
    t.equal(err, null);
    t.deepEqual(system, expected);
  });
});


