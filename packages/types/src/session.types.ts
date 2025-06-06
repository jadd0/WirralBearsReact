export type WeekDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday"

export type Time = string;

type TwoDigit = `${0 | 1}${number}` | `2${0 | 1 | 2 | 3}` | `0${number}`;
type Hour = `0${number}` | `1${number}` | `2${0 | 1 | 2 | 3}`;
type Minute = `0${number}` | `1${number}` | `2${number}` | `3${number}` | `4${number}` | `5${number}`;

type TimeString = `${Hour}:${Minute}`;


export type Session = {
  id: string;
  day: WeekDay;
  time: TimeString;
  leadCoach: string; // FK for coach id
  age: number;
}

export type SessionDay = Session[]