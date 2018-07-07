import { ClassNames, DataAttrs, EventTypes } from "./enums";

const LinkSelectors = {
  CLOSE: document.querySelector(`[${DataAttrs.CART_CLOSE}]`) as HTMLElement,
  CLOSE_INNER: document.querySelector(`[${DataAttrs.CART_CLOSE_INNER}]`) as HTMLElement,
  OUTLET: document.querySelector(`[${DataAttrs.CART_OUTLET}]`) as HTMLElement,
  TRIGGER: document.querySelector(`[${DataAttrs.CART_TRIGGER}]`) as HTMLElement,
};
export class Cart {
  public static run() {
    LinkSelectors.TRIGGER.addEventListener(EventTypes.CLICK, () => {
      LinkSelectors.CLOSE.classList.toggle(ClassNames.ACTIVE);
      LinkSelectors.OUTLET.classList.toggle(ClassNames.ACTIVE);
    });
    LinkSelectors.CLOSE.addEventListener(EventTypes.CLICK, ()=> {
      LinkSelectors.CLOSE.classList.remove(ClassNames.ACTIVE);
      LinkSelectors.OUTLET.classList.remove(ClassNames.ACTIVE);
    });

    LinkSelectors.CLOSE_INNER.addEventListener(EventTypes.CLICK, () => {
      LinkSelectors.CLOSE.classList.remove(ClassNames.ACTIVE);
      LinkSelectors.OUTLET.classList.remove(ClassNames.ACTIVE);
    })
  }
}