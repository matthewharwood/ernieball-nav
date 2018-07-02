import { ClassNames, DataAttrs, EventTypes } from "./enums";

const RouteMapKeys = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary"
};
const LinkClasses = {
  PRIMARY: "site-navigation__link",
  SECONDARY: "secondary-list-item--flat",
  TERTIARY: "tertiary-list-item"
};
const selectByOutlet = (parent, selector) => parent.querySelectorAll(`[${selector}]`);
const LinkSelectors = {
  PRIMARY: document.querySelectorAll(`.${LinkClasses.PRIMARY}`),
  PRIMARY_OUTLETS: document.querySelectorAll(`[${DataAttrs.OUTLET}]`),
  SECONDARY: document.querySelectorAll(`.${LinkClasses.SECONDARY}`),
  TERTIARY: document.querySelectorAll(`.${LinkClasses.TERTIARY}`)
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

    const anchorize = (item) => {
      return {
        href: item.getAttribute("href"),
        label: item.textContent
      };
    };

    const RouteMap = new Map()
      .set(RouteMapKeys.PRIMARY, new Map())
      .set(RouteMapKeys.SECONDARY, new Map())
      .set(RouteMapKeys.TERTIARY, new Map());

    // Set up primary
    const getCats = (attr, i) => Array.from(selectByOutlet(LinkSelectors.PRIMARY_OUTLETS[i], attr));
    const queryAnchors = (item: HTMLElement) => item.querySelector("a");
    const groupByAttrIdAndSanatize = (acc, val: HTMLElement) => {
      const subAttrVal = parseInt(val.attributes.getNamedItem(DataAttrs.SUB_CATEGORY).value, 10);
      if (val && !isNaN(subAttrVal)) {
        if (acc[subAttrVal]) {
          acc[subAttrVal].push(anchorize(queryAnchors(val)));
        } else {
          acc[subAttrVal] = [];
          acc[subAttrVal].push(anchorize(queryAnchors(val)));
        }
      }
      return acc;
    };
    const setAllRouteMap = (item, i) => {
      const cats = getCats(DataAttrs.CATEGORY, i)
        .map(queryAnchors)
        .filter(Boolean)
        .map(anchorize);

      const subCats = getCats(DataAttrs.SUB_CATEGORY, i)
        .reduce(groupByAttrIdAndSanatize, {});

      RouteMap.get(RouteMapKeys.PRIMARY).set(i, anchorize(item));
      RouteMap.get(RouteMapKeys.SECONDARY).set(i, cats);
      RouteMap.get(RouteMapKeys.TERTIARY).set(i, subCats);
    };

    Array.from(LinkSelectors.PRIMARY, setAllRouteMap);

    console.log(RouteMap);
  }
}