/* Copyright 2015-present Samsung Electronics Co., Ltd. and other contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

var EventEmitter = require('events').EventEmitter;
var assert = require('assert');


var emitter = new EventEmitter();

var eventCnt1 = 0;
var eventCnt2 = 0;
var eventCnt3 = 0;
var onceCnt = 0;
var eventSequence = '';

emitter.once('once', function() {
  onceCnt += 1;
});


assert.strictEqual(onceCnt, 0);
emitter.emit('once');
assert.strictEqual(onceCnt, 1);
emitter.emit('once');
assert.strictEqual(onceCnt, 1);


{
  var emit_test = new EventEmitter();
  emit_test._events = false;
  emit_test.emit();
}
{
  emit_test = new EventEmitter();
  emit_test._events.error = false;
  emit_test.emit(null);
}
{
  emit_test = new EventEmitter();
  emit_test._events = false;
  assert.throws(function() { emit_test.addListener(null, null); }, TypeError);
}
{
  emit_test = new EventEmitter();
  emit_test._events = false;
  emit_test.addListener('event', function() { });
}
{
  emit_test = new EventEmitter();
  assert.throws(function() { emit_test.once(null, null); }, TypeError);
}
{
  emit_test = new EventEmitter();
  assert.throws(function() {
    emit_test.removeListener(null, null);
  }, TypeError);
}
{
  emit_test = new EventEmitter();
  emit_test._events = false;
  emit_test.removeListener('rmtest', function() { });
}

emitter.once('once2', function() {
  onceCnt += 1;
  assert.strictEqual(arguments.length, 14);
  assert.strictEqual(arguments[0], 0);
  assert.strictEqual(arguments[1], 1);
  assert.strictEqual(arguments[2], 2);
  assert.strictEqual(arguments[3], 3);
  assert.strictEqual(arguments[4], 4);
  assert.strictEqual(arguments[5], 5);
  assert.strictEqual(arguments[6], 6);
  assert.strictEqual(arguments[7], 7);
  assert.strictEqual(arguments[8], 8);
  assert.strictEqual(arguments[9], 9);
  assert.strictEqual(arguments[10], 'a');
  assert.strictEqual(arguments[11], 'b');
  assert.strictEqual(arguments[12], 'c');
  assert.strictEqual(arguments[13].a, 123);
});

assert.strictEqual(onceCnt, 1);
emitter.emit('once2', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', { a: 123 });
assert.strictEqual(onceCnt, 2);
emitter.emit('once2', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', { a: 123 });
assert.strictEqual(onceCnt, 2);

emitter.addListener('event', function() {
  eventCnt1 += 1;
  eventSequence += '1';
});

assert.strictEqual(eventCnt1, 0);
emitter.emit('event');
assert.strictEqual(eventCnt1, 1);

emitter.addListener('event', function() {
  eventCnt2 += 1;
  eventSequence += '2';
});

assert.strictEqual(eventCnt2, 0);
emitter.emit('event');
assert.strictEqual(eventCnt1, 2);
assert.strictEqual(eventCnt2, 1);

emitter.addListener('event', function() {
  eventCnt3 += 1;
  eventSequence += '3';
});

assert.strictEqual(eventCnt3, 0);
emitter.emit('event');
assert.strictEqual(eventCnt1, 3);
assert.strictEqual(eventCnt2, 2);
assert.strictEqual(eventCnt3, 1);
emitter.emit('event');
assert.strictEqual(eventCnt1, 4);
assert.strictEqual(eventCnt2, 3);
assert.strictEqual(eventCnt3, 2);
emitter.emit('no receiver');
assert.strictEqual(eventCnt1, 4);
assert.strictEqual(eventCnt2, 3);
assert.strictEqual(eventCnt3, 2);


emitter.addListener('args', function() {
  assert.strictEqual(arguments.length, 14);
  assert.strictEqual(arguments[0], 0);
  assert.strictEqual(arguments[1], 1);
  assert.strictEqual(arguments[2], 2);
  assert.strictEqual(arguments[3], 3);
  assert.strictEqual(arguments[4], 4);
  assert.strictEqual(arguments[5], 5);
  assert.strictEqual(arguments[6], 6);
  assert.strictEqual(arguments[7], 7);
  assert.strictEqual(arguments[8], 8);
  assert.strictEqual(arguments[9], 9);
  assert.strictEqual(arguments[10], 'a');
  assert.strictEqual(arguments[11], 'b');
  assert.strictEqual(arguments[12], 'c');
  assert.strictEqual(arguments[13].a, 123);
  eventSequence += '4';
});

emitter.addListener('args', function() {
  assert.strictEqual(arguments.length, 14);
  eventSequence += '5';
});

emitter.emit('args', 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'a', 'b', 'c', { a: 123 });


var listener1 = () => {
  eventSequence += '6';
};

emitter.addListener('rmTest', listener1);
emitter.emit('rmTest');
emitter.removeListener('rmTest', function() {});
emitter.emit('rmTest');
emitter.removeListener('rmTest', listener1);
emitter.emit('rmTest');


var listener2 = () => {
  eventSequence += '7';
};

emitter.addListener('rmTest', listener2);
emitter.addListener('rmTest', listener2);
emitter.emit('rmTest');
eventSequence += '|';
emitter.removeListener('rmTest', listener2);
emitter.emit('rmTest');
eventSequence += '|';
emitter.removeListener('rmTest', listener2);
emitter.emit('rmTest');
eventSequence += '|';


var listener3 = () => {
  eventSequence += '8';
};

emitter.addListener('rmTest', listener3);
emitter.addListener('rmTest', listener3);
emitter.emit('rmTest');
eventSequence += '|';
emitter.removeAllListeners('rmTest');
emitter.emit('rmTest');
eventSequence += '|';


emitter.emit('event');
eventSequence += '|';
emitter.removeAllListeners();
emitter.emit('event');
eventSequence += '|';


assert.strictEqual(eventSequence, '112123123456677|7||88||123||');


/* Test if an event listener for a once
   call can be removed.
 */
var removableListenerCnt = 0;
function removableListener() {
  removableListenerCnt++;
}

emitter.once('onceRemove', removableListener);
assert.strictEqual(removableListenerCnt, 0);
emitter.removeListener('onceRemove', removableListener);
emitter.emit('onceRemove');
assert.strictEqual(removableListenerCnt, 0,
                   'a listener for a "once" typed event should be removable');

/*
 * Test when the last listener is removed from an object,
 * the related property doesn't exist anymore.
 */
var listener4 = () => {
};

emitter.addListener('event1', listener4);
emitter.removeListener('event1', listener4);
var res = emitter.emit('event1');
assert.strictEqual(res, false);

emitter.addListener('event2', listener4);
emitter.addListener('event2', listener4);
emitter.removeAllListeners('event2');
res = emitter.emit('event2');
assert.strictEqual(res, false);
