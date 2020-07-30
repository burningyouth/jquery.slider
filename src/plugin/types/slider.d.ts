import BasicElementView from '../modules/subViews/basicElementView';
import BoundView from '../modules/subViews/boundView';
import HandlerView from '../modules/subViews/handlerView';
import ConnectorView from '../modules/subViews/connectorView';
import ProgressBarView from '../modules/subViews/progressBarView';
import ResultView from '../modules/subViews/resultView';
import TooltipView from '../modules/subViews/tooltipView';
import InputView from '../modules/subViews/inputView';
import BaseView from '../modules/subViews/baseView';

interface AdditionalClasses {
  parent?: string;
  wrapper?: string;
  input?: string;
  bounds?: string;
  base?: string;
  baseWrapper?: string;
  handlers?: string;
  tooltips?: string;
  progressBar?: string;
  connectors?: string;
  result?: string;
}

interface HandlersStateClasses {
  active?: string;
  focus?: string;
}

interface Settings {
  min?: number;
  max?: number;
  range?: boolean;
  step?: number;
  progressBar?: boolean;
  startValues?: Values;
  handlersColors?: Array<string>;
  connectorsColors?: Array<string>;
  showResult?: boolean;
  showTooltip?: boolean;
  showBounds?: boolean;
  sortValues?: boolean;
  sortOnlyPares?: boolean;
  sortReverse?: boolean;
  clickableBase?: boolean;
  reverse?: boolean;
  tooltipReverse?: boolean;
  vertical?: boolean;
  roundTo?: number;
  resultTemplate?: string;
  additionalClasses?: AdditionalClasses;
  handlersStateClasses?: HandlersStateClasses;
}

type Values = number[];

interface Elements {
  parent?: BasicElementView;
  input?: InputView;
  wrapper?: BasicElementView;
  base?: BaseView;
  baseWrapper?: BasicElementView;
  handlers?: Array<HandlerView>;
  bounds?: Array<BoundView>;
  tooltips?: Array<TooltipView>;
  progressBar?: ProgressBarView;
  connectors?: Array<ConnectorView>;
  result?: ResultView;
}
export { AdditionalClasses, HandlersStateClasses, Settings, Values, Elements };
