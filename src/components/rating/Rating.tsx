import CustomSlider from "../custom-slider/CustomSlider";

interface RatingProps {
	rating: number;
	setRating: React.Dispatch<React.SetStateAction<number>>;
}

export default function Rating({ rating, setRating }: RatingProps) {
	return (
		<section className="sliders-section-container">
			<h2 className="title">How desperate?</h2>
			<div className="body">
				<div>
					Min rating: {rating} {rating === 1 ? "star" : "stars"}
				</div>
				<CustomSlider
					min={1}
					max={5}
					step={1}
					value={rating}
					onChange={setRating}
				/>
				{/* <div>{"★".repeat(rating) + "☆".repeat(maxRating - rating)}</div> */}
			</div>
		</section>
	);
}
