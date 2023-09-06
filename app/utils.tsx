import { MinUnitEnum } from './page';

export function setPaces(measure: MinUnitEnum, pace: string) {
	if (!measure || !pace) {
		return;
	}

	console.log(pace);

	switch (measure) {
		case MinUnitEnum.MinPerKm:
			return pace;
		case MinUnitEnum.MinPerMi:
			console.log('min/mi');
			return '';
		case MinUnitEnum.KmPerH:
			console.log('km/h');
			return '';
		case MinUnitEnum.MiPerH:
			console.log('mi/h');
			return '';
	}

	return pace;
}
