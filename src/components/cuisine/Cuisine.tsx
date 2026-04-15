import { CSSProperties, useEffect, useRef } from "react";
import { CuisineType } from "../../App";
import "./Cuisine.scss";
export interface CuisineOption {
	name: string;
	value: string;
	type?: "restaurant" | "cafe";
	image: string;
}

const defaultOptions: CuisineOption[] = [
	{
		name: "African",
		value: "african_restaurant",
		image:
			"https://foodinstitute.com/wp-content/uploads/2024/01/west-african.jpg",
	},
	{
		name: "American",
		value: "american_restaurant",
		image:
			"https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,f_auto,q_60,w_750/v1/classpop/679a768f61781",
	},
	{
		name: "Boba",
		value: "bubble tea",
		type: "cafe",
		image:
			"https://www.spoton.com/blog/content/images/size/w1200/2024/07/1.-what-is-boba-bubble-tea-boba-tea-milk-tea.jpeg",
	},
	{
		name: "Breakfast",
		value: "breakfast_restaurants",
		image:
			"https://www.tastingtable.com/img/gallery/25-breakfast-foods-popular-in-the-us-ranked-worst-to-best/intro-1711974201.jpg",
	},
	{
		name: "Brunch",
		value: "brunch_restaurants",
		image:
			"https://bigflavorstinykitchen.com/wp-content/uploads/2018/07/Brunch-Board-1.jpg",
	},
	{
		name: "Buffet",
		value: "buffet_restaurant",
		image:
			"https://www.liveabout.com/thmb/LdL9qeKjFZelbKQwhoIKzfjr1wE=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/cropped-image-of-hand-taking-food-912173760-5be8229146e0fb00268b3863.jpg",
	},
	{
		name: "Cafes",
		value: "cafe",
		type: "cafe",
		image:
			"https://stepoutbuffalo.com/wp-content/uploads/2022/11/Coffee-Stone-Cafe-Photo-courtesy-of-Coffee-Stone-Cafe5.jpg",
	},
	{
		name: "Chinese",
		value: "chinese_restaurant",
		image:
			"https://townsquare.media/site/704/files/2022/11/attachment-conor-s-articles-88.jpg?w=780&q=75",
	},
	{
		name: "Dessert",
		value: "dessert_restaurant",
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Desserts.jpg/330px-Desserts.jpg",
	},
	{
		name: "Fast Food",
		value: "fast_food_restaurant",
		image:
			"https://www.partstown.com/about-us/wp-content/uploads/2023/11/what-is-considered-fast-food.jpg",
	},
	{
		name: "Filipino",
		value: "filipino",
		image:
			"https://makeyourasia.com/templates/yootheme/cache/09/3-09a03ff0.jpeg",
	},
	{
		name: "French",
		value: "french_restaurant",
		image:
			"https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_30,w_750/f_auto/french-food-phpps9Cr4",
	},
	{
		name: "Greek",
		value: "greek_restaurant",
		image:
			"https://bucketlistjourney.net/wp-content/uploads/2016/06/Gyros-RF-2-2.jpg",
	},
	{
		name: "Indian",
		value: "indian_restaurant",
		image:
			"https://hips.hearstapps.com/hmg-prod/images/chicken-tikka-masala1-1663341991.jpg?crop=0.681xw:1.00xh;0.196xw,0&resize=640:*",
	},
	{
		name: "Indonesian",
		value: "indonesian_restaurant",
		image:
			"https://res.cloudinary.com/rainforest-cruises/images/c_fill,g_auto/f_auto,q_auto/v1622207103/Indonesian-Food-Main/Indonesian-Food-Main.jpg",
	},
	{
		name: "Italian",
		value: "italian_restaurant",
		image:
			"https://www.destinavo.com/wp-content/uploads/2020/01/Italian-Food.jpg",
	},
	{
		name: "Japanese",
		value: "japanese_restaurant",
		image: "https://upload.wikimedia.org/wikipedia/commons/5/57/Oseti.jpg",
	},
	{
		name: "Korean",
		value: "korean_restaurant",
		image:
			"https://images.yummy.ph/yummy/uploads/2022/04/koreanfoodramyunwithtteokbokki.jpg",
	},
	{
		name: "Mexican",
		value: "mexican_restaurant",
		image:
			"https://domesticfits.com/wp-content/uploads/2024/05/mexican-cuisine-more-than-640x427.jpeg",
	},
	{
		name: "Middle Eastern",
		value: "middle_eastern_restaurant",
		image:
			"https://ik.imagekit.io/munchery/blog/tr:w-768/introduction-to-middle-eastern-home-cooking.jpeg",
	},
	{
		name: "Thai",
		value: "thai_restaurant",
		image:
			"https://ik.imagekit.io/munchery/blog/tr:w-768/the-10-most-iconic-thai-dishes-and-how-to-make-them-at-home.jpeg",
	},
	{
		name: "Vietnamese",
		value: "vietnamese_restaurant",
		image:
			"https://res.cloudinary.com/hz3gmuqw6/image/upload/c_fill,q_30,w_750/f_auto/vietnamese-street-food-phpgn0u5d",
	},
];

interface CuisineProps {
	selectedCuisines: CuisineType[];
	onCuisineClicked: ({ keyword, type }: CuisineType) => void;
	maxCuisines: number;
}

export default function Cuisine({
	selectedCuisines,
	onCuisineClicked,
	maxCuisines,
}: CuisineProps) {
	const gridRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const el = gridRef.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries, obs) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						el.classList.add("visible");
						obs.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<>
			<h2 className="section-title">{`Pick 1-${maxCuisines} options.`}</h2>
			<section className="options-container">
				<div className="options-grid" ref={gridRef}>
					{defaultOptions.map((option, i) => {
						const isSelected = selectedCuisines.find(
							(c) => c.keyword === option.value
						);
						return (
							<div
								key={option.value}
								className={`option-card ${isSelected ? "selected" : ""}`}
								// eslint-disable-next-line @typescript-eslint/no-explicit-any
								style={{ ["--i" as any]: i } as CSSProperties}
								onClick={() =>
									onCuisineClicked({
										keyword: option.value,
										type: option.type ?? "restaurant",
									})
								}
							>
								<img
									src={option.image}
									alt={option.name}
									className="option-image"
								/>
								{isSelected && <div className="check-overlay">✔</div>}
								<div className="option-label">
									<span>{option.name}</span>
								</div>
							</div>
						);
					})}
				</div>
			</section>
		</>
	);
}
