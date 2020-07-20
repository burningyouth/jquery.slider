import { Model } from './model';
import View from './view';
import { Settings } from '../types/slider';

class Presenter {
  model: Model;
  view: View;
  constructor(target: JQuery<HTMLElement>, model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.view.elements.parent = target.parent();
    target.remove();
    target.prependTo(this.view.elements.wrapper);
    this.view.elements.wrapper.prependTo(view.elements.parent);
    this.view.addClasses(this.model.settings.additionalClasses);
  }

  public init(): void {
    this.view.settings = this.model.settings;
    this.view.initHandlers(this.handlersCallback);
  }

  public handlersCallback(handler: JQuery<HTMLElement>): void {
    let view: any = this;

    $(handler).on('mousedown', function(e) {
      e.preventDefault();
      if (e.which == 1) {
        $(window).on('mousemove', function(e2) {
          view.changeHandlerPosition($(e.target), e2.clientX).changeConnectorPosition(e2.clientX);
        });
        $(window).on('mouseup', function(e2) {
          if (e2.which == 1) {
            $(this).off('mousemove mouseup');
          }
        });
      }
    });

    $(handler).on('touchstart', function(e) {
      e.preventDefault();
      $(window).on('touchmove', function(e2) {
        view
          .changeHandlerPosition($(e.target), e2.touches[0].clientX)
          .changeConnectorPosition(e2.touches[0].clientX);
      });
      $(window).on('touched', function() {
        $(this).off('touchmove touched');
      });
    });
  }
}

export default Presenter;
