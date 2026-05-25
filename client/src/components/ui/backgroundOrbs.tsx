/* eslint-disable react-hooks/purity */
import { useMemo } from "react";
type Orb = {
	id: number;
	left: number;
	size: number;
	duration: number;
	delay: number;
	drift: number;
	opacity: number;
	blur: number;
};

export const BackgroundOrbs = () => {
	const orbs = useMemo<Orb[]>(
		() =>
			Array.from({ length: 24 }, (_, id) => ({
				id,
				left: Math.random() * 100,
				size: 24 + Math.random() * 110,
				duration: 7 + Math.random() * 12,
				delay: Math.random() * 18,
				drift: -70 + Math.random() * 140,
				opacity: 0.12 + Math.random() * 0.28,
				blur: Math.random() * 2.5,
			})),
		[],
	);
	return (
		<div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
			{orbs.map((orb) => (
				<span
					key={orb.id}
					className="login-particle"
					style={
						{
							left: `${orb.left}%`,
							width: `${orb.size}px`,
							height: `${orb.size}px`,
							animationDuration: `${orb.duration}s`,
							animationDelay: `-${orb.delay}s`,
							filter: `blur(${orb.blur}px)`,
							["--orb-drift" as string]: `${orb.drift}px`,
							["--orb-opacity" as string]: orb.opacity.toString(),
						} as React.CSSProperties
					}
				/>
			))}
		</div>
	);
};
