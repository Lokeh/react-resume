import Immutable from 'immutable';
import EventEmitter from 'events';
import assign from 'object-assign';
const CHANGE_EVENT = 'change';

let _Model = Immutable.Map({});

export default assign({}, EventEmitter.prototype, {
	getAll() {
		return _Model;
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
		_Model = newModel;
		this.emitChange();
	},
	getIn(path) {
		return _Model.getIn(path);
	},
	push(path, value) {
		this.setIn(path, this.getIn(path).push(value));
	},
	setIn(path, value) {
		_Model = _Model.setIn(path, value);
		this.emitChange();
	},
	deleteIn(path) {
		this.new(_Model.deleteIn(path));
	}
});
