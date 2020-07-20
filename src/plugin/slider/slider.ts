import { Model } from '../modules/model';
import View from '../modules/view';
import Presenter from '../modules/presenter';

jQuery.fn.slider = function(options?: Object): JQuery<HTMLElement> {
  const model = new Model(options);
  const view = new View();
  const presenter = new Presenter(this, model, view);

  presenter.init();

  return view.elements.parent;
};
