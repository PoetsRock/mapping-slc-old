'use strict';

angular.module('core').service('mapService', [
	function ($scope) {
		// Various Services for Map Functionality

		this.featuredProjects = function (markerData) {
			var featureProjectsArray = [];
			for (var prop in markerData) {
				var i = 0;
				if (i < 2 && markerData[prop].featured) {      //setup for loop to end after finding the first three featured projects
					var featuredProject = {
						thumb: markerData[prop].thumbnail,
						projectId: markerData[prop]._id,
						shortTitle: markerData[prop].shortTitle
					};
					featureProjectsArray.push(featuredProject);
				}
				i++;
			}
		};
	}
]);
