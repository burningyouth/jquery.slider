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
  startValue: Array<number>;
  align: number;
  additionalClasses: AdditionalClasses;
}

interface Elements {
  parent?: JQuery<HTMLElement>;
  wrapper: JQuery<HTMLElement>;
  base: JQuery<HTMLElement>;
  handlers: Array<JQuery<HTMLElement>>;
  connector: JQuery<HTMLElement>;
}

interface MethodsToElements {
  wrapper: Array<Function>;
  base: Array<Function>;
  handler: Array<Function>;
  connector: Array<Function>;
}

export { AdditionalClasses, Settings, Elements, MethodsToElements };
