import "./Instructions.scss";
import { CSSProperties, useEffect, useRef } from "react";

const steps = [
	"Step 0: Have no ideas for where to eat",
	"Step 1: Select cuisines",
	"Step 2: Get location",
	"Step 3: Get max distance",
	"Step 4: Get price range",
	"Step 5: Get minimum rating",
	"Step 6: Go to your restaurant",
];

export default function Instructions() {
	const listRef = useRef<HTMLOListElement>(null);

	useEffect(() => {
		const el = listRef.current;
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
	});

	return (
		<ol className="instructions" ref={listRef}>
			{steps.map((step, i) => (
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				<li key={i} style={{ ["--i" as any]: i } as CSSProperties}>
					<p>{step}</p>
				</li>
			))}
		</ol>
	);
}
