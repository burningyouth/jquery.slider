import Model from '../modules/model';
import View from '../modules/view';
import Presenter from '../modules/presenter';
import { Settings } from '../types/slider';

jQuery.fn.slider = function(options?: Settings): Presenter {
  const model = new Model(options);
  const view = new View(this);
  const presenter = new Presenter(model, view);

  view.init();
  return presenter;
};
