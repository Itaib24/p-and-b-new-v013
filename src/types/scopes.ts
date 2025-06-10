export interface BodyScope {
  date: string;
  waist: number;
  legs: number;
  frontArmRight: number;
  frontArmLeft: number;
  backArmRight: number;
  backArmLeft: number;
  shoulders: number;
  chest: number;
}

export interface UserScopes {
  userId: string;
  measurements: BodyScope[];
}