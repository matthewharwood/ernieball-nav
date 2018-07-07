import { ClassNames, DataAttrs, EventTypes } from './enums';

const LinkSelectors = {
  ACTION: document.querySelector(`[${DataAttrs.SEARCH_ACTION}]`) as HTMLElement,
  INPUT: document.querySelector(`[${DataAttrs.SEARCH_INPUT}]`) as HTMLElement,
  OUTLET: document.querySelector(`[${DataAttrs.SEARCH_OUTLET}]`) as HTMLElement,
  TRIGGER: document.querySelector(
    `[${DataAttrs.SEARCH_TRIGGER}]`
  ) as HTMLElement,
};
export class SearchBar {
  public static run() {
    LinkSelectors.TRIGGER.addEventListener(EventTypes.CLICK, e => {
      LinkSelectors.OUTLET.classList.toggle(ClassNames.ACTIVE);
      LinkSelectors.INPUT.focus();
      LinkSelectors.TRIGGER.classList.toggle(ClassNames.ACTIVE);
    });
  }
}
