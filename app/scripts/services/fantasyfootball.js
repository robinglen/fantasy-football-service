'use strict';

angular.module('fantasyFootballFrontendApp')
  .service('Fantasyfootball', 
  	function Fantasyfootball($http, $q) {
		var _managers = {},
			_leagues = {};

		function _getManager(url){
			var deferred = $q.defer();

			if(_managers[url]){
				deferred.resolve(_managers[id]);
			}

			else {
				$http({method: 'GET', url: url})
				.success(function(data, status, headers, config) {
					_managers[url] = data;
					console.log(data)
					deferred.resolve(data);      
				})
				.error(function(data, status, headers, config) {
					deferred.reject(data);
				})

			}

			return deferred.promise;
		}

		function _getLeague(id){
			console.log('get league')
			var deferred = $q.defer();

			if(_managers[id]){
				deferred.resolve(_leagues[id]);
			}

			else {
				$http({method: 'GET', url: 'http://localhost:8080/fantasy/league/' + id +'/api'})
				.success(function(data, status, headers, config) {				
					if(_leagues[id]){
						deferred.resolve(_leagues[id]);
					}

					else{
						var _calls = [];

						data.forEach(function(manager){
							_calls.push(_getManager(manager.manager.url))
							console.log(_calls)
							$q.all(_calls)
							.then(function(data){
								if(data.length === _calls.length){
									_leagues[id] = data;
									deferred.resolve(data); 
								}
							})
						})
					}    
				})
				.error(function(data, status, headers, config) {
					deferred.reject(data);
				})

			}

			return deferred.promise;
		}	

		return {
			getManager : function(id){
				_getManager('http://localhost:8080/fantasy/manager/' + id +'/overview')
			},
			getLeague : _getLeague
		}
  	});