export const fetchNearbyLocations = (map, lat, lng, radius, type) => {
	return new Promise(resolve => {
		const request = {
			type, radius,
			openNow: false,
			bounds: map.getBounds(),
			location: new window.google.maps.LatLng(lat, lng),
		};
		const service = new window.google.maps.places.PlacesService(map);
		service.nearbySearch(request, (results, status) => {
			if (status == window.google.maps.places.PlacesServiceStatus.OK) {
				return resolve(results)
			}
			return resolve([])
		});
	})
}