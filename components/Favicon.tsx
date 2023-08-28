'use client';
import { useEffect, useState } from 'react';
const getFaviconPath = (isDarkMode = false) => {
	return `/${isDarkMode ? 'dark' : 'light'}.svg`;
};

export default function Favicon() {
	const [faviconHref, setFaviconHref] = useState('/light.svg');

	useEffect(() => {
		// Get current color scheme.
		const matcher = window.matchMedia('(prefers-color-scheme: dark)');
		// Set favicon initially.
		setFaviconHref(getFaviconPath(matcher.matches));
		// Change favicon if the color scheme changes.
		matcher.onchange = () => setFaviconHref(getFaviconPath(matcher.matches));
	}, [faviconHref]);
	return <link rel="icon" href={faviconHref} />;
}
