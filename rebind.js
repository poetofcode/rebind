(function(exports) {
	// Unfortunately, in strict mode it couldn't work
	// "use strict";

	//
	// Private declarations
	//
	var bounds = [];

	function isFunction(functionToCheck) {
		var getType = {};
		return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
	}

	//
	// Public declarations
	//
	exports.create = function(mapperUI) {
		var execute = null,
			subscribers = [],
			self = this,
			mapper = null;

		if(mapperUI) {
			mapper = mapperUI;
			mapper.registerOnUpdateUI(setExecute);
		}

		function executeSubscribers() {
			for(var i=0; i<subscribers.length; i++) {
				setTimeout((function() {
					if(!isFunction(subscribers[i])) return;
					subscribers[i]();
				})(i));
			}
		}

		function setExecute(param) {
			if(isFunction(param)) {
				execute = param;
			} else {
				execute = function() { return param };
			}
			executeSubscribers();
		}

		function executeAndUpdateUI() {
			var res = execute();
			if(mapper && isFunction(mapper.onUpdateData)) {
				mapper.onUpdateData(res);
			}
			return res;
		}

		function subscriberExists(func) {
			for(var i=0; i<subscribers.length; i++) {
				if(func === subscribers[i]) {
					return true;
				}
			}

			return false;
		}

		function bound(param) {
			if(!param && !execute) {
				return;
			}

			if(!param && execute) {
				if(arguments.callee.caller && arguments.callee.caller.arguments.callee.caller) {
					var caller = arguments.callee.caller.arguments.callee.caller;

					for(var i=0; i<bounds.length; i++) {
						if(subscriberExists(caller)) continue;
						subscribers.push(caller);
					}
				}
				return executeAndUpdateUI();
			}

			setExecute(param);
			return executeAndUpdateUI();
		}

		bounds.push(bound);
		return bound;
	}

})(typeof exports === 'undefined' ? (this.rebind = {}) : exports );