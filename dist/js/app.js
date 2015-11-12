(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/will/Code/resume/node_modules/grunt-browserify/node_modules/browserify/node_modules/events/events.js":[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/AddListEntry.js":[function(require,module,exports){
'use strict';

var React = require('react');
var Immutable = require('immutable');
var List = Immutable.List;
var Map = Immutable.Map;

var AddListEntry = React.createClass({
	displayName: 'AddListEntry',
	getInitialState: function getInitialState() {
		return {
			showOptions: false,
			dataType: "string"
		};
	},
	pushPath: function pushPath(e) {
		e.preventDefault();
		var types = {
			map: new Map({}),
			list: new List([]),
			string: ""
		};
		if (this.props.keyName) {
			this.props.cursor.get(this.props.keyName).push(types[this.state.dataType]);
		} else {
			this.props.cursor.push(types[this.state.dataType]);
		}
		this.toggleOptions();
	},
	toggleOptions: function toggleOptions() {
		this.setState({ showOptions: !this.state.showOptions });
	},
	setType: function setType(e) {
		var dataType = e.target.value;
		this.setState({ dataType: dataType });
	},
	render: function render() {
		if (this.state.showOptions) {
			return React.createElement(
				'div',
				{ style: { marginLeft: "20px" }, __source: {
						fileName: '../../../src/components/AddListEntry.jsx',
						lineNumber: 37
					}
				},
				React.createElement(
					'label',
					{ htmlFor: 'type', __source: {
							fileName: '../../../src/components/AddListEntry.jsx',
							lineNumber: 38
						}
					},
					'type:'
				),
				' ',
				React.createElement(
					'select',
					{ name: 'type', onChange: this.setType, __source: {
							fileName: '../../../src/components/AddListEntry.jsx',
							lineNumber: 38
						}
					},
					React.createElement(
						'option',
						{ value: 'string', __source: {
								fileName: '../../../src/components/AddListEntry.jsx',
								lineNumber: 39
							}
						},
						'String'
					),
					React.createElement(
						'option',
						{ value: 'map', __source: {
								fileName: '../../../src/components/AddListEntry.jsx',
								lineNumber: 40
							}
						},
						'Map'
					),
					React.createElement(
						'option',
						{ value: 'list', __source: {
								fileName: '../../../src/components/AddListEntry.jsx',
								lineNumber: 41
							}
						},
						'List'
					)
				),
				' ',
				React.createElement(
					'a',
					{ href: '#', onClick: this.pushPath, __source: {
							fileName: '../../../src/components/AddListEntry.jsx',
							lineNumber: 43
						}
					},
					React.createElement('i', { className: 'fa fa-plus', style: { color: "#A6E22E" }, __source: {
							fileName: '../../../src/components/AddListEntry.jsx',
							lineNumber: 43
						}
					})
				),
				' ',
				React.createElement(
					'a',
					{ href: '#', onClick: this.toggleOptions, __source: {
							fileName: '../../../src/components/AddListEntry.jsx',
							lineNumber: 44
						}
					},
					React.createElement('i', { className: 'fa fa-remove', style: { color: "#FD971F" }, __source: {
							fileName: '../../../src/components/AddListEntry.jsx',
							lineNumber: 44
						}
					})
				)
			);
		}
		return React.createElement(
			'div',
			{ style: { marginLeft: "19px" }, __source: {
					fileName: '../../../src/components/AddListEntry.jsx',
					lineNumber: 48
				}
			},
			String.fromCharCode(8627),
			' ',
			React.createElement(
				'a',
				{ href: '#', __source: {
						fileName: '../../../src/components/AddListEntry.jsx',
						lineNumber: 48
					}
				},
				React.createElement('i', { onClick: this.toggleOptions, className: 'fa fa-plus-circle add', style: { color: "#A6E22E" }, __source: {
						fileName: '../../../src/components/AddListEntry.jsx',
						lineNumber: 48
					}
				})
			)
		);
	}
});

module.exports = AddListEntry;

},{"immutable":"immutable","react":"react"}],"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/AddMapEntry.js":[function(require,module,exports){
'use strict';

var React = require('react');
var Immutable = require('immutable');
var List = Immutable.List;
var Map = Immutable.Map;

var inputStyle = {
	fontFamily: '"Source Code Pro", monospace',
	background: '#282828',
	border: '0',
	color: '#E6DB74',
	wordBreak: 'break-word'
};

var AddMapEntry = React.createClass({
	displayName: 'AddMapEntry',
	getInitialState: function getInitialState() {
		return {
			showOptions: false,
			keyName: "",
			dataType: "string"
		};
	},
	setPath: function setPath(e) {
		e.preventDefault();
		var types = {
			map: Map({}),
			list: List([]),
			string: ""
		};
		if (this.props.keyName) {
			this.props.cursor.get(this.props.keyName).set(this.state.keyName, types[this.state.dataType]);
		} else {
			this.props.cursor.set(this.state.keyName, types[this.state.dataType]);
		}
		this.toggleOptions();
	},
	toggleOptions: function toggleOptions() {
		this.setState({ showOptions: !this.state.showOptions });
	},
	setType: function setType(e) {
		var dataType = e.target.value;
		this.setState({ dataType: dataType });
	},
	setKey: function setKey(e) {
		var keyName = e.target.value;
		this.setState({ keyName: keyName });
	},
	render: function render() {
		if (this.state.showOptions) {
			return React.createElement(
				'div',
				{ style: { marginLeft: "20px" }, __source: {
						fileName: '../../../src/components/AddMapEntry.jsx',
						lineNumber: 50
					}
				},
				React.createElement(
					'label',
					{ htmlFor: 'key', __source: {
							fileName: '../../../src/components/AddMapEntry.jsx',
							lineNumber: 51
						}
					},
					'key:'
				),
				' ',
				React.createElement('input', { name: 'key', type: 'text', onChange: this.setKey, __source: {
						fileName: '../../../src/components/AddMapEntry.jsx',
						lineNumber: 51
					}
				}),
				React.createElement('br', {
					__source: {
						fileName: '../../../src/components/AddMapEntry.jsx',
						lineNumber: 51
					}
				}),
				React.createElement(
					'label',
					{ htmlFor: 'type', __source: {
							fileName: '../../../src/components/AddMapEntry.jsx',
							lineNumber: 52
						}
					},
					'type:'
				),
				' ',
				React.createElement(
					'select',
					{ name: 'type', onChange: this.setType, __source: {
							fileName: '../../../src/components/AddMapEntry.jsx',
							lineNumber: 52
						}
					},
					React.createElement(
						'option',
						{ value: 'string', __source: {
								fileName: '../../../src/components/AddMapEntry.jsx',
								lineNumber: 53
							}
						},
						'String'
					),
					React.createElement(
						'option',
						{ value: 'map', __source: {
								fileName: '../../../src/components/AddMapEntry.jsx',
								lineNumber: 54
							}
						},
						'Map'
					),
					React.createElement(
						'option',
						{ value: 'list', __source: {
								fileName: '../../../src/components/AddMapEntry.jsx',
								lineNumber: 55
							}
						},
						'List'
					)
				),
				' ',
				React.createElement(
					'a',
					{ href: '#', onClick: this.setPath, __source: {
							fileName: '../../../src/components/AddMapEntry.jsx',
							lineNumber: 57
						}
					},
					React.createElement('i', { className: 'fa fa-plus', style: { color: "#A6E22E" }, __source: {
							fileName: '../../../src/components/AddMapEntry.jsx',
							lineNumber: 57
						}
					})
				),
				' ',
				React.createElement(
					'a',
					{ href: '#', onClick: this.toggleOptions, __source: {
							fileName: '../../../src/components/AddMapEntry.jsx',
							lineNumber: 58
						}
					},
					React.createElement('i', { className: 'fa fa-remove', style: { color: "#FD971F" }, __source: {
							fileName: '../../../src/components/AddMapEntry.jsx',
							lineNumber: 58
						}
					})
				)
			);
		}
		return React.createElement(
			'div',
			{ style: { marginLeft: "19px" }, __source: {
					fileName: '../../../src/components/AddMapEntry.jsx',
					lineNumber: 62
				}
			},
			String.fromCharCode(8627),
			' ',
			React.createElement(
				'a',
				{ href: '#', __source: {
						fileName: '../../../src/components/AddMapEntry.jsx',
						lineNumber: 62
					}
				},
				React.createElement('i', { onClick: this.toggleOptions, className: 'fa fa-plus-circle', style: { color: "#A6E22E" }, __source: {
						fileName: '../../../src/components/AddMapEntry.jsx',
						lineNumber: 62
					}
				})
			)
		);
	}
});

module.exports = AddMapEntry;

},{"immutable":"immutable","react":"react"}],"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/Editor.js":[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Top-level component
var React = require('react');
var Immutable = require('immutable');
var Map = Immutable.Map;
var List = Immutable.List;

var Cursor = require('immutable/contrib/cursor');
var fs = require('../libs/FileSaver');

var HistoryModel = require('../models/HistoryModel');

var Entry = require('./Entry');
// const Toolbar = require('./Toolbar');
var AddMapEntry = require('./AddMapEntry');
var AddListEntry = require('./AddListEntry');

var editorStyle = {
	background: '#282828',
	color: "#F8F8F2",
	fontFamily: '"Source Code Pro", monospace',
	fontSize: "16px",
	WebkitFontSmoothing: "initial"
};

var Editor = React.createClass({
	displayName: 'Editor',

	statics: {
		undo: function undo() {
			var immutable = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			HistoryModel.incOffset();
			var nextState = HistoryModel.get(HistoryModel.getAll().offset);
			// this.props.cursor.update((v) => { return nextState; });
			return immutable ? nextState : nextState.toJS();
		},
		redo: function redo() {
			var immutable = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

			HistoryModel.decOffset();
			var nextState = HistoryModel.get(HistoryModel.getAll().offset);
			// this.props.cursor.update((v) => { return nextState; });
			return immutable ? nextState : nextState.toJS();
		},
		save: function save(name) {
			var blob = new Blob([JSON.stringify(HistoryModel.get(HistoryModel.getAll().offset).toJS())], { type: "application/json;charset=utf-8" });
			fs.saveAs(blob, name);
		}
	},
	propTypes: {
		data: React.PropTypes.object.isRequired,
		onUpdate: React.PropTypes.func.isRequired,
		immutable: React.PropTypes.bool,
		minEditDepth: React.PropTypes.number,
		minRemovalDepth: React.PropTypes.number
	},
	componentDidMount: function componentDidMount() {
		HistoryModel.push(Immutable.fromJS(this.props.data));
	},
	shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
		return this.props.data !== nextProps.data;
	},
	render: function render() {
		var _this = this;

		var data = Immutable.fromJS(this.props.data);

		var rootCursor = Cursor.from(data, function (newData, oldData, path) {
			console.log(newData !== oldData);
			if (newData !== oldData) {
				HistoryModel.push(newData);
				_this.props.onUpdate(_this.props.immutable ? newData : newData.toJS());
			}
		});

		var isMap = Map.isMap(this.props.data);
		var isList = List.isList(this.props.data);
		return React.createElement(
			'div',
			{ style: editorStyle, __source: {
					fileName: '../../../src/components/Editor.jsx',
					lineNumber: 69
				}
			},
			React.createElement(
				'div',
				{ style: { margin: "0px 10px" }, __source: {
						fileName: '../../../src/components/Editor.jsx',
						lineNumber: 70
					}
				},
				isMap ? '{' : '[',
				React.createElement(
					'div',
					{ style: { marginLeft: "5px" }, __source: {
							fileName: '../../../src/components/Editor.jsx',
							lineNumber: 73
						}
					},
					data.map(function (entry, key) {
						return React.createElement(Entry, _extends({}, _this.props, {
							cursor: rootCursor,
							value: entry,
							key: key,
							keyName: key,
							__source: {
								fileName: '../../../src/components/Editor.jsx',
								lineNumber: 75
							}
						}));
					}).toList(),
					this.props.minEditDepth === 0 ? isMap ? React.createElement(AddMapEntry, { cursor: rootCursor, __source: {
							fileName: '../../../src/components/Editor.jsx',
							lineNumber: 85
						}
					}) : React.createElement(AddListEntry, { cursor: rootCursor, __source: {
							fileName: '../../../src/components/Editor.jsx',
							lineNumber: 86
						}
					}) : ''
				),
				isMap ? '}' : ']'
			)
		);
	}
});

window.HistoryModel = HistoryModel;

module.exports = Editor;

},{"../libs/FileSaver":"/Users/will/Code/resume/node_modules/immutable-editor/dist/libs/FileSaver.js","../models/HistoryModel":"/Users/will/Code/resume/node_modules/immutable-editor/dist/models/HistoryModel.js","./AddListEntry":"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/AddListEntry.js","./AddMapEntry":"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/AddMapEntry.js","./Entry":"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/Entry.js","immutable":"immutable","immutable/contrib/cursor":"/Users/will/Code/resume/node_modules/immutable/contrib/cursor/index.js","react":"react"}],"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/Entry.js":[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var Immutable = require('immutable');
var Cursor = require('immutable/contrib/cursor');
var List = Immutable.List;
var Map = Immutable.Map;

var assign = require('object-assign');

var AddMapEntry = require('./AddMapEntry');
var AddListEntry = require('./AddListEntry');

var inputStyle = {
	fontFamily: '"Source Code Pro", monospace',
	background: '#282828',
	border: '0',
	color: '#E6DB74',
	wordBreak: 'break-word',
	fontSize: 'inherit'
};

var inputContainerStyle = {
	fontFamily: '"Source Code Pro", monospace',
	color: '#E6DB74'
};

// fontSize: '11px'
var Entry = React.createClass({
	displayName: 'Entry',

	propTypes: {
		keyName: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]).isRequired,
		value: React.PropTypes.oneOfType([React.PropTypes.instanceOf(List), React.PropTypes.instanceOf(Map), React.PropTypes.string]).isRequired,
		minEditDepth: React.PropTypes.number,
		minRemovalDepth: React.PropTypes.number
	},
	getInitialState: function getInitialState() {
		return {
			collapsed: false,
			inputValue: ""
		};
	},
	_onChange: function _onChange(e) {
		this.setState({ inputValue: e.target.value });
	},
	_onBlur: function _onBlur(e) {
		// update the model on blur
		this.props.cursor.set(this.props.keyName, this.state.inputValue);
	},
	_onKeyUp: function _onKeyUp(e) {
		// update the model on enter
		if (e.key === "Enter") {
			this.props.cursor.set(this.props.keyName, this.state.inputValue);
		}
	},
	deletePath: function deletePath(e) {
		e.preventDefault();
		this.props.cursor.delete(this.props.keyName);
	},
	toggleCollapsed: function toggleCollapsed(e) {
		e.preventDefault();
		this.setState({ collapsed: !this.state.collapsed });
	},
	componentWillMount: function componentWillMount() {
		this.setState({
			inputValue: this.props.value
		});
	},
	componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
		this.setState({
			inputValue: nextProps.value
		});
	},
	shouldComponentUpdate: function shouldComponentUpdate(nextProps, nextState) {
		return this.props.value !== nextProps.value || this.props.style !== nextProps.style || this.state.collapsed !== nextState.collapsed || this.state.inputValue !== nextState.inputValue || this.props.cursor !== nextProps.cursor;
	},
	render: function render() {
		var _this = this;

		var cursor = this.props.cursor.get(this.props.keyName);
		var value = this.props.value;
		var collapsed = this.state.collapsed;

		var isMinRemovalDepth = this.props.cursor['_keyPath'].length + 1 >= this.props.minRemovalDepth;
		var isMinEditDepth = this.props.cursor['_keyPath'].length + 1 >= this.props.minEditDepth;
		var isMap = Map.isMap(value);
		var isList = List.isList(value);

		var hideEntry = { display: collapsed ? 'none' : 'block' };
		return React.createElement(
			'div',
			{ style: assign({ marginLeft: "20px" }, this.props.style), __source: {
					fileName: '../../../src/components/Entry.jsx',
					lineNumber: 96
				}
			},
			isMap || isList ? React.createElement(
				'a',
				{ onClick: this.toggleCollapsed, __source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 97
					}
				},
				React.createElement('i', { className: 'fa ' + (collapsed ? 'fa-plus-square' : 'fa-minus-square'), style: { color: "#FFD569", marginLeft: '-23px' }, __source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 97
					}
				})
			) : '',
			' ',
			this.props.keyName,
			':',
			' ',
			isMap ? React.createElement(
				'span',
				{
					__source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 100
					}
				},
				'{',
				' ',
				isMinRemovalDepth ? React.createElement(
					'a',
					{ href: '#', onClick: this.deletePath, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 100
						}
					},
					React.createElement('i', { className: 'fa fa-times-circle', style: { color: "#FD971F" }, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 100
						}
					}),
					' '
				) : '',
				value.map(function (v, k) {
					return React.createElement(Entry, _extends({}, _this.props, { cursor: cursor, key: k, value: v, keyName: k, style: hideEntry, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 102
						}
					}));
				}).toList(),
				isMinEditDepth && !collapsed ? React.createElement(AddMapEntry, { cursor: this.props.cursor, keyName: this.props.keyName, __source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 104
					}
				}) : '',
				'}'
			) : isList ? React.createElement(
				'span',
				{
					__source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 107
					}
				},
				'[',
				' ',
				isMinRemovalDepth ? React.createElement(
					'a',
					{ href: '#', onClick: this.deletePath, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 107
						}
					},
					React.createElement('i', { className: 'fa fa-times-circle', style: { color: "#FD971F" }, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 107
						}
					}),
					' '
				) : '',
				value.map(function (v, k) {
					return React.createElement(Entry, _extends({}, _this.props, { cursor: cursor, key: k, value: v, keyName: k, style: hideEntry, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 109
						}
					}));
				}).toList(),
				isMinEditDepth && !collapsed ? React.createElement(AddListEntry, { cursor: this.props.cursor, keyName: this.props.keyName, __source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 111
					}
				}) : '',
				']'
			) : React.createElement(
				'span',
				{ style: inputContainerStyle, __source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 113
					}
				},
				'"',
				React.createElement('input', {
					type: 'text',
					value: this.state.inputValue,
					onChange: this._onChange,
					onBlur: this._onBlur,
					onKeyUp: this._onKeyUp,
					size: this.state.inputValue.length,
					style: inputStyle,
					__source: {
						fileName: '../../../src/components/Entry.jsx',
						lineNumber: 114
					}
				}),
				'" ',
				React.createElement(
					'a',
					{ href: '#', onClick: this.deletePath, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 122
						}
					},
					React.createElement('i', { className: 'fa fa-times-circle', style: { color: "#FD971F" }, __source: {
							fileName: '../../../src/components/Entry.jsx',
							lineNumber: 122
						}
					})
				)
			)
		);
	}
});

module.exports = Entry;

},{"./AddListEntry":"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/AddListEntry.js","./AddMapEntry":"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/AddMapEntry.js","immutable":"immutable","immutable/contrib/cursor":"/Users/will/Code/resume/node_modules/immutable/contrib/cursor/index.js","object-assign":"/Users/will/Code/resume/node_modules/object-assign/index.js","react":"react"}],"/Users/will/Code/resume/node_modules/immutable-editor/dist/index.js":[function(require,module,exports){
'use strict';

// index.js

module.exports = require('./components/Editor');

},{"./components/Editor":"/Users/will/Code/resume/node_modules/immutable-editor/dist/components/Editor.js"}],"/Users/will/Code/resume/node_modules/immutable-editor/dist/libs/FileSaver.js":[function(require,module,exports){
"use strict";

/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.1.20150716
 *
 * By Eli Grey, http://eligrey.com
 * License: X11/MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function (view) {
	"use strict"
	// IE <10 is explicitly unsupported
	;
	if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var doc = view.document
	// only get URL when necessary in case Blob.js hasn't overridden it yet
	,
	    get_URL = function get_URL() {
		return view.URL || view.webkitURL || view;
	},
	    save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a"),
	    can_use_save_link = "download" in save_link,
	    click = function click(node) {
		var event = new MouseEvent("click");
		node.dispatchEvent(event);
	},
	    webkit_req_fs = view.webkitRequestFileSystem,
	    req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem,
	    throw_outside = function throw_outside(ex) {
		(view.setImmediate || view.setTimeout)(function () {
			throw ex;
		}, 0);
	},
	    force_saveable_type = "application/octet-stream",
	    fs_min_size = 0
	// See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
	// https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
	// for the reasoning behind the timeout and revocation flow
	,
	    arbitrary_revoke_timeout = 500 // in ms
	,
	    revoke = function revoke(file) {
		var revoker = function revoker() {
			if (typeof file === "string") {
				// file is an object URL
				get_URL().revokeObjectURL(file);
			} else {
				// file is a File
				file.remove();
			}
		};
		if (view.chrome) {
			revoker();
		} else {
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
	},
	    dispatch = function dispatch(filesaver, event_types, event) {
		event_types = [].concat(event_types);
		var i = event_types.length;
		while (i--) {
			var listener = filesaver["on" + event_types[i]];
			if (typeof listener === "function") {
				try {
					listener.call(filesaver, event || filesaver);
				} catch (ex) {
					throw_outside(ex);
				}
			}
		}
	},
	    auto_bom = function auto_bom(blob) {
		// prepend BOM for UTF-8 XML and text/* types (including HTML)
		if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
			return new Blob(["﻿", blob], { type: blob.type });
		}
		return blob;
	},
	    FileSaver = function FileSaver(blob, name, no_auto_bom) {
		if (!no_auto_bom) {
			blob = auto_bom(blob);
		}
		// First try a.download, then web filesystem, then object URLs
		var filesaver = this,
		    type = blob.type,
		    blob_changed = false,
		    object_url,
		    target_view,
		    dispatch_all = function dispatch_all() {
			dispatch(filesaver, "writestart progress write writeend".split(" "));
		}
		// on any filesys errors revert to saving with object URLs
		,
		    fs_error = function fs_error() {
			// don't create more object URLs than needed
			if (blob_changed || !object_url) {
				object_url = get_URL().createObjectURL(blob);
			}
			if (target_view) {
				target_view.location.href = object_url;
			} else {
				var new_tab = view.open(object_url, "_blank");
				if (new_tab == undefined && typeof safari !== "undefined") {
					//Apple do not allow window.open, see http://bit.ly/1kZffRI
					view.location.href = object_url;
				}
			}
			filesaver.readyState = filesaver.DONE;
			dispatch_all();
			revoke(object_url);
		},
		    abortable = function abortable(func) {
			return function () {
				if (filesaver.readyState !== filesaver.DONE) {
					return func.apply(this, arguments);
				}
			};
		},
		    create_if_not_found = { create: true, exclusive: false },
		    slice;
		filesaver.readyState = filesaver.INIT;
		if (!name) {
			name = "download";
		}
		if (can_use_save_link) {
			object_url = get_URL().createObjectURL(blob);
			save_link.href = object_url;
			save_link.download = name;
			setTimeout(function () {
				click(save_link);
				dispatch_all();
				revoke(object_url);
				filesaver.readyState = filesaver.DONE;
			});
			return;
		}
		// Object and web filesystem URLs have a problem saving in Google Chrome when
		// viewed in a tab, so I force save with application/octet-stream
		// http://code.google.com/p/chromium/issues/detail?id=91158
		// Update: Google errantly closed 91158, I submitted it again:
		// https://code.google.com/p/chromium/issues/detail?id=389642
		if (view.chrome && type && type !== force_saveable_type) {
			slice = blob.slice || blob.webkitSlice;
			blob = slice.call(blob, 0, blob.size, force_saveable_type);
			blob_changed = true;
		}
		// Since I can't be sure that the guessed media type will trigger a download
		// in WebKit, I append .download to the filename.
		// https://bugs.webkit.org/show_bug.cgi?id=65440
		if (webkit_req_fs && name !== "download") {
			name += ".download";
		}
		if (type === force_saveable_type || webkit_req_fs) {
			target_view = view;
		}
		if (!req_fs) {
			fs_error();
			return;
		}
		fs_min_size += blob.size;
		req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
			fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
				var save = function save() {
					dir.getFile(name, create_if_not_found, abortable(function (file) {
						file.createWriter(abortable(function (writer) {
							writer.onwriteend = function (event) {
								target_view.location.href = file.toURL();
								filesaver.readyState = filesaver.DONE;
								dispatch(filesaver, "writeend", event);
								revoke(file);
							};
							writer.onerror = function () {
								var error = writer.error;
								if (error.code !== error.ABORT_ERR) {
									fs_error();
								}
							};
							"writestart progress write abort".split(" ").forEach(function (event) {
								writer["on" + event] = filesaver["on" + event];
							});
							writer.write(blob);
							filesaver.abort = function () {
								writer.abort();
								filesaver.readyState = filesaver.DONE;
							};
							filesaver.readyState = filesaver.WRITING;
						}), fs_error);
					}), fs_error);
				};
				dir.getFile(name, { create: false }, abortable(function (file) {
					// delete file if it already exists
					file.remove();
					save();
				}), abortable(function (ex) {
					if (ex.code === ex.NOT_FOUND_ERR) {
						save();
					} else {
						fs_error();
					}
				}));
			}), fs_error);
		}), fs_error);
	},
	    FS_proto = FileSaver.prototype,
	    saveAs = function saveAs(blob, name, no_auto_bom) {
		return new FileSaver(blob, name, no_auto_bom);
	};
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function (blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name || "download");
		};
	}

	FS_proto.abort = function () {
		var filesaver = this;
		filesaver.readyState = filesaver.DONE;
		dispatch(filesaver, "abort");
	};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error = FS_proto.onwritestart = FS_proto.onprogress = FS_proto.onwrite = FS_proto.onabort = FS_proto.onerror = FS_proto.onwriteend = null;

	return saveAs;
})(typeof self !== "undefined" && self || typeof window !== "undefined" && window || undefined.content);
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
	module.exports.saveAs = saveAs;
} else if (typeof define !== "undefined" && define !== null && define.amd != null) {
	define([], function () {
		return saveAs;
	});
}

// LICENSE
// Copyright © 2015 Eli Grey.
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

},{}],"/Users/will/Code/resume/node_modules/immutable-editor/dist/models/HistoryModel.js":[function(require,module,exports){
'use strict';

var Immutable = require('immutable');
var EventEmitter = require('events');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

var _model = {
	history: Immutable.List([]),
	offset: 1
};

var HistoryModel = assign({}, EventEmitter.prototype, {
	getAll: function getAll() {
		return _model;
	},
	emitChange: function emitChange() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function addChangeListener(cb) {
		this.on(CHANGE_EVENT, cb);
	},
	removeChangeListener: function removeChangeListener(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},
	new: function _new(newModel) {
		_model = newModel;
		this.emitChange();
	},
	push: function push(value) {
		if (!_model.history.includes(value)) {
			_model.history = _model.history.skipLast(_model.offset - 1).push(value);
			_model.offset = 1;
			this.emitChange();
		}
	},
	pop: function pop() {
		var last = _model.last();
		_model.history = _model.history.pop();
		this.emitChange();
		return last;
	},
	get: function get() {
		return _model.history.get(_model.history.size - _model.offset);
	},
	setOffset: function setOffset(offset) {
		_model.offset = offset;
	},
	decOffset: function decOffset() {
		if (_model.offset !== 1) {
			_model.offset = _model.offset - 1;
		}
	},
	incOffset: function incOffset() {
		// console.log(_model.offset);
		if (_model.offset !== _model.history.size) {
			_model.offset = _model.offset + 1;
		}
	}
});

module.exports = HistoryModel;

},{"events":"/Users/will/Code/resume/node_modules/grunt-browserify/node_modules/browserify/node_modules/events/events.js","immutable":"immutable","object-assign":"/Users/will/Code/resume/node_modules/object-assign/index.js"}],"/Users/will/Code/resume/node_modules/immutable/contrib/cursor/index.js":[function(require,module,exports){
/**
 *  Copyright (c) 2014-2015, Facebook, Inc.
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree. An additional grant
 *  of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Cursor is expected to be required in a node or other CommonJS context:
 *
 *     var Cursor = require('immutable/contrib/cursor');
 *
 * If you wish to use it in the browser, please check out Browserify or WebPack!
 */

var Immutable = require('immutable');
var Iterable = Immutable.Iterable;
var Iterator = Iterable.Iterator;
var Seq = Immutable.Seq;
var Map = Immutable.Map;
var Record = Immutable.Record;


function cursorFrom(rootData, keyPath, onChange) {
  if (arguments.length === 1) {
    keyPath = [];
  } else if (typeof keyPath === 'function') {
    onChange = keyPath;
    keyPath = [];
  } else {
    keyPath = valToKeyPath(keyPath);
  }
  return makeCursor(rootData, keyPath, onChange);
}


var KeyedCursorPrototype = Object.create(Seq.Keyed.prototype);
var IndexedCursorPrototype = Object.create(Seq.Indexed.prototype);

function KeyedCursor(rootData, keyPath, onChange, size) {
  this.size = size;
  this._rootData = rootData;
  this._keyPath = keyPath;
  this._onChange = onChange;
}
KeyedCursorPrototype.constructor = KeyedCursor;

function IndexedCursor(rootData, keyPath, onChange, size) {
  this.size = size;
  this._rootData = rootData;
  this._keyPath = keyPath;
  this._onChange = onChange;
}
IndexedCursorPrototype.constructor = IndexedCursor;

KeyedCursorPrototype.toString = function() {
  return this.__toString('Cursor {', '}');
}
IndexedCursorPrototype.toString = function() {
  return this.__toString('Cursor [', ']');
}

KeyedCursorPrototype.deref =
KeyedCursorPrototype.valueOf =
IndexedCursorPrototype.deref =
IndexedCursorPrototype.valueOf = function(notSetValue) {
  return this._rootData.getIn(this._keyPath, notSetValue);
}

KeyedCursorPrototype.get =
IndexedCursorPrototype.get = function(key, notSetValue) {
  return this.getIn([key], notSetValue);
}

KeyedCursorPrototype.getIn =
IndexedCursorPrototype.getIn = function(keyPath, notSetValue) {
  keyPath = listToKeyPath(keyPath);
  if (keyPath.length === 0) {
    return this;
  }
  var value = this._rootData.getIn(newKeyPath(this._keyPath, keyPath), NOT_SET);
  return value === NOT_SET ? notSetValue : wrappedValue(this, keyPath, value);
}

IndexedCursorPrototype.set =
KeyedCursorPrototype.set = function(key, value) {
  return updateCursor(this, function (m) { return m.set(key, value); }, [key]);
}

IndexedCursorPrototype.push = function(/* values */) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.push.apply(m, args);
  });
}

IndexedCursorPrototype.pop = function() {
  return updateCursor(this, function (m) {
    return m.pop();
  });
}

IndexedCursorPrototype.unshift = function(/* values */) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.unshift.apply(m, args);
  });
}

IndexedCursorPrototype.shift = function() {
  return updateCursor(this, function (m) {
    return m.shift();
  });
}

IndexedCursorPrototype.setIn =
KeyedCursorPrototype.setIn = Map.prototype.setIn;

KeyedCursorPrototype.remove =
KeyedCursorPrototype['delete'] =
IndexedCursorPrototype.remove =
IndexedCursorPrototype['delete'] = function(key) {
  return updateCursor(this, function (m) { return m.remove(key); }, [key]);
}

IndexedCursorPrototype.removeIn =
IndexedCursorPrototype.deleteIn =
KeyedCursorPrototype.removeIn =
KeyedCursorPrototype.deleteIn = Map.prototype.deleteIn;

KeyedCursorPrototype.clear =
IndexedCursorPrototype.clear = function() {
  return updateCursor(this, function (m) { return m.clear(); });
}

IndexedCursorPrototype.update =
KeyedCursorPrototype.update = function(keyOrFn, notSetValue, updater) {
  return arguments.length === 1 ?
    updateCursor(this, keyOrFn) :
    this.updateIn([keyOrFn], notSetValue, updater);
}

IndexedCursorPrototype.updateIn =
KeyedCursorPrototype.updateIn = function(keyPath, notSetValue, updater) {
  return updateCursor(this, function (m) {
    return m.updateIn(keyPath, notSetValue, updater);
  }, keyPath);
}

IndexedCursorPrototype.merge =
KeyedCursorPrototype.merge = function(/*...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.merge.apply(m, args);
  });
}

IndexedCursorPrototype.mergeWith =
KeyedCursorPrototype.mergeWith = function(merger/*, ...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.mergeWith.apply(m, args);
  });
}

IndexedCursorPrototype.mergeIn =
KeyedCursorPrototype.mergeIn = Map.prototype.mergeIn;

IndexedCursorPrototype.mergeDeep =
KeyedCursorPrototype.mergeDeep = function(/*...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.mergeDeep.apply(m, args);
  });
}

IndexedCursorPrototype.mergeDeepWith =
KeyedCursorPrototype.mergeDeepWith = function(merger/*, ...iters*/) {
  var args = arguments;
  return updateCursor(this, function (m) {
    return m.mergeDeepWith.apply(m, args);
  });
}

IndexedCursorPrototype.mergeDeepIn =
KeyedCursorPrototype.mergeDeepIn = Map.prototype.mergeDeepIn;

KeyedCursorPrototype.withMutations =
IndexedCursorPrototype.withMutations = function(fn) {
  return updateCursor(this, function (m) {
    return (m || Map()).withMutations(fn);
  });
}

KeyedCursorPrototype.cursor =
IndexedCursorPrototype.cursor = function(subKeyPath) {
  subKeyPath = valToKeyPath(subKeyPath);
  return subKeyPath.length === 0 ? this : subCursor(this, subKeyPath);
}

/**
 * All iterables need to implement __iterate
 */
KeyedCursorPrototype.__iterate =
IndexedCursorPrototype.__iterate = function(fn, reverse) {
  var cursor = this;
  var deref = cursor.deref();
  return deref && deref.__iterate ? deref.__iterate(
    function (v, k) { return fn(wrappedValue(cursor, [k], v), k, cursor); },
    reverse
  ) : 0;
}

/**
 * All iterables need to implement __iterator
 */
KeyedCursorPrototype.__iterator =
IndexedCursorPrototype.__iterator = function(type, reverse) {
  var deref = this.deref();
  var cursor = this;
  var iterator = deref && deref.__iterator &&
    deref.__iterator(Iterator.ENTRIES, reverse);
  return new Iterator(function () {
    if (!iterator) {
      return { value: undefined, done: true };
    }
    var step = iterator.next();
    if (step.done) {
      return step;
    }
    var entry = step.value;
    var k = entry[0];
    var v = wrappedValue(cursor, [k], entry[1]);
    return {
      value: type === Iterator.KEYS ? k : type === Iterator.VALUES ? v : [k, v],
      done: false
    };
  });
}

KeyedCursor.prototype = KeyedCursorPrototype;
IndexedCursor.prototype = IndexedCursorPrototype;


var NOT_SET = {}; // Sentinel value

function makeCursor(rootData, keyPath, onChange, value) {
  if (arguments.length < 4) {
    value = rootData.getIn(keyPath);
  }
  var size = value && value.size;
  var CursorClass = Iterable.isIndexed(value) ? IndexedCursor : KeyedCursor;
  var cursor = new CursorClass(rootData, keyPath, onChange, size);

  if (value instanceof Record) {
    defineRecordProperties(cursor, value);
  }

  return cursor;
}

function defineRecordProperties(cursor, value) {
  try {
    value._keys.forEach(setProp.bind(undefined, cursor));
  } catch (error) {
    // Object.defineProperty failed. Probably IE8.
  }
}

function setProp(prototype, name) {
  Object.defineProperty(prototype, name, {
    get: function() {
      return this.get(name);
    },
    set: function(value) {
      if (!this.__ownerID) {
        throw new Error('Cannot set on an immutable record.');
      }
    }
  });
}

function wrappedValue(cursor, keyPath, value) {
  return Iterable.isIterable(value) ? subCursor(cursor, keyPath, value) : value;
}

function subCursor(cursor, keyPath, value) {
  if (arguments.length < 3) {
    return makeCursor( // call without value
      cursor._rootData,
      newKeyPath(cursor._keyPath, keyPath),
      cursor._onChange
    );
  }
  return makeCursor(
    cursor._rootData,
    newKeyPath(cursor._keyPath, keyPath),
    cursor._onChange,
    value
  );
}

function updateCursor(cursor, changeFn, changeKeyPath) {
  var deepChange = arguments.length > 2;
  var newRootData = cursor._rootData.updateIn(
    cursor._keyPath,
    deepChange ? Map() : undefined,
    changeFn
  );
  var keyPath = cursor._keyPath || [];
  var result = cursor._onChange && cursor._onChange.call(
    undefined,
    newRootData,
    cursor._rootData,
    deepChange ? newKeyPath(keyPath, changeKeyPath) : keyPath
  );
  if (result !== undefined) {
    newRootData = result;
  }
  return makeCursor(newRootData, cursor._keyPath, cursor._onChange);
}

function newKeyPath(head, tail) {
  return head.concat(listToKeyPath(tail));
}

function listToKeyPath(list) {
  return Array.isArray(list) ? list : Immutable.Iterable(list).toArray();
}

function valToKeyPath(val) {
  return Array.isArray(val) ? val :
    Iterable.isIterable(val) ? val.toArray() :
    [val];
}

exports.from = cursorFrom;

},{"immutable":"immutable"}],"/Users/will/Code/resume/node_modules/immutablediff/src/diff.js":[function(require,module,exports){
'use strict';

var Immutable = require('immutable');
var utils = require('./utils');
var lcs = require('./lcs');
var path = require('./path');
var concatPath = path.concat,
                  escape = path.escape,
                  op = utils.op,
                  isMap = utils.isMap,
                  isIndexed = utils.isIndexed;

var mapDiff = function(a, b, p){
  var ops = [];
  var path = p || '';

  if(Immutable.is(a, b) || (a == b == null)){ return ops; }

  var areLists = isIndexed(a) && isIndexed(b);
  var lastKey = null;
  var removeKey = null

  if(a.forEach){
    a.forEach(function(aValue, aKey){
      if(b.has(aKey)){
        if(isMap(aValue) && isMap(b.get(aKey))){
          ops = ops.concat(mapDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
        }
        else if(isIndexed(b.get(aKey)) && isIndexed(aValue)){
          ops = ops.concat(sequenceDiff(aValue, b.get(aKey), concatPath(path, escape(aKey))));
        }
        else {
          var bValue = b.get ? b.get(aKey) : b;
          var areDifferentValues = (aValue !== bValue);
          if (areDifferentValues) {
            ops.push(op('replace', concatPath(path, escape(aKey)), bValue));
          }
        }
      }
      else {
        if(areLists){
          removeKey = (lastKey != null && (lastKey+1) === aKey) ? removeKey : aKey;
          ops.push( op('remove', concatPath(path, escape(removeKey))) );
          lastKey = aKey;
        }
        else{
          ops.push( op('remove', concatPath(path, escape(aKey))) );
        }
        
      }
    });
  }

  b.forEach(function(bValue, bKey){
    if(a.has && !a.has(bKey)){
      ops.push( op('add', concatPath(path, escape(bKey)), bValue) );
    }
  });

  return ops;
};

var sequenceDiff = function (a, b, p) {
  var ops = [];
  var path = p || '';
  if(Immutable.is(a, b) || (a == b == null)){ return ops; }
  if(b.count() > 100) { return mapDiff(a, b, p); }

  var lcsDiff = lcs.diff(a, b);

  var pathIndex = 0;

  lcsDiff.forEach(function (diff) {
    if(diff.op === '='){ pathIndex++; }
    else if(diff.op === '!='){
      if(isMap(diff.val) && isMap(diff.newVal)){
        var mapDiffs = mapDiff(diff.val, diff.newVal, concatPath(path, pathIndex));
        ops = ops.concat(mapDiffs);
      }
      else{
        ops.push(op('replace', concatPath(path, pathIndex), diff.newVal));
      }
      pathIndex++;
    }
    else if(diff.op === '+'){
      ops.push(op('add', concatPath(path, pathIndex), diff.val));
      pathIndex++;
    }
    else if(diff.op === '-'){ ops.push(op('remove', concatPath(path, pathIndex))); }
  });

  return ops;
};

var primitiveTypeDiff = function (a, b, p) {
  var path = p || '';
  if(a === b){ return []; }
  else{
    return [ op('replace', concatPath(path, ''), b) ];
  }
};

var diff = function(a, b, p){
  if(a != b && (a == null || b == null)){ return Immutable.fromJS([op('replace', '/', b)]); }
  if(isIndexed(a) && isIndexed(b)){
    return Immutable.fromJS(sequenceDiff(a, b));
  }
  else if(isMap(a) && isMap(b)){
    return Immutable.fromJS(mapDiff(a, b));
  }
  else{
    return Immutable.fromJS(primitiveTypeDiff(a, b, p));
  }
};

module.exports = diff;
},{"./lcs":"/Users/will/Code/resume/node_modules/immutablediff/src/lcs.js","./path":"/Users/will/Code/resume/node_modules/immutablediff/src/path.js","./utils":"/Users/will/Code/resume/node_modules/immutablediff/src/utils.js","immutable":"immutable"}],"/Users/will/Code/resume/node_modules/immutablediff/src/lcs.js":[function(require,module,exports){
'use strict';

var Immutable = require('immutable');

/**
 * Returns a two-dimensional array (an array of arrays) with dimensions n by m.
 * All the elements of this new matrix are initially equal to x
 * @param n number of rows
 * @param m number of columns
 * @param x initial element for every item in matrix
 */
var makeMatrix = function(n, m, x){
  var matrix = [];
  for(var i = 0; i < n; i++) {
    matrix[i] = new Array(m);

    if(x != null){
      for(var j = 0; j < m; j++){
        matrix[i][j] = x;
      }
    }
  }

  return matrix;
};

/**
 * Computes Longest Common Subsequence between two Immutable.JS Indexed Iterables
 * Based on Dynamic Programming http://rosettacode.org/wiki/Longest_common_subsequence#Java
 * @param xs ImmutableJS Indexed Sequence 1
 * @param ys ImmutableJS Indexed Sequence 2
 */
var lcs = function(xs, ys){
  var matrix = computeLcsMatrix(xs, ys);

  return backtrackLcs(xs, ys, matrix);
};

var DiffResult = Immutable.Record({op: '=', val: null});
var ReplaceResult = Immutable.Record({op: '!=', val: null, newVal: null});

/**
 * Returns the resulting diff operations of LCS between two sequences
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 * @returns Array of DiffResult {op:'=' | '+' | '-', val:any}
 */
var diff = function(xs, ys){
  var matrix = computeLcsMatrix(xs, ys);

  return printDiff(matrix, xs, ys, xs.size||0, ys.size||0);
};

var printDiff = function(matrix, xs, ys, i, j) {
  if(i === 0 && j === 0) { return []; }
  if (i > 0 && j > 0 && Immutable.is(xs.get(i-1), ys.get(j-1))) {
    return printDiff(matrix, xs, ys, i - 1, j - 1).concat(new DiffResult({
      op: '=',
      val: xs.get(i - 1)
    }));
  }
  else if (i > 0 && j > 0 && i === j && !Immutable.is(xs.get(i-1), ys.get(j-1))) {
    return printDiff(matrix, xs, ys, i - 1, j - 1).concat(new ReplaceResult({
      val: xs.get(i - 1),
      newVal: ys.get(i - 1)
    }));
  }
  else {
    if (j > 0 && (i === 0 || matrix[i][j - 1] >= matrix[i - 1][j])) {
      return printDiff(matrix, xs, ys, i, j - 1).concat(new DiffResult({
        op: '+',
        val: ys.get(j - 1)
      }));
    }
    else if (i > 0 && (j === 0 || matrix[i][j - 1] < matrix[i - 1][j])) {
      return printDiff(matrix, xs, ys, i - 1, j).concat(new DiffResult({
        op: '-',
        val: xs.get(i - 1)
      }));
    }
  }
};

/**
 * Computes the Longest Common Subsequence table
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 */
function computeLcsMatrix(xs, ys) {
  var n = xs.size||0;
  var m = ys.size||0;
  var a = makeMatrix(n + 1, m + 1, 0);

  for (var i = 0; i < n; i++) {
    for (var j = 0; j < m; j++) {
      if (Immutable.is(xs.get(i), ys.get(j))) {
        a[i + 1][j + 1] = a[i][j] + 1;
      }
      else {
        a[i + 1][j + 1] = Math.max(a[i + 1][j], a[i][j + 1]);
      }
    }
  }

  return a;
}

/**
 * Extracts a LCS from matrix M
 * @param xs Indexed Sequence 1
 * @param ys Indexed Sequence 2
 * @param matrix LCS Matrix
 * @returns {Array.<T>} Longest Common Subsequence
 */
var backtrackLcs = function(xs, ys, matrix){
  var lcs = [];
  for(var i = xs.size, j = ys.size; i !== 0 && j !== 0;){
    if (matrix[i][j] === matrix[i-1][j]){ i--; }
    else if (matrix[i][j] === matrix[i][j-1]){ j--; }
    else{
      if(Immutable.is(xs.get(i-1), ys.get(j-1))){
        lcs.push(xs.get(i-1));
        i--;
        j--;
      }
    }
  }
  return lcs.reverse();
};

module.exports = {
  lcs: lcs,
  computeLcsMatrix: computeLcsMatrix,
  diff: diff
};

},{"immutable":"immutable"}],"/Users/will/Code/resume/node_modules/immutablediff/src/path.js":[function(require,module,exports){
'use strict';

var slashRe = new RegExp('/', 'g');
var escapedSlashRe = new RegExp('~1', 'g');
var tildeRe = /~/g;
var escapedTildeRe = /~0/g;

var Path = {
  escape: function (str) {
    if(typeof(str) === 'number'){
      return str.toString();
    }
    if(typeof(str) !== 'string'){
      throw 'param str (' + str + ') is not a string';
    }

    return str.replace(tildeRe, '~0').replace(slashRe, '~1');
  },

  unescape: function (str) {
    if(typeof(str) == 'string') {
      return str.replace(escapedSlashRe, '/').replace(escapedTildeRe, '~');
    }
    else {
      return str;
    }
  },
  concat: function(path, key){
    return path + '/' + key;
  }
};

module.exports = Path;
},{}],"/Users/will/Code/resume/node_modules/immutablediff/src/utils.js":[function(require,module,exports){
'use strict';

var Immutable = require('immutable');

var isMap = function(obj){ return Immutable.Iterable.isKeyed(obj); };
var isIndexed = function(obj) { return Immutable.Iterable.isIndexed(obj); };

var op = function(operation, path, value){
  if(operation === 'remove') { return { op: operation, path: path }; }

  return { op: operation, path: path, value: value };
};

module.exports = {
  isMap: isMap,
  isIndexed: isIndexed,
  op: op
};
},{"immutable":"immutable"}],"/Users/will/Code/resume/node_modules/object-assign/index.js":[function(require,module,exports){
'use strict';
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function ownEnumerableKeys(obj) {
	var keys = Object.getOwnPropertyNames(obj);

	if (Object.getOwnPropertySymbols) {
		keys = keys.concat(Object.getOwnPropertySymbols(obj));
	}

	return keys.filter(function (key) {
		return propIsEnumerable.call(obj, key);
	});
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = ownEnumerableKeys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],"/Users/will/Code/resume/src/js/components/Resume/Awards.jsx":[function(require,module,exports){
// Awards
'use strict';

var React = require('react');

// Material UI

var _require = require('material-ui');

var Card = _require.Card;
var CardTitle = _require.CardTitle;
var CardText = _require.CardText;

var Awards = React.createClass({
	displayName: 'Awards',

	render: function render() {
		if (!this.props.info || this.props.info.size === 0) return React.createElement('div', null);
		var singleItem = this.props.info.size === 1 ? true : false;
		return React.createElement(
			'div',
			null,
			React.createElement(
				Card,
				{ initiallyExpanded: true, zDepth: 0 },
				React.createElement(CardTitle, { title: 'Awards' }),
				this.props.info.map(function (award, key) {
					return React.createElement(
						Card,
						{ key: key, expandable: true, style: { width: "95%", margin: "0 auto 16px" }, initiallyExpanded: singleItem },
						React.createElement(
							CardTitle,
							{ showExpandableButton: true },
							React.createElement(
								'h2',
								{ style: { margin: "0", fontWeight: "normal" } },
								award.get('title')
							)
						),
						React.createElement(
							CardText,
							{ expandable: true },
							React.createElement(
								'div',
								null,
								award.get('awarder')
							),
							React.createElement(
								'div',
								null,
								award.get('date')
							),
							React.createElement(
								'div',
								null,
								award.get('summary')
							)
						)
					);
				})
			)
		);
	}
});

module.exports = Awards;

},{"material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/Basics.jsx":[function(require,module,exports){
'use strict';

var React = require('react');

// Material UI

var _require = require('material-ui');

var Card = _require.Card;
var CardTitle = _require.CardTitle;
var CardText = _require.CardText;
var ClearFix = _require.ClearFix;
var IconButton = _require.IconButton;

var Basics = React.createClass({
	displayName: 'Basics',

	render: function render() {
		var basicInfo = this.props.info;
		// console.log(basicInfo('location'));
		var iconStyle = { fontSize: "20px" };
		return React.createElement(
			'div',
			null,
			React.createElement(
				'div',
				{ style: { float: "right" } },
				basicInfo.has('email') ? React.createElement(IconButton, { iconStyle: iconStyle, iconClassName: 'fa fa-envelope', tooltip: basicInfo.get('email'), tooltipPosition: 'top-center', linkButton: true, href: 'mailto:' + basicInfo.get('email') }) : '',
				basicInfo.has('phone') ? React.createElement(IconButton, { iconStyle: iconStyle, iconClassName: 'fa fa-phone', tooltip: basicInfo.get('phone'), tooltipPosition: 'top-center', linkButton: true, href: 'tel:' + basicInfo.get('phone') }) : '',
				basicInfo.has('website') ? React.createElement(IconButton, { iconStyle: iconStyle, iconClassName: 'fa fa-external-link', tooltip: basicInfo.get('website'), tooltipPosition: 'top-center', linkButton: true, href: basicInfo.get('website'), target: '_blank' }) : '',
				basicInfo.has('profiles') ? basicInfo.get('profiles').map(function (v) {
					return v.size ? React.createElement(IconButton, { key: v.get('network'), iconClassName: 'fa fa-' + (v.has('network') ? v.get('network').toLowerCase() : ''), tooltip: v.get('username'), tooltipPosition: 'top-center', linkButton: true, href: v.get('url'), target: '_blank' }) : '';
				}) : ''
			),
			React.createElement(
				'h1',
				{ style: { fontSize: "3em", fontWeight: "normal" } },
				basicInfo.get('name'),
				React.createElement(
					'small',
					{ style: { fontSize: ".5em", color: "#666", display: "block" } },
					basicInfo.get('label')
				)
			),
			React.createElement(ClearFix, null),
			(function () {
				var location = basicInfo.get('location');
				return React.createElement(
					'address',
					{ style: { marginBottom: "10px", paddingLeft: "5px", textAlign: "right" } },
					location.get('address'),
					', ',
					location.get('city'),
					', ',
					location.get('postalCode')
				);
			})(),
			React.createElement(
				Card,
				{ initiallyExpanded: true, zDepth: 0 },
				React.createElement(CardTitle, { title: 'About Me' }),
				React.createElement(
					CardText,
					{ expandable: true },
					basicInfo.get('summary')
				)
			)
		);
	}
});

module.exports = Basics;

},{"material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/Education.jsx":[function(require,module,exports){
// Education
'use strict';

var React = require('react');

// Material UI

var _require = require('material-ui');

var Card = _require.Card;
var CardTitle = _require.CardTitle;
var CardText = _require.CardText;

var Education = React.createClass({
	displayName: 'Education',

	render: function render() {
		if (!this.props.info || this.props.info.size === 0) return React.createElement('div', null);
		var singleItem = this.props.info.size === 1 ? true : false;
		return React.createElement(
			'div',
			null,
			React.createElement(
				Card,
				{ initiallyExpanded: true, zDepth: 0 },
				React.createElement(CardTitle, { title: 'Education' }),
				this.props.info.map(function (education, key) {
					return React.createElement(
						Card,
						{ key: key, expandable: true, style: { width: "95%", margin: "0 auto 16px" }, initiallyExpanded: singleItem },
						React.createElement(
							CardTitle,
							{ showExpandableButton: true },
							React.createElement(
								'h2',
								{ style: { margin: "0", fontWeight: "normal" } },
								education.get('institution')
							)
						),
						React.createElement(
							CardText,
							{ expandable: true },
							React.createElement(
								'div',
								null,
								education.get('area')
							),
							React.createElement(
								'div',
								null,
								education.get('startDate'),
								' - ',
								education.get('endDate')
							)
						),
						education.has('courses') ? React.createElement(
							CardText,
							{ expandable: true },
							'Courses:',
							React.createElement(
								'ul',
								null,
								education.get('courses').size ? education.get('courses').map(function (course, key) {
									return React.createElement(
										'li',
										{ key: key },
										course
									);
								}) : ''
							)
						) : ''
					);
				})
			)
		);
	}
});

module.exports = Education;

},{"material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/Publications.jsx":[function(require,module,exports){
// Publications
'use strict';

var React = require('react');

// Material UI

var _require = require('material-ui');

var Card = _require.Card;
var CardTitle = _require.CardTitle;
var CardText = _require.CardText;

var Publications = React.createClass({
	displayName: 'Publications',

	render: function render() {
		if (!this.props.info || this.props.info.size === 0) return React.createElement('div', null);
		var singleItem = this.props.info.size === 1 ? true : false;
		return React.createElement(
			'div',
			null,
			React.createElement(
				Card,
				{ initiallyExpanded: true, zDepth: 0 },
				React.createElement(CardTitle, { title: 'Publications' }),
				this.props.info.map(function (publication, key) {
					return React.createElement(
						Card,
						{ key: key, expandable: true, style: { width: "95%", margin: "0 auto 16px" }, initiallyExpanded: singleItem },
						React.createElement(
							CardTitle,
							{ showExpandableButton: true },
							React.createElement(
								'h2',
								{ style: { margin: "0", fontWeight: "normal" } },
								publication.get('name')
							)
						),
						React.createElement(
							CardText,
							{ expandable: true },
							React.createElement(
								'div',
								null,
								publication.get('publisher')
							),
							React.createElement(
								'div',
								null,
								publication.get('releaseDate')
							),
							React.createElement(
								'div',
								null,
								publication.get('website')
							),
							React.createElement(
								'div',
								null,
								publication.get('summary')
							)
						)
					);
				})
			)
		);
	}
});

module.exports = Publications;

},{"material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/Resume.jsx":[function(require,module,exports){
// Top-level component
'use strict';

var React = require('react');
var Immutable = require('immutable');
var Map = Immutable.Map;
var List = Immutable.List;

var getResumeJSON = require('../../libs/getResumeJSON');
var ResumeModel = require('../../models/ResumeModel');
React.initializeTouchEvents(true);

// Material UI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var AppBar = mui.AppBar;
var Snackbar = mui.Snackbar;

// components
var Basics = require('./Basics.jsx');
var Work = require('./Work.jsx');
var Volunteer = require('./Volunteer.jsx');
var Education = require('./Education.jsx');
var Awards = require('./Awards.jsx');
var Publications = require('./Publications.jsx');
var Skills = require('./Skills.jsx');

var Resume = React.createClass({
	displayName: 'Resume',

	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},
	shouldComponentUpdate: function shouldComponentUpdate(nextProps) {
		return this.props.data !== nextProps.data;
	},
	componentWillMount: function componentWillMount() {
		ThemeManager.setPalette({
			primary1Color: "#2C3E50"
		});
	},
	render: function render() {
		if (this.props.data.size === 0) return React.createElement('div', null);
		return React.createElement(
			'div',
			null,
			React.createElement(AppBar, {
				iconClassNameLeft: 'fa fa-pencil',
				onLeftIconButtonTouchTap: this.props.onAppBarTouch,
				title: 'My Resume',
				zDepth: 1,
				style: { position: "fixed" }
			}),
			React.createElement(
				'div',
				{ style: { padding: "64px 25px 25px", maxWidth: "800px" } },
				React.createElement(Basics, { info: this.props.data.get('basics') }),
				React.createElement(Work, { info: this.props.data.get('work') }),
				React.createElement(Skills, { info: this.props.data.get('skills') }),
				React.createElement(Volunteer, { info: this.props.data.get('volunteer') }),
				React.createElement(Education, { info: this.props.data.get('education') }),
				React.createElement(Awards, { info: this.props.data.get('awards') }),
				React.createElement(Publications, { info: this.props.data.get('publications') })
			),
			React.createElement(Snackbar, {
				message: 'Click on the pencil icon in the upper-right corner to edit',
				openOnMount: true
			})
		);
	}
});

module.exports = Resume;

},{"../../libs/getResumeJSON":"/Users/will/Code/resume/src/js/libs/getResumeJSON.js","../../models/ResumeModel":"/Users/will/Code/resume/src/js/models/ResumeModel.js","./Awards.jsx":"/Users/will/Code/resume/src/js/components/Resume/Awards.jsx","./Basics.jsx":"/Users/will/Code/resume/src/js/components/Resume/Basics.jsx","./Education.jsx":"/Users/will/Code/resume/src/js/components/Resume/Education.jsx","./Publications.jsx":"/Users/will/Code/resume/src/js/components/Resume/Publications.jsx","./Skills.jsx":"/Users/will/Code/resume/src/js/components/Resume/Skills.jsx","./Volunteer.jsx":"/Users/will/Code/resume/src/js/components/Resume/Volunteer.jsx","./Work.jsx":"/Users/will/Code/resume/src/js/components/Resume/Work.jsx","immutable":"immutable","material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/Skills.jsx":[function(require,module,exports){
// Skills
'use strict';

var React = require('react');

// Material UI

var _require = require('material-ui');

var Card = _require.Card;
var CardTitle = _require.CardTitle;
var CardText = _require.CardText;
var FlatButton = _require.FlatButton;
var CardHeader = _require.CardHeader;
var Avatar = _require.Avatar;

var Skills = React.createClass({
	displayName: 'Skills',

	render: function render() {
		if (!this.props.info || this.props.info.size === 0) return React.createElement('div', null);
		var singleItem = this.props.info.size === 1 ? true : false;
		return React.createElement(
			'div',
			null,
			React.createElement(
				Card,
				{ initiallyExpanded: true, zDepth: 0 },
				React.createElement(CardTitle, { title: 'Skills' }),
				React.createElement(
					'div',
					{ style: { width: "95%", margin: "0 2.5%" } },
					this.props.info.map(function (skill, key) {
						return React.createElement(
							'div',
							{ key: key, style: { marginBottom: "20px" } },
							React.createElement(
								Card,
								{ initiallyExpanded: true },
								React.createElement(
									CardHeader,
									{ avatar: React.createElement(
											Avatar,
											null,
											skill.has('level') ? skill.get('level')[0] : ''
										), title: skill.get('name'), subtitle: skill.get('level'), style: { fontSize: "16px" } },
									React.createElement(
										'div',
										{ style: { float: "right" } },
										skill.has('keywords') ? skill.get('keywords').map(function (word, key) {
											return React.createElement(FlatButton, { key: key, style: { color: "#aaa", cursor: "default" }, label: word });
										}) : ''
									)
								)
							)
						);
					})
				)
			)
		);
	}
});

module.exports = Skills;

},{"material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/Volunteer.jsx":[function(require,module,exports){
// Volunteer
'use strict';

var React = require('react');

// Material UI

var _require = require('material-ui');

var Card = _require.Card;
var CardTitle = _require.CardTitle;
var CardText = _require.CardText;

var Volunteer = React.createClass({
	displayName: 'Volunteer',

	render: function render() {
		if (!this.props.info || this.props.info.size === 0) return React.createElement('div', null);
		var singleItem = this.props.info.size === 1 ? true : false;
		return React.createElement(
			'div',
			null,
			React.createElement(
				Card,
				{ initiallyExpanded: true, zDepth: 0 },
				React.createElement(CardTitle, { title: 'Volunteering' }),
				this.props.info.map(function (volunteer, key) {
					return React.createElement(
						Card,
						{ key: key, expandable: true, style: { width: "95%", margin: "0 auto 16px" }, initiallyExpanded: singleItem },
						React.createElement(
							CardTitle,
							{ showExpandableButton: true },
							React.createElement(
								'h2',
								{ style: { margin: "0", fontWeight: "normal" } },
								volunteer.get('organization')
							)
						),
						React.createElement(
							CardText,
							{ expandable: true },
							React.createElement(
								'div',
								null,
								volunteer.get('position')
							),
							React.createElement(
								'div',
								null,
								volunteer.get('startDate'),
								' - ',
								volunteer.get('endDate')
							)
						),
						React.createElement(
							CardText,
							{ expandable: true },
							volunteer.get('summary')
						),
						volunteer.has('highlights') ? React.createElement(
							CardText,
							{ expandable: true },
							'Highlights:',
							React.createElement(
								'ul',
								null,
								volunteer.get('highlights').size ? volunteer.get('highlights').map(function (highlight, key) {
									return React.createElement(
										'li',
										{ key: key },
										highlight
									);
								}) : ''
							)
						) : ''
					);
				})
			)
		);
	}
});

module.exports = Volunteer;

},{"material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/Work.jsx":[function(require,module,exports){
// Work
'use strict';

var React = require('react');
var Map = require('immutable').Map;

// Material UI

var _require = require('material-ui');

var Card = _require.Card;
var CardTitle = _require.CardTitle;
var CardText = _require.CardText;

var Work = React.createClass({
	displayName: 'Work',

	render: function render() {
		if (!this.props.info || this.props.info.size === 0) return React.createElement('div', null);
		var singleItem = this.props.info.size === 1 ? true : false;
		return React.createElement(
			'div',
			null,
			React.createElement(
				Card,
				{ initiallyExpanded: true, zDepth: 0 },
				React.createElement(CardTitle, { title: 'Experience' }),
				this.props.info.map(function (work, key) {
					return Map.isMap(work) ? React.createElement(
						Card,
						{ key: key, expandable: true, style: { width: "95%", margin: "0 auto 16px" }, initiallyExpanded: singleItem },
						React.createElement(
							CardTitle,
							{ showExpandableButton: true },
							React.createElement(
								'h2',
								{ style: { margin: "0", fontWeight: "normal" } },
								work.get('company')
							)
						),
						React.createElement(
							CardText,
							{ expandable: true },
							React.createElement(
								'div',
								null,
								work.get('position')
							),
							React.createElement(
								'div',
								null,
								work.get('startDate'),
								' - ',
								work.get('endDate')
							)
						),
						React.createElement(
							CardText,
							{ expandable: true },
							work.get('summary')
						),
						work.get('highlights') ? React.createElement(
							CardText,
							{ expandable: true },
							'Highlights:',
							React.createElement(
								'ul',
								null,
								work.get('highlights').size ? work.get('highlights').map(function (highlight, key) {
									return React.createElement(
										'li',
										{ key: key },
										highlight
									);
								}) : ''
							)
						) : ''
					) : '';
				})
			)
		);
	}
});

module.exports = Work;

},{"immutable":"immutable","material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/components/Resume/index.js":[function(require,module,exports){
// index.js

'use strict';

module.exports = require('./Resume.jsx');

},{"./Resume.jsx":"/Users/will/Code/resume/src/js/components/Resume/Resume.jsx"}],"/Users/will/Code/resume/src/js/components/Toolbar.jsx":[function(require,module,exports){
// Toolbar
'use strict';

var React = require('react');

// Material UI
var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();
var Colors = mui.Styles.Colors;
var RaisedButton = mui.RaisedButton;

var toolbarStyle = {
	fontFamily: "Roboto, sans-serif",
	margin: "0",
	padding: "0",
	WebkitFontSmoothing: "antialiased",
	fontSize: "13px",
	position: "fixed",
	left: "50%",
	transform: "translateX(-105%)"
};

var EditorToolBar = React.createClass({
	displayName: 'EditorToolBar',

	childContextTypes: {
		muiTheme: React.PropTypes.object
	},
	getChildContext: function getChildContext() {
		return {
			muiTheme: ThemeManager.getCurrentTheme()
		};
	},
	undo: function undo() {
		this.props.undo();
	},
	redo: function redo() {
		this.props.redo();
	},
	save: function save() {
		this.props.save();
	},
	render: function render() {
		return React.createElement(
			'div',
			{ style: toolbarStyle },
			React.createElement(
				'div',
				{ style: { marginTop: "5px" } },
				React.createElement(RaisedButton, { label: 'UNDO', primary: true, onClick: this.undo }),
				' ',
				React.createElement(RaisedButton, { label: 'REDO', secondary: true, onClick: this.redo }),
				' ',
				React.createElement(RaisedButton, { label: 'SAVE', onClick: this.save })
			)
		);
	}
});

module.exports = EditorToolBar;

},{"material-ui":"material-ui","react":"react"}],"/Users/will/Code/resume/src/js/init.jsx":[function(require,module,exports){
// init

'use strict';

var React = require('react');
var injectTapEventPlugin = require("react-tap-event-plugin");
var Immutable = require('immutable');
var List = Immutable.List;
var Map = Immutable.Map;

var diff = require('immutablediff');
injectTapEventPlugin();
React.initializeTouchEvents();

var ResumeModel = require('./models/ResumeModel');
var getResumeJSON = require('./libs/getResumeJSON');

var Resume = require('./components/Resume');
var Editor = require('immutable-editor');
var Toolbar = require('./components/Toolbar.jsx');

var appStyle = {
	fontFamily: "Roboto, sans-serif",
	margin: "0",
	padding: "0",
	WebkitFontSmoothing: "antialiased",
	fontSize: "13px"
};

var toolbarStyle = {
	fontFamily: "Roboto, sans-serif",
	margin: "0",
	padding: "0",
	WebkitFontSmoothing: "antialiased",
	fontSize: "13px",
	position: "absolute",
	left: "100%",
	transform: "translateX(-110px)"
};

var App = React.createClass({
	displayName: 'App',

	propTypes: {
		json: React.PropTypes.string.isRequired
	},
	getInitialState: function getInitialState() {
		return {
			showEditor: false,
			resume: ResumeModel.getAll()
		};
	},
	toggleEditor: function toggleEditor() {
		this.setState({ showEditor: !this.state.showEditor });
	},
	_onChange: function _onChange() {
		var resume = ResumeModel.getAll();
		this.setState({ resume: resume });
	},
	componentWillMount: function componentWillMount() {
		ResumeModel.addChangeListener(this._onChange);
		var order = ['basics', 'skills', 'work', 'education', 'volunteer', 'awards', 'publications', 'languages', 'interests', 'references'];
		getResumeJSON(this.props.json).then(function (resume) {
			ResumeModel['new'](Immutable.fromJS(resume).sortBy(function (value, key) {
				return key;
			}, function (a, b) {
				return order.indexOf(a) - order.indexOf(b);
			}));
		})['catch'](function (err) {
			return console.error(err);
		});
	},
	_onEditorUpdate: function _onEditorUpdate(newData) {
		console.log(diff(this.state.resume, newData).toJS());
		ResumeModel['new'](newData);
	},
	render: function render() {
		var _this = this;

		var width = this.state.showEditor ? "50%" : "100%";
		return React.createElement(
			'div',
			{ style: appStyle },
			this.state.resume.size ? React.createElement(
				'div',
				{ style: { float: "left", width: this.state.showEditor ? "50%" : "0", overflow: "scroll", overflowY: "scroll", height: "100%", background: "#282828", position: "relative", transition: ".5s width" } },
				React.createElement(Toolbar, {
					undo: function () {
						_this._onEditorUpdate(Editor.undo(true));
					},
					redo: function () {
						_this._onEditorUpdate(Editor.redo(true));
					},
					save: function () {
						Editor.save('resume.json');
					}
				}),
				React.createElement(Editor, {
					data: this.state.resume,
					onUpdate: this._onEditorUpdate,
					minEditDepth: 1,
					minRemovalDepth: 2,
					immutable: true
				})
			) : '',
			React.createElement(
				'div',
				{ style: { float: "left", width: width, overflow: "scroll", height: "100%", transition: "width 0.5s" } },
				React.createElement(Resume, { data: this.state.resume, onAppBarTouch: this.toggleEditor })
			)
		);
	}
});

window.ResumeInit = function (url) {
	return React.render(React.createElement(App, { json: url }), document.getElementById('app'));
};

},{"./components/Resume":"/Users/will/Code/resume/src/js/components/Resume/index.js","./components/Toolbar.jsx":"/Users/will/Code/resume/src/js/components/Toolbar.jsx","./libs/getResumeJSON":"/Users/will/Code/resume/src/js/libs/getResumeJSON.js","./models/ResumeModel":"/Users/will/Code/resume/src/js/models/ResumeModel.js","immutable":"immutable","immutable-editor":"/Users/will/Code/resume/node_modules/immutable-editor/dist/index.js","immutablediff":"/Users/will/Code/resume/node_modules/immutablediff/src/diff.js","react":"react","react-tap-event-plugin":"react-tap-event-plugin"}],"/Users/will/Code/resume/src/js/libs/getResumeJSON.js":[function(require,module,exports){
// get resume
'use strict';

var Promise = require('bluebird');

function getResumeJSON(url) {
	return new Promise(function (resolve, reject) {
		var xhr = new XMLHttpRequest();
		xhr.open('get', url);

		xhr.onload = function () {
			if (xhr.status === 200) {
				resolve(JSON.parse(xhr.response));
			} else {
				reject({
					status: xhr.status,
					statusText: xhr.statusText
				});
			}
		};

		xhr.onerror = function () {
			reject({
				status: xhr.status,
				statusText: xhr.statusText
			});
		};

		xhr.send();
	});
}

module.exports = getResumeJSON;

},{"bluebird":"bluebird"}],"/Users/will/Code/resume/src/js/models/ResumeModel.js":[function(require,module,exports){
'use strict';

var Immutable = require('immutable');
var EventEmitter = require('events');
var assign = require('object-assign');
var CHANGE_EVENT = 'change';

var _Model = Immutable.Map({});

var ResumeModel = assign({}, EventEmitter.prototype, {
	getAll: function getAll() {
		return _Model;
	},
	emitChange: function emitChange() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener: function addChangeListener(cb) {
		this.on(CHANGE_EVENT, cb);
	},
	removeChangeListener: function removeChangeListener(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},
	'new': function _new(newModel) {
		_Model = newModel;
		this.emitChange();
	},
	getIn: function getIn(path) {
		return _Model.getIn(path);
	},
	push: function push(path, value) {
		this.setIn(path, this.getIn(path).push(value));
	},
	setIn: function setIn(path, value) {
		_Model = _Model.setIn(path, value);
		this.emitChange();
	},
	deleteIn: function deleteIn(path) {
		this['new'](_Model.deleteIn(path));
	}
});

module.exports = ResumeModel;

},{"events":"/Users/will/Code/resume/node_modules/grunt-browserify/node_modules/browserify/node_modules/events/events.js","immutable":"immutable","object-assign":"/Users/will/Code/resume/node_modules/object-assign/index.js"}]},{},["/Users/will/Code/resume/src/js/init.jsx"]);
