import { z } from "zod";

export const gameValidationSchema = z.object({
  date: z.date({
    error: (issue) => {
      // undefined / missing
      if (issue.input === undefined || issue.input === null) {
        return "Date is required";
      }
      return "Invalid date format";
    },
  }),

  gender: z.enum(["Male", "Female", "Mixed"] as const, {
    error: (issue) => {
      if (issue.input === undefined || issue.input === null) {
        return "Gender is required";
      }
      return "Gender must be Male, Female, or Mixed";
    },
  }),

  season: z
    .string({
      error: () => "Season is required",
    })
    .min(1, "Season is required"),

  ageGroup: z
    .string({
      error: () => "Age Group is required",
    })
    .min(1, "Age Group is required"),

  ourScore: z
    .string({
      error: () => "Our score is required",
    })
    .min(1, "Our score is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Our score must be a valid non-negative number",
    }),

  otherScore: z
    .string({
      error: () => "Other score is required",
    })
    .min(1, "Other score is required")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Other score must be a valid non-negative number",
    }),

  blog: z.string().nullable().optional(),

  otherTeamName: z.string().nullable(),
});

export const gamesArrayValidationSchema = z
  .array(gameValidationSchema, {
    error: (issue) => {
      if (!Array.isArray(issue.input)) {
        return "Invalid games array";
      }
      return "At least one game is required";
    },
  })
  .min(1, "At least one game is required");

export type GameValidation = z.infer<typeof gameValidationSchema>;
export type GamesArrayValidation = z.infer<typeof gamesArrayValidationSchema>;