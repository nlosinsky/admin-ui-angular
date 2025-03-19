export interface ProductsOfInterest {
  id: string;
  name: string;
  description: string;
  isSelected?: boolean;
}

export interface Country {
  name: string;
  countryCallingCodes: string[];
  nameAbbreviations: string[];
  states: State[];
}

export interface State {
  name: string;
  nameAbbreviation: string;
  cities: City[];
}

export interface City {
  name: string;
  latitude: number;
  longitude: number;
  zipCodes: string[];
}
