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
  MOBILE_OUTLETS: document.querySelectorAll(`[${DataAttrs.MOBLE_OUTLETS}]`),
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
    (window as any).currentMenuPage = 1;
    const RouteMap = this.createMaps();

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
    return RouteMap;
  }

  public static render(routes) {

    Array.from(LinkSelectors.MOBILE_OUTLETS).forEach(item => {
      const val = item.attributes.getNamedItem(DataAttrs.MOBLE_OUTLETS).value;
      switch (val) {
        case RouteMapKeys.PRIMARY:
          item.innerHTML += this.primaryTemplate(routes);
          this.createListeners();
          return;
        case RouteMapKeys.SECONDARY:
          item.innerHTML += this.secondaryTemplate(routes);
          return;
        case RouteMapKeys.TERTIARY:
          item.innerHTML += this.tertiaryTemplate(routes);
          return;
        default:

          return;
      }
    });

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

  private static paginate(direction = "", pane) {
    if (direction === "next") {
      if (pane === 0) {
        (LinkSelectors.MOBILE_OUTLETS as any)[1].style.transform = `translateX(0)`;
      }
      if (pane === 1) {
        (LinkSelectors.MOBILE_OUTLETS as any)[2].style.transform = `translateX(0)`;
      }

    } else if (direction === "prev") {
      if (pane === 1) {
        (LinkSelectors.MOBILE_OUTLETS as any)[1].style.transform = `translateX(100%)`;
      }
      if (pane === 2) {
        (LinkSelectors.MOBILE_OUTLETS as any)[2].style.transform = `translateX(100%)`;
      }
    } else {

    }
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
    (window as any).closeMobileNavigation = this.close;
    (window as any).paginate = this.paginate;

    const listItems = () => {
      let items = "";
      routes.get(RouteMapKeys.PRIMARY).forEach(item => {
        if (item) {
          items += `
            <li class="flyout__mobile-nav-item-select">
              <a class="flyout__mobile-nav-item-anchor" href="${item.href}" onclick="paginate('next', 0)">
                <span class="flyout__mobile-nav-item-label left-align">${item.label}</span>
                <span class="flyout__mobile-nav-item-icon"><img src="./img/chevron.svg" alt=""></span>
              </a>
            </li>
          `;
        }
      });
      return items;
    };


    return `
      <ul class="flyout__mobile-nav-list">
        <li class="flyout__mobile-nav-item-header">
          <span class="flyout__mobile-nav-item-label">Menu</span>
          <span class="flyout__mobile-nav-item-icon" onclick="closeMobileNavigation()"><img src="./img/close.svg" alt=""></span>
        </li>
        ${listItems()}
      </ul>
    `;
  }

  private static secondaryTemplate(routes) {
    (window as any).closeMobileNavigation = this.close;
    (window as any).paginate = this.paginate;
    const listItems = () => {
      let template = "";
      routes.get(RouteMapKeys.SECONDARY).forEach(items => {
        if (items) {
          for (const item of items) {
            if (item) {
              template += `
                
                 <li class="flyout__mobile-nav-item-select">
                  <a class="flyout__mobile-nav-item-anchor" href="${item.href}" onclick="paginate('next', 1)">
                    <span class="flyout__mobile-nav-item-label left-align">${item.label}</span>
                    <span class="flyout__mobile-nav-item-icon"><img src="./img/chevron.svg" alt=""></span>
                  </a>
                </li>
              `;
            }
          }
        }
      });

      return template;
    };


    return `
      <ul class="flyout__mobile-nav-list">
        <li class="flyout__mobile-nav-item-header">
          <span class="flyout__mobile-nav-item-icon" onclick="paginate('prev', 1)"><img src="./img/chevron.svg" alt=""></span>
          <span class="flyout__mobile-nav-item-label">Menu</span>
        </li>
        ${listItems()}
      </ul>
    `;
  }

  private static tertiaryTemplate(routes) {
    (window as any).closeMobileNavigation = this.close;
    (window as any).paginate = this.paginate;
    const listItems = () => {
      let template = "";
      routes.get(RouteMapKeys.TERTIARY).forEach(mapItems => {
        if (mapItems) {
          Object.keys(mapItems).forEach(key => mapItems[key].forEach(item => {
            template += `
                  <li class="flyout__mobile-nav-item-select">
                  <a class="flyout__mobile-nav-item-anchor" href="${item.href}">
                    <span class="flyout__mobile-nav-item-label left-align">${item.label}</span>
                    <span class="flyout__mobile-nav-item-icon"><img src="./img/chevron.svg" alt=""></span>
                  </a>
                </li>
            `;
          }));
        }
      });

      return template;
    };


    return `
      <ul class="flyout__mobile-nav-list">
        <li class="flyout__mobile-nav-item-header">
          <span class="flyout__mobile-nav-item-icon" onclick="paginate('prev', 2)"><img src="./img/close.svg" alt=""></span>
          <span class="flyout__mobile-nav-item-label">Menu</span>
        </li>
        ${listItems()}
      </ul>
    `;
  }
}