export type WeekDay =
	| 'Monday'
	| 'Tuesday'
	| 'Wednesday'
	| 'Thursday'
	| 'Friday'
	| 'Saturday'
	| 'Sunday';

export type Time = string;
type GENDER_ENUM = ['Male', 'Female', 'Mixed'];

type TwoDigit = `${0 | 1}${number}` | `2${0 | 1 | 2 | 3}` | `0${number}`;
type Hour = `0${number}` | `1${number}` | `2${0 | 1 | 2 | 3}`;
type Minute =
	| `0${number}`
	| `1${number}`
	| `2${number}`
	| `3${number}`
	| `4${number}`
	| `5${number}`;

type TimeString = `${Hour}:${Minute}`;

export type Session = {
	id?: string;
	day: WeekDay;
	time: TimeString;
	leadCoach: string;
	age: number;
	gender: GENDER_ENUM;
} & {
	coach?: string; 
	createdAt?: Date;
	updatedAt?: Date;
};

export type SessionDay = Session[];
export type SessionDayWithSessions = SessionDay & {
  sessions: Session[];
};