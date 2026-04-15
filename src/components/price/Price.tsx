import "./Price.scss";
import { Range, getTrackBackground } from "react-range";

interface PriceProps {
	price: number[];
	setPrice: React.Dispatch<React.SetStateAction<number[]>>;
}

export default function Price({ price, setPrice }: PriceProps) {
	const STEP = 1;
	const MIN = 1;
	const MAX = 4;
	const priceLabels = [
		"Free", // Realistically this never happens, but it's here for completeness
		"Inexpensive",
		"Moderate",
		"Expensive",
		"Very Expensive",
	];

	return (
		<section className="sliders-section-container">
			<h2 className="title">How pricey?</h2>
			<div className="body range-body">
				<div className="range-label">
					<span>{priceLabels[price[0]]}</span>
					<span>&mdash;</span>
					<span>{priceLabels[price[1]]}</span>
				</div>
				<Range
					step={STEP}
					min={MIN}
					max={MAX}
					values={price}
					onChange={(vals) => setPrice(vals)}
					renderTrack={({ props, children }) => {
						return (
							<div
								className="render-track"
								{...props}
								style={{
									background: getTrackBackground({
										values: price,
										// * This needs to be updated manually whenever CSS colors change
										colors: ["#c0c0c0", "#00bcd4", "#c0c0c0"],
										min: MIN,
										max: MAX,
									}),
								}}
							>
								{children}
							</div>
						);
					}}
					renderThumb={({ props }) => {
						const { key, ...restProps } = props;
						return <div className="render-thumb" {...restProps} key={key} />;
					}}
				/>
			</div>
		</section>
	);
}
