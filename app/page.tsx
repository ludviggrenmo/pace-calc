'use client';
import Logo from '@/components/ui/Logo';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

import { useForm } from 'react-hook-form';

import * as z from 'zod';

const formSchema = z.object({
	time: z.string(),
	distance: z.string(),
	pace: z.string(),
	unit: z.string(),
	minUnit: z.string(),
});

export default function Home() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			unit: 'km',
			minUnit: 'min/km',
			time: '',
			pace: '',
			distance: '',
		},
	});

	const [error, setError] = useState('');

	const [paceError, setPaceError] = useState('');
	const [timeError, setTimeError] = useState('');
	const [distanceError, setDIstanceError] = useState('');

	const [disabled, setDisabled] = useState(false);

	function onSubmit(values: z.infer<typeof formSchema>) {
		const { time, distance, pace, unit, minUnit } = values;

		const distanceMeasure = unit === 'km' ? 1 : 1.60934;
		//const distancePerMilMeasure = minUnit === 'min/km' ? 1 : 1.60934;

		if (time && distance && pace) {
			setError('The values does not add upp. Try leaving one field empty');
			return;
		}

		if (time && distance) {
			const finalPace = calculatePace(time, Number(distance) * distanceMeasure);
			form.setValue('pace', finalPace);
			setError('');
		}

		if (time && pace) {
			const finalDistance = calculateDistance(time, pace);
			form.setValue('distance', finalDistance);
			setError('');
		}

		if (pace && distance) {
			const finalTimes = convertPaceAndDistanceToTime(
				pace,
				Number(distance) * distanceMeasure
			);
			if (!finalTimes) return null;
			setError('');

			form.setValue('time', finalTimes);
		}
	}

	return (
		<main className="text-md bg-black flex gap-4  md:min-h-fit font-sans flex-col ">
			<header className="border-b border-gray-800 py-1 px-4">
				<ul className="flex text-gray-100 justify-between items-center">
					<li className="flex h-10 justify-center items-center">
						<Logo />
					</li>
					<li className="flex h-10 justify-center items-center">
						<span className="uppercase text-[10px] text-gray-600">
							whats my pace
						</span>
					</li>
				</ul>
			</header>

			<div className="text-gray-100 bg-opacity-75 mt-0 md:mt-20 p-10 items-center flex mx-auto flex-col rounded-md">
				<Form {...form}>
					<div>
						<CardHeader>
							<CardTitle className="text-5xl underline font-extrabold font-mono italic w-full">
								PACE CALCULATOR
							</CardTitle>
							<CardDescription>
								Fill in 2 fields to generate your data
							</CardDescription>
						</CardHeader>

						<Separator />
					</div>
					<form
						onSubmit={form.handleSubmit(onSubmit)}
						className="flex flex-col gap-4 mt-4"
					>
						<FormField
							control={form.control}
							name="time"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Time</FormLabel>
									<FormControl>
										<Input placeholder="00:00:00" {...field} />
									</FormControl>
									{timeError && <span>{timeError}</span>}
								</FormItem>
							)}
						/>
						<div className="flex items-end gap-2 justify-between">
							<div className="w-full">
								<FormField
									control={form.control}
									name="distance"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Distance</FormLabel>
											<FormControl>
												<Input
													className="w-full flex-shrink-0"
													placeholder="0"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
							<div>
								<FormField
									control={form.control}
									name="unit"
									render={({ field }) => (
										<FormItem>
											<FormControl>
												<Select
													onValueChange={field.onChange}
													defaultValue={field.value}
												>
													<SelectTrigger>
														<SelectValue
															className="w-fit"
															{...field}
															placeholder="Unit"
														/>
													</SelectTrigger>
													<SelectContent>
														<SelectItem value={'km'}>km</SelectItem>
														<SelectItem value={'mi'}>mi</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>
						</div>
						<div className="flex w-full gap-2 items-end justify-between">
							<div className="w-full">
								<FormField
									control={form.control}
									name="pace"
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>Pace</FormLabel>
												<FormControl>
													<Input
														placeholder="00:00"
														{...field}
														onChange={(e) => {
															form.setValue('pace', e.target.value);
															if (e.target.value.length > 2) {
																let value = e.target.value.replace(
																	/[^a-zA-Z0-9]/g,
																	''
																);

																const chunks = [];
																for (let i = 0; i < value.length; i += 2) {
																	chunks.push(value.slice(i, i + 2));
																}

																// Join the chunks with colons and return the result

																form.setValue('pace', chunks.join(':'));
															} else form.setValue('pace', e.target.value);
														}}
													/>
												</FormControl>
											</FormItem>
										);
									}}
								/>
							</div>
							<FormField
								control={form.control}
								name="minUnit"
								render={({ field }) => (
									<FormItem>
										<FormControl>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<SelectTrigger>
													<SelectValue placeholder="Min/?" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value={'min/km'}>min/km</SelectItem>
													<SelectItem value={'min/mi'}>min/mi</SelectItem>
												</SelectContent>
											</Select>
										</FormControl>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex mt-2 gap-2">
							<Button
								disabled={disabled}
								className="w-full"
								variant="secondary"
								type="submit"
							>
								SUBMIT
							</Button>
							<Button
								className="border bg-inherit"
								type="button"
								onClick={() => {
									form.reset();
									setError('');
								}}
							>
								CLEAR
							</Button>
						</div>
					</form>
					<CardFooter className="flex justify-between"></CardFooter>
				</Form>
			</div>
			{error && <div className="text-gray-500">{error}</div>}
		</main>
	);

	function convertPaceAndDistanceToTime(
		pace: string,
		distance: number
	): string {
		const [paceMinutes, paceSeconds] = pace.split(':').map(Number);

		const paceInSeconds = paceMinutes * 60 + paceSeconds;
		const totalTimeInSeconds = paceInSeconds * distance;

		const hours = Math.floor(totalTimeInSeconds / 3600);
		const minutes = Math.floor((totalTimeInSeconds % 3600) / 60);
		const seconds = totalTimeInSeconds % 60;

		const formattedTime = `${String(hours).padStart(2, '0')}:${String(
			minutes
		).padStart(2, '0')}:${String(seconds.toFixed(0)).padStart(2, '0')}`;

		return formattedTime;
	}

	function calculateDistance(time: string, pace: string): string {
		const [timeHours, timeMinutes, timeSeconds] = time.split(':').map(Number);
		const [paceMinutes, paceSeconds] = pace.split(':').map(Number);

		const totalTimeInSeconds =
			timeHours * 3600 + timeMinutes * 60 + timeSeconds;
		const paceInSeconds = paceMinutes * 60 + paceSeconds;

		const distanceInKm = totalTimeInSeconds / paceInSeconds;
		const formattedDistance = distanceInKm.toFixed(2);
		return parseFloat(formattedDistance).toString();
	}

	function calculatePace(time: string, distance: number): string {
		const [timeHours, timeMinutes, timeSeconds] = time.split(':').map(Number);

		const totalTimeInSeconds =
			timeHours * 3600 + timeMinutes * 60 + timeSeconds;
		const paceInSeconds = totalTimeInSeconds / distance;

		const paceMinutes = Math.floor(paceInSeconds / 60);
		const paceSeconds = Math.round(paceInSeconds % 60);

		const formattedPace = `${String(paceMinutes).padStart(2, '0')}:${String(
			paceSeconds
		).padStart(2, '0')}`;

		return formattedPace;
	}
}
