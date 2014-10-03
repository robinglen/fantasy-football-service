'use strict';

angular.module('fantasyFootballFrontendApp')
  .directive('ffGraph', 
	function (Fantasyfootball) {
		return {
			templateUrl: '/templates/ffGraph.html',
			restrict: 'E',
			replace: 'true',
			scope: {
				ffManager: '@',
				ffType: '@',
				ffLeague: '@'
			},
			link: function postLink(scope, element, attrs) {
				// watch the attributes for any changes        
				scope.$watch('ffManager + ffType', function () {
					if(attrs.ffManager) {
						Fantasyfootball.getManager(attrs.ffManager)
						.then(function(data, status, headers, config) {
							_drawManagerGraph(data);
						}, function(data, status, headers, config) {
							console.error(data)
						})						
					}
				});


				function _drawManagerGraph(managerData){
					console.profile('Draw graph');
					var _data = managerData.thisSeason,
						_type = attrs.ffType,
						_typeArr = [_type];

					_data.forEach(function(d){
						_typeArr.push(parseInt(d[_type]))
					})
					
					var chart = c3.generate({
					    bindto: '#chart',
					    data: {
					      columns: [
					        _typeArr
					      ]
					    }
					});											
				}

				// watch the attributes for any changes        
				scope.$watch('ffLeague', function () {
					if(attrs.ffLeague) {
						Fantasyfootball.getLeague(attrs.ffLeague)
						.then(function(data, status, headers, config) {
							_drawLeagueGraph(data)
							//_drawManagerGraph(data);
						}, function(data, status, headers, config) {
							console.error(data)
						})						
					}
				});

				function _drawLeagueGraph(leagueData){
					console.profile('Draw graph');
					console.log(leagueData)
					var _data = leagueData,
						_type = attrs.ffType,
						_managersArr = [];

					_data.forEach(function(manager){
						var _managerArr = [];
						
						manager.thisSeason.forEach(function(matchday){
							_managerArr.push(matchday.gameWeekPoints)
						})

						_managersArr.push([manager.team + ' - ' + manager.manager].concat(_managerArr))
					})
					
					var chart = c3.generate({
					    bindto: '#chart',
					    data: {
					      columns: _managersArr
					    }
					});											
				}									
				
			}
		};
	});
