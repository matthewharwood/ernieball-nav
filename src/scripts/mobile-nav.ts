import { ClassNames, DataAttrs, EventTypes } from "./enums";

const ANCHOR = "a";
const BASE_TEN = 10;
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
  MOBILE_CLOSE: document.querySelectorAll(`[${DataAttrs.MOBILE_TRIGGER_CLOSE}]`),
  MOBILE_OPEN: document.querySelector(`[${DataAttrs.MOBILE_TRIGGER_OPEN}]`),
  MOBILE_ROOT: document.querySelector(`[${DataAttrs.MOBILE_ROOT}]`),
  PRIMARY: document.querySelectorAll(`.${LinkClasses.PRIMARY}`),
  PRIMARY_OUTLETS: document.querySelectorAll(`[${DataAttrs.OUTLET}]`),
  SECONDARY: document.querySelectorAll(`.${LinkClasses.SECONDARY}`),
  TERTIARY: document.querySelectorAll(`.${LinkClasses.TERTIARY}`)
};

const anchorize = (item) => {
  return {
    href: item.getAttribute("href"),
    label: item.textContent
  };
};
const queryAnchors = (item: HTMLElement) => item.querySelector(ANCHOR);

const groupByAttrIdAndSanatize = (acc, val: HTMLElement) => {
  const subAttrVal = parseInt(val.attributes.getNamedItem(DataAttrs.SUB_CATEGORY).value, BASE_TEN);
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

export class MobileNav {
  public static run() {
    const RouteMap = this.createMaps();
    this.createListeners();
    const setAllRouteMap = (item, i) => {
      const cats = this.getCats(DataAttrs.CATEGORY, i)
        .map(queryAnchors)
        .filter(Boolean)
        .map(anchorize);
      const subCats = this.getCats(DataAttrs.SUB_CATEGORY, i)
        .reduce(groupByAttrIdAndSanatize, {});

      RouteMap.get(RouteMapKeys.PRIMARY).set(i, anchorize(item));
      RouteMap.get(RouteMapKeys.SECONDARY).set(i, cats);
      RouteMap.get(RouteMapKeys.TERTIARY).set(i, subCats);
    };

    Array.from(LinkSelectors.PRIMARY, setAllRouteMap);
    console.log(RouteMap);
    return RouteMap;
  }

  public static render(routes) {
    console.log(this.primaryTemplate(routes), 1);
    console.log(this.secondaryTemplate(routes), 2);
    console.log(this.tertiaryTemplate(routes), 3);
  }

  private static close() {
    LinkSelectors.MOBILE_ROOT.classList.remove(ClassNames.ACTIVE);
    Array.from(LinkSelectors.MOBILE_CLOSE).forEach(t => t.classList.remove(ClassNames.ACTIVE));
  }

  private static open() {
    LinkSelectors.MOBILE_ROOT.classList.add(ClassNames.ACTIVE);
    Array.from(LinkSelectors.MOBILE_CLOSE).forEach(t => t.classList.add(ClassNames.ACTIVE));
  }

  private static createListeners() {
    LinkSelectors.MOBILE_OPEN.addEventListener(EventTypes.CLICK, this.open);
    Array.from(LinkSelectors.MOBILE_CLOSE).forEach(t => t.addEventListener(EventTypes.CLICK, this.close));
  }

  private static createMaps() {
    return new Map()
      .set(RouteMapKeys.PRIMARY, new Map())
      .set(RouteMapKeys.SECONDARY, new Map())
      .set(RouteMapKeys.TERTIARY, new Map());
  }

  private static getCats(attr, i) {
    return Array.from(selectByOutlet(LinkSelectors.PRIMARY_OUTLETS[i], attr));
  }

  private static primaryTemplate(routes) {
    const listItems = () => {
      let items = "";
      routes.get(RouteMapKeys.PRIMARY).forEach(item => {
        if (item) {
          items += `
            <li><a href="${item.href}">${item.label}</a></li>
          `;
        }
      });
      return items;
    };


    return `
      <ul>
        ${listItems()}
      </ul>
    `;
  }

  private static secondaryTemplate(routes) {
    const listItems = () => {
      let template = "";
      routes.get(RouteMapKeys.SECONDARY).forEach(items => {
        if (items) {
          for (const item of items) {
            if (item) {
              template += `
                <li><a href="${item.href}">${item.label}</a></li>
              `;
            }
          }
        }
      });

      return template;
    };


    return `
      <ul>
        ${listItems()}
      </ul>
    `;
  }

  private static tertiaryTemplate(routes) {
    const listItems = () => {
      let template = "";
      routes.get(RouteMapKeys.TERTIARY).forEach(mapItems => {
        if (mapItems) {
          Object.keys(mapItems).forEach(key => mapItems[key].forEach(item => {
            template += `
              <li><a href="${item.href}">${item.label}</a></li>
            `;
          }));
        }
      });

      return template;
    };


    return `
      <ul>
        ${listItems()}
      </ul>
    `;
  }
}