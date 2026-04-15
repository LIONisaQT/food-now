import { useEffect, useState, useCallback } from "react";
import "./Modal.scss";

const DEBOUNCE_TIMER = 3;

interface LoadingProps {
	searchFinished: boolean;
	isLoading: boolean;
	results: google.maps.places.PlaceResult[];
	onRestart: () => void;
}

export default function Modal({
	searchFinished,
	isLoading,
	results,
	onRestart,
}: LoadingProps) {
	const [selected, setSelected] =
		useState<google.maps.places.PlaceResult | null>(null);
	const [loadingDetails, setLoadingDetails] = useState(false);
	const [debounceTimer, setDebounceTimer] = useState(0);

	const getRandomRestaurant = (places: google.maps.places.PlaceResult[]) =>
		places[Math.floor(Math.random() * places.length)];

	const getRestaurantDetails = (
		restaurant: google.maps.places.PlaceResult
	): Promise<google.maps.places.PlaceResult> => {
		return new Promise((resolve, reject) => {
			if (!restaurant.place_id) {
				reject(new Error("Restaurant does not have a place_id"));
				return;
			}

			const service = new google.maps.places.PlacesService(
				document.createElement("div")
			);

			const request: google.maps.places.PlaceDetailsRequest = {
				placeId: restaurant.place_id,
				fields: [
					"name",
					"vicinity",
					"geometry",
					"rating",
					"user_ratings_total",
					"reviews",
					"photos",
					"opening_hours",
					"place_id",
				],
			};

			service.getDetails(request, (details, status) => {
				if (status === google.maps.places.PlacesServiceStatus.OK && details) {
					resolve(details);
				} else {
					reject(new Error(`getDetails failed: ${status}`));
				}
			});
		});
	};

	const selectRandomRestaurant = useCallback(async () => {
		if (results.length === 0) return;
		if (loadingDetails) return; // prevent overlapping API calls
		if (debounceTimer > 0) return; // prevent during cooldown

		const randomRestaurant = getRandomRestaurant(results);

		setLoadingDetails(true);
		try {
			const details = await getRestaurantDetails(randomRestaurant);
			setSelected(details);
			setDebounceTimer(DEBOUNCE_TIMER);
		} catch (err) {
			console.error("Failed to fetch restaurant details:", err);
		} finally {
			setLoadingDetails(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [results]);

	// Initial selection (only when results first arrive)
	useEffect(() => {
		if (results.length === 0) return;
		selectRandomRestaurant();
	}, [results, selectRandomRestaurant]);

	// Countdown effect for debounce timer
	useEffect(() => {
		if (debounceTimer === 0) return;

		const interval = setInterval(() => {
			setDebounceTimer((prev) => Math.max(prev - 1, 0));
		}, 1000);

		return () => clearInterval(interval);
	}, [debounceTimer]);

	const getMapLink = () => {
		if (!selected) return "#";

		const latLng = selected.geometry?.location;
		const name = encodeURIComponent(selected.name || "");

		const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

		if (isMobile) {
			if (latLng) {
				// Geo URI with coordinates
				return `geo:${latLng.lat()},${latLng.lng()}?q=${latLng.lat()},${latLng.lng()}(${name})`;
			} else {
				// Fallback: query by name only
				return `geo:0,0?q=${name}`;
			}
		}

		if (selected.place_id) {
			// Desktop or non-mobile: use place_id
			return `https://www.google.com/maps/search/?api=1&query=${name}&query_place_id=${selected.place_id}`;
		}

		if (latLng) {
			// Desktop fallback: coordinates only
			return `https://www.google.com/maps/search/?api=1&query=${latLng.lat()},${latLng.lng()}`;
		}

		// Last resort
		return "#";
	};

	const getYelpLink = (place: google.maps.places.PlaceResult): string => {
		const name = place.name || "";
		const address = place.vicinity || "";
		const query = encodeURIComponent(`${name} ${address}`);
		return `https://www.yelp.com/search?find_desc=${query}`;
	};

	const renderClosingTime = () => {
		if (!selected) return;

		const today = new Date().getDay(); // Sunday = 0, Monday = 1, ...
		const todayPeriod = selected.opening_hours?.periods?.find(
			(period) => period.open?.day === today
		);

		if (!todayPeriod) return null;

		// If there's no close, assume it's open 24 hours
		if (!todayPeriod.close) {
			return <span> | Open 24 hours</span>;
		}

		// Format time (e.g., "1730" → "5:30 PM")
		const formatTime = (time: string) => {
			const hours = parseInt(time.substring(0, 2), 10);
			const minutes = time.substring(2) || "00";
			const date = new Date();
			date.setHours(hours, parseInt(minutes, 10));
			return date.toLocaleTimeString([], {
				hour: "numeric",
				minute: "2-digit",
			});
		};

		return <span> | Closes @ {formatTime(todayPeriod.close.time)}</span>;
	};

	return (
		<div className={`loading-container ${searchFinished ? "show" : ""}`}>
			<div className="background" />
			<div className="modal">
				{isLoading || loadingDetails ? (
					<p className="loading-text">Fetching restaurants...</p>
				) : results.length === 0 ? (
					<div className="result">
						<div className="no-result">
							<h1>No results</h1>
							<p>Try changing your search criteria.</p>
						</div>
						<section className="button-group">
							<button className="secondary" onClick={onRestart}>
								Restart
							</button>
						</section>
					</div>
				) : (
					selected && (
						<div className="result">
							<div className="result-data">
								<h2 className="random-text">Your randomly selected pick:</h2>
								{selected.photos && selected.photos.length > 0 && (
									<div className="photo-container">
										<img
											src={selected.photos[0].getUrl()}
											alt={selected.name}
										/>
									</div>
								)}
								<h1 className="name">{selected.name}</h1>
								<section className="details">
									<p className="vicinity">{selected.vicinity}</p>
									<p>
										{selected.rating}★
										{selected.user_ratings_total && (
											<span> ({selected.user_ratings_total} reviews)</span>
										)}
										{renderClosingTime()}
									</p>
								</section>
								{selected.reviews?.[0] && (
									<section className="review">
										<p>
											<span className="author">
												{selected.reviews[0].author_name.split(" ")[0]}
											</span>{" "}
											rated{" "}
											<span className="rating">
												{selected.reviews[0].rating}★
											</span>
											{", and wrote "}
											<span className="time">
												{selected.reviews[0].relative_time_description}
											</span>
											:
										</p>
										<div className="review-text-wrapper">
											<p className="review-text">{selected.reviews[0].text}</p>
										</div>
									</section>
								)}
								<section className="link-group">
									<a
										className="ext-link-button"
										href={getMapLink()}
										target="_blank"
										rel="noopener noreferrer"
									>
										<img src="https://upload.wikimedia.org/wikipedia/commons/a/aa/Google_Maps_icon_%282020%29.svg" />
										<p>Open in Maps</p>
									</a>
									<a
										className="ext-link-button"
										href={getYelpLink(selected)}
										target="_blank"
										rel="noopener noreferrer"
									>
										<img src="https://companieslogo.com/img/orig/YELP-d704c977.png?t=1720244494" />
										<p>Open in Yelp</p>
									</a>
								</section>
							</div>
							<section className="button-group">
								<button
									className="primary"
									onClick={selectRandomRestaurant}
									disabled={debounceTimer > 0 || loadingDetails}
								>
									{debounceTimer > 0
										? `Re-roll avaiable in ${debounceTimer}s`
										: "Give me a different place!"}
								</button>
								<button className="secondary" onClick={onRestart}>
									Restart
								</button>
							</section>
						</div>
					)
				)}
			</div>
		</div>
	);
}
