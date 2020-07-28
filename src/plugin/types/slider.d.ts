import BasicElementView from '../modules/subViews/basicElementView';
import BoundView from '../modules/subViews/boundView';
import HandlerView from '../modules/subViews/handlerView';
import ConnectorView from '../modules/subViews/connectorView';
import ProgressBarView from '../modules/subViews/progressBarView';
import ResultView from '../modules/subViews/resultView';
import TooltipView from '../modules/subViews/tooltipView';
import InputView from '../modules/subViews/inputView';

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
  progressBar: boolean;
  startValues: Values;
  handlersColors: Array<string>;
  connectorsColors: Array<string>;
  showResult: boolean;
  showTooltip: boolean;
  showBounds: boolean;
  additionalClasses: AdditionalClasses;
  step: number;
  sortValues: boolean;
  sortOnlyPares: boolean;
  sortReverse: boolean;
  reverse: boolean;
  tooltipReverse: boolean;
  vertical: boolean;
  roundTo: number;
  resultTemplate: string;
}

type Values = number[];

interface Elements {
  parent?: BasicElementView;
  input?: InputView;
  wrapper?: BasicElementView;
  base?: BasicElementView;
  baseWrapper?: BasicElementView;
  handlers?: Array<HandlerView>;
  bounds?: Array<BoundView>;
  tooltips?: Array<TooltipView>;
  progressBar?: ProgressBarView;
  connectors?: Array<ConnectorView>;
  result?: ResultView;
}
export { AdditionalClasses, Settings, Values, Elements };
