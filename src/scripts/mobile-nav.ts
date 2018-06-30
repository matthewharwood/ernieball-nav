import { ClassNames, DataAttrs, EventTypes } from "./enums";

const RouteMapKeys = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};
const LinkClasses = {
  PRIMARY: "site-navigation__link",
  SECONDARY: "secondary-list-item--flat",
  TERTIARY: "tertiary-list-item",
};

const LinkSelectors = {
  PRIMARY: document.querySelectorAll(`.${LinkClasses.PRIMARY}`),
  SECONDARY: document.querySelectorAll(`.${LinkClasses.SECONDARY}`),
  TERTIARY: document.querySelectorAll(`.${LinkClasses.TERTIARY}`),
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



    // const primaryLinks.map(l => l.textContent);
    const RouteMap = new Map();
    // Set up main keys.
    RouteMap.set(RouteMapKeys.PRIMARY, new Map())
            .set(RouteMapKeys.SECONDARY, new Map())
            .set(RouteMapKeys.TERTIARY, new Map());

    // Set up primary
    Array.from(LinkSelectors.PRIMARY).forEach((link, i) => {
      RouteMap.get(RouteMapKeys.PRIMARY).set(i, link.textContent);
    });
    //
    Array.from(LinkSelectors.SECONDARY).forEach((link, i) => {
      RouteMap.get(RouteMapKeys.SECONDARY).set(i, link.textContent);
    });

    Array.from(LinkSelectors.TERTIARY).forEach((link, i) => {
      RouteMap.get(RouteMapKeys.TERTIARY).set(i, link.textContent);
    });

    console.log(RouteMap);
  }
}

// const map = {
//   primary: {0: 'strings', 1: 'something else' },
//   secondary: {0: {0: 'category 1', 1: 'category 2'}},
//   tertiary: {0: {0: 'subCateogry 1'}}
// };