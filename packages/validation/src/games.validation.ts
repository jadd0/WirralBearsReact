import { z } from 'zod';

export const gameValidationSchema = z.object({
	date: z.date({
		required_error: 'Date is required',
		invalid_type_error: 'Invalid date format',
	}),
	gender: z.enum(['Male', 'Female', 'Mixed'], {
		required_error: 'Gender is required',
		invalid_type_error: 'Gender must be Male, Female, or Mixed',
	}),
	season: z.string().min(1, 'Season is required'),
	ourScore: z
		.string()
		.min(1, 'Our score is required')
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
			message: 'Our score must be a valid non-negative number',
		}),
	otherScore: z
		.string()
		.min(1, 'Other score is required')
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
			message: 'Other score must be a valid non-negative number',
		}),
	blog: z.string().nullable().optional(),
});

export const gamesArrayValidationSchema = z
	.array(gameValidationSchema)
	.min(1, 'At least one game is required');

export type GameValidation = z.infer<typeof gameValidationSchema>;
