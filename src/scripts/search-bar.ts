import { ClassNames, DataAttrs, EventTypes } from './enums';

const LinkSelectors = {
  ACTION: document.querySelector(`[${DataAttrs.SEARCH_ACTION}]`) as HTMLElement,
  INPUT: document.querySelector(`[${DataAttrs.SEARCH_INPUT}]`) as HTMLElement,
  INPUT_M: document.querySelector(`[${DataAttrs.SEARCH_INPUT_M}]`) as HTMLElement,

  OUTLET: document.querySelector(`[${DataAttrs.SEARCH_OUTLET}]`) as HTMLElement,
  OUTLET_M: document.querySelector(`[${DataAttrs.SEARCH_OUTLET_MOBILE}`) as HTMLElement,
  TRIGGER: document.querySelector(
    `[${DataAttrs.SEARCH_TRIGGER}]`
  ) as HTMLElement,
};
const DEBOUNCE_TIMER = 250;
const Breakpoint = {
  SM: 1024,
}
export class SearchBar {
  public static run() {
    let resizeTimer;
    const goingFromSmallToLarge = () => window.innerWidth >= Breakpoint.SM;

    LinkSelectors.TRIGGER.addEventListener(EventTypes.CLICK, e => {

      if(goingFromSmallToLarge()) {
        LinkSelectors.OUTLET.classList.toggle(ClassNames.ACTIVE);
        LinkSelectors.INPUT.focus();
      } else {
        LinkSelectors.OUTLET_M.classList.toggle(ClassNames.ACTIVE);
        console.log(LinkSelectors.INPUT_M);
        LinkSelectors.INPUT_M.focus();
      }

      LinkSelectors.TRIGGER.classList.toggle(ClassNames.ACTIVE);
    });

    (window as any).addEventListener(EventTypes.RESIZE, () => {


      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {

        if(goingFromSmallToLarge()) {
          if (LinkSelectors.OUTLET_M.classList.contains(ClassNames.ACTIVE)) {
            LinkSelectors.OUTLET_M.classList.remove(ClassNames.ACTIVE);
            LinkSelectors.OUTLET.classList.add(ClassNames.ACTIVE);
          }
        } else {
          if (LinkSelectors.OUTLET.classList.contains(ClassNames.ACTIVE)) {
            LinkSelectors.OUTLET.classList.remove(ClassNames.ACTIVE);
            LinkSelectors.OUTLET_M.classList.add(ClassNames.ACTIVE);
          }
        }

      }, DEBOUNCE_TIMER);

    });
  }
}
