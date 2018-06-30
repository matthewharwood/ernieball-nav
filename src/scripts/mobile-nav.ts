import { ClassNames, DataAttrs, EventTypes } from "./enums";

const LinksSelectors = {
  PRIMARY: "site-navigation__link"
};

export class MobileNav {
  public static run() {
    const mobileNavTriggerOpen = document.querySelector(`[${DataAttrs.MOBILE_TRIGGER_OPEN}]`);
    const mobileNavTriggerClose = document.querySelectorAll(`[${DataAttrs.MOBILE_TRIGGER_CLOSE}]`);
    const mobileNavRoot = document.querySelector(`[${DataAttrs.MOBILE_ROOT}]`);

    const openMobileHandler = () => {
      mobileNavRoot.classList.add(ClassNames.ACTIVE);
      Array.from(mobileNavTriggerClose).forEach(t => t.classList.add(ClassNames.ACTIVE));
    };

    const closeMobileHandler = () => {
      mobileNavRoot.classList.remove(ClassNames.ACTIVE);
      Array.from(mobileNavTriggerClose).forEach(t => t.classList.remove(ClassNames.ACTIVE));
    };

    mobileNavTriggerOpen.addEventListener(EventTypes.CLICK, openMobileHandler);
    Array.from(mobileNavTriggerClose).forEach(t => t.addEventListener(EventTypes.CLICK, closeMobileHandler));


    const primaryLinks = document.querySelectorAll(`.${LinksSelectors.PRIMARY}`);
    console.log(primaryLinks);
  }
}