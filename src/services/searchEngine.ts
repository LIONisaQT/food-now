import type { CuisineType } from "../App";

export interface SearchCriteria {
	cuisines: CuisineType[];
	location: google.maps.LatLng;
	distance: number;
	priceRange: [number, number];
	minimumRating: number;
	openNow: boolean;
}

export interface SearchEngine {
	search(criteria: SearchCriteria): Promise<google.maps.places.Place[]>;
}

const priceLevels = [
	"FREE",
	"INEXPENSIVE",
	"MODERATE",
	"EXPENSIVE",
	"VERY_EXPENSIVE",
];

export const placesSearchEngine: SearchEngine = {
	async search({
		cuisines,
		location,
		distance,
		priceRange,
		minimumRating,
		openNow,
	}) {
		const { Place } = (await google.maps.importLibrary(
			"places",
		)) as google.maps.PlacesLibrary;

		const responses = await Promise.all(
			cuisines.map((cuisine) =>
				Place.searchByText({
					textQuery: `${cuisine.keyword} restaurant`,
					fields: [
						"id",
						"displayName",
						"location",
						"rating",
						"userRatingCount",
						"priceLevel",
						"photos",
					],
					locationBias: { center: location, radius: distance },
					maxResultCount: 20,
					minRating: minimumRating === 5 ? 4.5 : minimumRating,
					isOpenNow: openNow,
				}),
			),
		);

		return responses
			.flatMap((response) => response.places)
			.filter((place) => {
				const priceLevel = priceLevels.indexOf(place.priceLevel ?? "");
				return (
					priceLevel === -1 ||
					(priceLevel >= priceRange[0] && priceLevel <= priceRange[1])
				);
			})
			.filter(
				(place, index, places) =>
					place.id &&
					places.findIndex((candidate) => candidate.id === place.id) === index,
			);
	},
};
