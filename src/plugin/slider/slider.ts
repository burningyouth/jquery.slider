import { Model } from '../modules/model';
import View from '../modules/view';
import Presenter from '../modules/presenter';

jQuery.fn.slider = function(options?: Object): Presenter {
  const model = new Model(options);
  const view = new View(this);
  const presenter = new Presenter(model, view);

  view.init();
  return presenter;
};
