import { Model } from './model';
import View from './view';

class Presenter {
  constructor(target: JQuery<HTMLElement>, model: Model, view: View) {
    view.elements.parent = target.parent();
    target.remove();
    target.prependTo(view.elements.wrapper);
    view.elements.wrapper.prependTo(view.elements.parent);
    view.addClasses(model.settings.additionalClasses);
  }
}

export default Presenter;
