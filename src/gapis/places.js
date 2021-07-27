export const searchPlaces = (map, lat, lng, radius, keyword) => {
	return new Promise(resolve => {
		const request = {
			radius, 
			query: keyword,
			bounds: map.getBounds(),
			location: new window.google.maps.LatLng(lat, lng),
		};
		const service = new window.google.maps.places.PlacesService(map);
		service.textSearch(request, (results, status) => {
			if (status == window.google.maps.places.PlacesServiceStatus.OK) {
				return resolve(results)
			}
			return resolve([])
		});
	})
}