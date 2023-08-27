'use client';
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

	function onSubmit(values: z.infer<typeof formSchema>) {
		const { time, distance, pace, unit, minUnit } = values;

		const distanceMeasure = unit === 'km' ? 1 : 1.60934;

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
		<main className="flex gap-4 justify-center flex-col items-center">
			<div className="bg-black bg-opacity-75 mt-8 md:mt-10 p-10 rounded-md">
				<Form {...form}>
					<div>
						<CardHeader>
							<CardTitle className="text-3xl font-extrabold italic  w-full">
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
								</FormItem>
							)}
						/>
						<div className="flex w-full gap-2 items-end justify-between">
							<FormField
								control={form.control}
								name="distance"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Distance</FormLabel>
										<FormControl>
											<Input placeholder="0" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
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
													<SelectValue {...field} placeholder="Unit" />
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
						<div className="flex w-full gap-2 items-end justify-between">
							<FormField
								control={form.control}
								name="pace"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Pace</FormLabel>
										<FormControl>
											<Input placeholder="00:00" {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
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

						<div className="flex gap-2">
							<Button className="w-full" variant="secondary" type="submit">
								Submit
							</Button>
							<Button
								type="button"
								onClick={() => {
									form.reset();
									setError('');
								}}
							>
								Clear
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
