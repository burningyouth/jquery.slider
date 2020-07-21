interface AdditionalClasses {
  wrapper?: string;
  base?: string;
  handler?: string;
  connector?: string;
}

interface Settings {
  min: number;
  max: number;
  range: boolean;
  startValue: Values;
  align: number;
  additionalClasses: AdditionalClasses;
  step: number;
  roundTo: number;
}

type Values = number[];

interface Elements {
  connector?: JQuery<HTMLElement>;
  parent?: JQuery<HTMLElement>;

  wrapper: JQuery<HTMLElement>;
  base: JQuery<HTMLElement>;
  handlers: Array<JQuery<HTMLElement>>;
  result: JQuery<HTMLElement>;
}

interface MethodsToElements {
  wrapper: Array<Function>;
  base: Array<Function>;
  handler: Array<Function>;
  connector: Array<Function>;
}

export { AdditionalClasses, Settings, Values, Elements, MethodsToElements };
