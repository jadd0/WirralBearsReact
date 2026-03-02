import { z } from 'zod';

export const sessionSchema = z.object({
	time: z.string().min(1, 'Time is required'),
	age: z.number().int().positive('Age must be positive'),
	gender: z.string().min(1, 'Gender is required'),
	leadCoach: z.string().min(1, 'Coach is required'),
});

export const validateFullSchedule = (schedule: any) => {
	const errors = [];

	if (!schedule?.sessionDays?.length) {
		throw new Error('At least one session day required');
	}

	for (const [dayIdx, day] of schedule.sessionDays.entries()) {
		if (!day.day) errors.push(`Day ${dayIdx + 1}: Missing weekday`);

		for (const [sessionIdx, session] of day.sessions.entries()) {
			if (!session.time)
				errors.push(`Session ${sessionIdx + 1} (${day.day}): Time required`);
			if (!session.age)
				errors.push(`Session ${sessionIdx + 1} (${day.day}): Age required`);
			if (!session.gender)
				errors.push(`Session ${sessionIdx + 1} (${day.day}): Gender required`);
			if (!session.leadCoach)
				errors.push(`Session ${sessionIdx + 1} (${day.day}): Coach required`);
		}
	}

	if (errors.length > 0) {
		throw new Error(`Validation failed:\n${errors.join('\n')}`);
	}
};
