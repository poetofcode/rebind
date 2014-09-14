var assert = require("assert");
var rebind = require("../rebind");

describe('rebind', function(){
	describe('#create()', function(){
		it('should return closure', function(){
			assert.equal('function', typeof rebind.create() );
		});
	});
});