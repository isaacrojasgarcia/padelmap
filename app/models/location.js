(function () {

    'use strict';

    angular.module('olaf.models.location', [])
        .factory('Location', [ 'config', LocationFactory]);

	function LocationFactory(config) {

    	function Location() {
    		this.attr = {
	    		id: '',
	    		name: '',
	    		friendly: '',
	    		dad: '',
	    		dadName: ''
	    	}
    		
    	}

    	Location.prototype = {
    		getName: getName,
    		getFriendly: getFriendly,
    		setDataFromFriendly: setDataFromFriendly
    	}

    	// Static
    	Location.convertPathToLocation = convertPathToLocation;


    	function getName() {
    		return this.attr.name;
    	}

    	function getFriendly() {
    		var friendly = this.attr.name;
    		if(this.attr.dadName) {
    			friendly = this.attr.dadName + '/' + this.attr.name;
    		}
    		return friendly;
    	}

    	function convertPathToLocation(path) {
    		var type, _loc = new Location();
    		_.each(config.paths, function(item, index) {
    			if(path.indexOf(item) > -1) {
    				type = index;
    				path = path.replace('/' + item, '');
    			}
    		});

    		switch(type) {
    			case 'searchResult': 
    				_loc.setDataFromFriendly(path);
    				break;
    		}

    		// console.log('convertPathToLocation', _loc);
    		return _loc;
    	}

    	function setDataFromFriendly(friendly) {
    		var splited = _.compact(friendly.split('/'));
    		// console.log('setDataFromFriendly', friendly, splited);
    		this.attr.name = splited[0];
    		if(splited[1]) {
    			this.attr.name = splited[1];
    			this.attr.dadName = splited[0];
    		}
    	}

    	return Location;

    }
}());