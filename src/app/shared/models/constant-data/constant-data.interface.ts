export type Country = {
  name: string;
  countryCallingCodes: string[];
  nameAbbreviations: string[];
  states: State[];
};

export type State = {
  name: string;
  nameAbbreviation: string;
  cities: City[];
};

export type City = {
  name: string;
  latitude: number;
  longitude: number;
  zipCodes: string[];
};
