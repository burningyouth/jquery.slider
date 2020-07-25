import { Model } from '../modules/model';
import View from '../modules/view';
import Presenter from '../modules/presenter';

jQuery.fn.slider = function(options?: Object): Model {
  const model = new Model(options);
  const view = new View();
  const presenter = new Presenter(this, model, view);

  presenter.init();

  return model;
};
