const Immutable = require('immutable');
const EventEmitter = require('events');
const assign = require('object-assign');
const CHANGE_EVENT = 'change';

let _store = Immutable.Map({});

const ResumeStore = assign({}, EventEmitter.prototype, {
	getAll() {
		return _store;
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
	new(newStore) {
		_store = newStore;
		this.emitChange();
	},
	setIn(path, value) {
		_store = _store.setIn(path, value);
		this.emitChange();
	},
	deleteIn(path) {
		this.new(_store.deleteIn(path));
	}
});

module.exports = ResumeStore;
