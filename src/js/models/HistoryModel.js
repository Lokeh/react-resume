const Immutable = require('immutable');
const EventEmitter = require('events');
const assign = require('object-assign');
const CHANGE_EVENT = 'change';

let _history = Immutable.List([]);

const HistoryModel = assign({}, EventEmitter.prototype, {
	getAll() {
		return _history;
	},
	emitChange() {
		this.emit(CHANGE_EVENT);
	},
	addChangeListener(cb) {
		this.on(CHANGE_EVENT, cb);
	},
	removeChangeListener(cb) {
		this.removeListener(CHANGE_EVENT, cb);
	},
	new(newModel) {
		_history = newModel;
		this.emitChange();
	},
	push(value) {
		if (!_history.includes(value)) {
			_history = _history.push(value);
			this.emitChange();
		}
	},
	pop() {
		const last = _history.last();
		_history = _history.pop();
		this.emitChange();
		return last;
	},
	splice(newSize, ...items) {
		// truncates the array and then appends an item to the end
		_history = _history.setSize(newSize).push(...items);
		this.emitChange();
	},
	get(index) {
		return _history.get(index);
	}
});

module.exports = HistoryModel;
