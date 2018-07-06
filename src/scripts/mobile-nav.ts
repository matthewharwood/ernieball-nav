import { ClassNames, DataAttrs, EventTypes } from './enums';

const ANCHOR = 'a';
const BASE_TEN = 10;
let RouteMap;
const RouteMapKeys = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
};
const LinkClasses = {
  PRIMARY: 'site-navigation__link',
  SECONDARY: 'secondary-list-item--flat',
  TERTIARY: 'tertiary-list-item',
};
const selectByOutlet = (parent, selector) =>
  parent.querySelectorAll(`[${selector}]`);

const LinkSelectors = {
  MOBILE_CLOSE: document.querySelectorAll(
    `[${DataAttrs.MOBILE_TRIGGER_CLOSE}]`
  ),
  MOBILE_OPEN: document.querySelector(`[${DataAttrs.MOBILE_TRIGGER_OPEN}]`),
  MOBILE_OUTLETS: document.querySelectorAll(`[${DataAttrs.MOBLE_OUTLETS}]`),
  MOBILE_ROOT: document.querySelector(`[${DataAttrs.MOBILE_ROOT}]`),
  PRIMARY: document.querySelectorAll(`.${LinkClasses.PRIMARY}`),
  PRIMARY_OUTLETS: document.querySelectorAll(`[${DataAttrs.OUTLET}]`),
  SECONDARY: document.querySelectorAll(`.${LinkClasses.SECONDARY}`),
  TERTIARY: document.querySelectorAll(`.${LinkClasses.TERTIARY}`),
};

const anchorize = item => {
  return {
    href: item.getAttribute('href'),
    label: item.textContent,
  };
};
const queryAnchors = (item: HTMLElement) => item.querySelector(ANCHOR);
const selections = {
  primary: 0,
  secondary: [],
  tertiary: 0,
};
const parseTen = val => parseInt(val, BASE_TEN);
const getAttributeVal = (val, attr) => val.attributes.getNamedItem(attr).value;
const attrToInt = (val, attr) =>
  parseTen(val.attributes.getNamedItem(attr).value);

const groupByAttrIdAndSanatize = (acc, val: HTMLElement) => {
  const subAttrVal = attrToInt(val, DataAttrs.SUB_CATEGORY);
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
    RouteMap = this.createMaps();

    const setAllRouteMap = (item, i) => {
      const cats = this.getCats(DataAttrs.CATEGORY, i)
        .map(queryAnchors)
        .filter(Boolean)
        .map(anchorize);
      const subCats = this.getCats(DataAttrs.SUB_CATEGORY, i).reduce(
        groupByAttrIdAndSanatize,
        {}
      );

      RouteMap.get(RouteMapKeys.PRIMARY).set(i, anchorize(item));
      RouteMap.get(RouteMapKeys.SECONDARY).set(i, cats);
      RouteMap.get(RouteMapKeys.TERTIARY).set(i, subCats);
    };
    this.createListeners();
    Array.from(LinkSelectors.PRIMARY, setAllRouteMap);
    return RouteMap;
  }

  public static render(routes) {
    Array.from(LinkSelectors.MOBILE_OUTLETS).forEach(item => {
      const val = item.attributes.getNamedItem(DataAttrs.MOBLE_OUTLETS).value;

      switch (val) {
        case RouteMapKeys.PRIMARY:
          item.innerHTML += this.primaryTemplate(routes);
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
    Array.from(LinkSelectors.MOBILE_CLOSE).forEach(t =>
      t.classList.remove(ClassNames.ACTIVE)
    );
    MobileNav.paginate('prev', 2);
    MobileNav.paginate('prev', 1);
  }

  private static open() {
    LinkSelectors.MOBILE_ROOT.classList.add(ClassNames.ACTIVE);
    Array.from(LinkSelectors.MOBILE_CLOSE).forEach(t =>
      t.classList.add(ClassNames.ACTIVE)
    );
  }

  private static createListeners() {
    LinkSelectors.MOBILE_OPEN.addEventListener(EventTypes.CLICK, this.open);
    Array.from(LinkSelectors.MOBILE_CLOSE).forEach(t =>
      t.addEventListener(EventTypes.CLICK, this.close)
    );
  }

  private static getShowHideListItems() {
    const hideParent = item => (item.parentElement.style.display = 'none');
    const showParent = item => (item.parentElement.style.display = 'flex');
    const allSecondaryLinks = document.querySelectorAll(
      `[${DataAttrs.MOBILE_LINK_SECONDARY}]`
    );
    const allTertiaryLinks = document.querySelectorAll(
      `[${DataAttrs.MOBILE_LINK_TERTIARY}]`
    );
    const linkVisibility = (links, selector) => {
      Array.from(links).forEach(item => {
        const int = JSON.parse(getAttributeVal(item, DataAttrs.MOBILE_LINK));
        if (int[0] !== selections[selector]) {
          hideParent(item);
        } else {
          showParent(item);
        }
      });
    };
    linkVisibility(allSecondaryLinks, RouteMapKeys.PRIMARY);
    Array.from(allTertiaryLinks).forEach(item => {
      const int = JSON.parse(getAttributeVal(item, DataAttrs.MOBILE_LINK));
      hideParent(item);
      if (
        int[0] === selections[RouteMapKeys.PRIMARY] &&
        int[1] === selections[RouteMapKeys.SECONDARY][1]
      ) {
        showParent(item);
      }
    });
  }

  private static paginate(direction = '', pane, event = null) {
    const isFirst = pane === 0;
    const isSecond = pane === 1;
    const isThird = pane === 2;
    if (event) {
      if (isFirst) {
        selections.primary = attrToInt(event, DataAttrs.MOBILE_LINK);
      } else if (isSecond) {
        selections.secondary = JSON.parse(getAttributeVal(event, DataAttrs.MOBILE_LINK));
      } else if (isThird) {
        selections.tertiary = attrToInt(event, DataAttrs.MOBILE_LINK);
      }
    }

    if (direction === 'next') {
      if (isFirst) {
        (LinkSelectors.MOBILE_OUTLETS as any)[1].style.transform = `translateX(0)`;
      }
      if (isSecond) {
        (LinkSelectors.MOBILE_OUTLETS as any)[2].style.transform = `translateX(0)`;
      }
    } else if (direction === 'prev') {
      if (isSecond) {
        (LinkSelectors.MOBILE_OUTLETS as any)[1].style.transform = `translateX(100%)`;
      }
      if (isThird) {
        (LinkSelectors.MOBILE_OUTLETS as any)[2].style.transform = `translateX(100%)`;
      }
    }
    MobileNav.run();
    MobileNav.getShowHideListItems();
    console.log(selections, RouteMap);
    MobileNav.changeLabels();
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
      let items = '';

      routes.get(RouteMapKeys.PRIMARY).forEach((item, index) => {
        if (item) {
          items += `
            <li class="flyout__mobile-nav-item-select" >
              <a class="flyout__mobile-nav-item-anchor"
                  data-site-m-link="${index}" 
                  href="${item.href}" onclick="paginate('next', 0, this)">
                <span class="flyout__mobile-nav-item-label left-align">${
                  item.label
                }</span>
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
          <span class="flyout__mobile-nav-item-icon left-icon" onclick="closeMobileNavigation()"><img src="./img/close.svg" alt=""></span>
        </li>
        ${listItems()}
      </ul>
    `;
  }

  private static secondaryTemplate(routes) {
    (window as any).closeMobileNavigation = this.close;
    (window as any).paginate = this.paginate;

    const listItems = () => {
      let template = '';
      routes.get(RouteMapKeys.SECONDARY).forEach((items, index) => {
        if (items) {
          items.forEach((item, sIndex) => {
            if (item) {
              template += `
             <li class="flyout__mobile-nav-item-select">
              <a class="flyout__mobile-nav-item-anchor"
                href="${item.href}"
                data-site-m-secondary
                data-site-m-link="[${index}, ${sIndex}]" 
                onclick="paginate('next', 1, this)">
                <span class="flyout__mobile-nav-item-label left-align">${
                  item.label
                }</span>
                <span class="flyout__mobile-nav-item-icon"><img src="./img/chevron.svg" alt=""></span>
              </a>
            </li>
          `;
            }
          });
        }
      });

      return template;
    };

    return `
      <ul class="flyout__mobile-nav-list">
        <li class="flyout__mobile-nav-item-header">
          <span class="flyout__mobile-nav-item-icon" onclick="paginate('prev', 1)"><img src="./img/chevron.svg" alt=""></span>
          <span class="flyout__mobile-nav-item-label" data-site-m-secondary-label>Menu</span>
          <span class="flyout__mobile-nav-item-icon left-icon" onclick="closeMobileNavigation()"><img src="./img/close.svg" alt=""></span>
        </li>
        ${listItems()}
      </ul>
    `;
  }

  private static tertiaryTemplate(routes) {
    (window as any).closeMobileNavigation = this.close;

    const listItems = () => {
      let template = '';
      routes.get(RouteMapKeys.TERTIARY).forEach((mapItems, pIndex) => {
        if (mapItems) {
          Object.keys(mapItems).forEach(key =>
            mapItems[key].forEach((item) => {
              template += `
                <li class="flyout__mobile-nav-item-select">
                  <a class="flyout__mobile-nav-item-anchor"
                      data-site-m-tertiary
                      data-site-m-link="[${pIndex}, ${key}]" 
                      href="${item.href}">
                    <span class="flyout__mobile-nav-item-label left-align">${
                      item.label
                    }</span>
                    <span class="flyout__mobile-nav-item-icon"><img src="./img/chevron.svg" alt=""></span>
                  </a>
                </li>
            `;
            })
          );
        }
      });

      return template;
    };

    return `
      <ul class="flyout__mobile-nav-list">
        <li class="flyout__mobile-nav-item-header">
          <span class="flyout__mobile-nav-item-icon"
                onclick="paginate('prev', 2)">
              <img src="./img/chevron.svg" alt=""></span>
          <span class="flyout__mobile-nav-item-label" data-site-m-tertiary-label>Menu</span>
          <span class="flyout__mobile-nav-item-icon left-icon" onclick="closeMobileNavigation()"><img src="./img/close.svg" alt=""></span>
        </li>
        ${listItems()}
      </ul>
    `;
  }

  private static changeLabels() {
    const secondary: HTMLElement = document.querySelector(
      `[${DataAttrs.MOBILE_LINK_SECONDARY_LABEL}]`
    );
    const tertiary = document.querySelector(
      `[${DataAttrs.MOBILE_LINK_TERTIARY_LABEL}]`
    );
    secondary.innerHTML = RouteMap.get(RouteMapKeys.PRIMARY).get(
      selections[RouteMapKeys.PRIMARY]
    ).label;

    if(selections.secondary.length >= 2) {
      tertiary.innerHTML = RouteMap.get(RouteMapKeys.SECONDARY).get(
        selections[RouteMapKeys.SECONDARY][0]
      )[selections[RouteMapKeys.SECONDARY][1]].label;
    }
  }
}
