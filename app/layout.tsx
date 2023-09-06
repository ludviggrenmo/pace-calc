import Favicon from '@/components/Favicon';
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import localFont from 'next/font/local';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const helvetica = localFont({
	src: '../public/fonts/HelveticaNeueCondensedBold.ttf',
	display: 'swap',
	variable: '--font-helvetica',
});

export const metadata: Metadata = {
	title: 'WHATS MY PACE',
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
			className={`${helvetica.variable} ${inter.variable} bg-black `}
			lang="en"
		>
			<script
				async
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8367159843468497"
				crossOrigin="anonymous"
			></script>
			<Favicon />
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1, maximum-scale=1"
			/>
			<body className="min-h-screen flex justify-between flex-col">
				<header className="border-b border-gray-800 py-1 px-4">
					<ul className="flex text-gray-100 justify-between items-center">
						<li className="flex h-10 justify-center items-center">
							<Link href={'/'}>
								<span className="sr-only">link to home</span>
								<Logo />
							</Link>
						</li>
						<li className="flex h-10 justify-center items-center">
							<span className="uppercase text-[10px] text-gray-600">
								whatsmypace.run
							</span>
						</li>
					</ul>
				</header>
				{children}
				<Analytics />
				<footer className="text-gray-100 flex items-center h-10 border uppercase text-xs border-gray-800 py-1 px-4">
					<Link href={'/policy'}>Privacy policy</Link>
				</footer>
			</body>
		</html>
	);
}
