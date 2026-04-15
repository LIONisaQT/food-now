import CustomSlider from "../custom-slider/CustomSlider";

interface DistanceProps {
	distance: number;
	setDistance: React.Dispatch<React.SetStateAction<number>>;
}

export default function Distance({ distance, setDistance }: DistanceProps) {
	return (
		<section className="sliders-section-container">
			<h2 className="title">How far?</h2>
			<div className="body">
				<div>
					Max distance: {distance / 1000} km (
					{(distance * 0.000621371).toFixed(2)}mi)
				</div>
				<CustomSlider
					min={1000}
					max={40000}
					step={1000}
					value={distance}
					onChange={setDistance}
				/>
			</div>
		</section>
	);
}
