export interface SkiResort {
  name: string;
  region: string;
  state: string;
  fullDayTicket: string;
  halfDayTicket: string;
  green: string;
  blue: string;
  doubleBlue: string;
  black: string;
  doubleBlack: string;
  terrainPark: string;
  latitude: number;
  longitude: number;
  backcountry: boolean | null;
  snowmobile: boolean | null;
  snowTubing: boolean | null;
  iceSkating: boolean | null;
  nightSkiing: boolean | null;
}