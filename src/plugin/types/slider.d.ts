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
  startValues: Values;
  align: number;
  additionalClasses: AdditionalClasses;
  step: number;
  sortValues: boolean;
  sortOnlyPares: boolean;
  roundTo: number;
  template: string;
}

type Values = number[];

interface Elements {
  parent?: JQuery<HTMLElement>;

  wrapper: JQuery<HTMLElement>;
  base: JQuery<HTMLElement>;
  handlers: Array<JQuery<HTMLElement>>;
  connectors: Array<JQuery<HTMLElement>>;
  result: JQuery<HTMLElement>;
}

interface MethodsToElements {
  wrapper: Array<Function>;
  base: Array<Function>;
  handler: Array<Function>;
  connector: Array<Function>;
}

export { AdditionalClasses, Settings, Values, Elements, MethodsToElements };
