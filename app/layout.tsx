import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const helvetica = localFont({
	src: '../public/fonts/HelveticaNeueCondensedBold.ttf',
	display: 'swap',
	variable: '--font-helvetica',
});

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
		<html
			className={`${helvetica.variable} ${inter.variable} bg-black`}
			lang="en"
		>
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=1"
			/>
			<body>{children}</body>
		</html>
	);
}
