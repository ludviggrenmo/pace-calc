import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Pace Calculator',
	description:
		'Elevate your running routine with our cutting-edge website, your ultimate destination for generating precise running paces, calculating distances, and planning efficient workout times. Unlock your full potential through accurate insights and optimize your fitness journey with ease.nerated by create next app',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html className="bg-black" lang="en">
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=1"
			/>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
