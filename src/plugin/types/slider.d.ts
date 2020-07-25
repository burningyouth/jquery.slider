interface AdditionalClasses {
  wrapper?: string;
  base?: string;
  handlers?: string;
  connectors?: string;
  result?: string;
}

interface Settings {
  min: number;
  max: number;
  range: boolean;
  startValues: Values;
  align: number;
  tooltipReverse: boolean;
  showResult: boolean;
  showTooltip: boolean;
  showBounds: boolean;
  additionalClasses: AdditionalClasses;
  step: number;
  sortValues: boolean;
  sortOnlyPares: boolean;
  roundTo: number;
  resultTemplate: string;
}

type Values = number[];

interface Elements {
  parent?: JQuery<HTMLElement>;

  wrapper: JQuery<HTMLElement>;
  base: JQuery<HTMLElement>;
  baseWrapper: JQuery<HTMLElement>;
  handlers: Array<JQuery<HTMLElement>>;
  bounds: Array<JQuery<HTMLElement>>;
  tooltips: Array<JQuery<HTMLElement>>;
  connectors: Array<JQuery<HTMLElement>>;
  result: JQuery<HTMLElement>;
}

export { AdditionalClasses, Settings, Values, Elements };
