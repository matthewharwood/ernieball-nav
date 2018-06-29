const DEBOUNCE_TIMER = 500;
const ClassNames = {
  ACTIVE: "active",
  DESKTOP_NAV: "flyout__desktop-nav",
  LANG_DROPDOWN_ACTIVE: "lang-select__dropdown--active"
};

const DataAttrs = {
  DROPDOWN: "data-lang-dropdown",
  DROPDOWN_LIST: "data-lang-dropdown-list",
  LINK: "data-site-link",
  OUTLET: "data-site-outlet"
};

const EventTypes = {
  CLICK: "click",
  MOUSEENTER: "mouseenter",
  MOUSELEAVE: "mouseleave"
};

const dropdown = document.querySelector(`[${DataAttrs.DROPDOWN}]`) as HTMLElement;

const dropdownList = document.querySelector(`[${DataAttrs.DROPDOWN_LIST}]`) as HTMLElement;
dropdown.addEventListener(EventTypes.CLICK, () => {
  dropdownList.classList.toggle(ClassNames.LANG_DROPDOWN_ACTIVE);
});

/*
 * Primary Nav Fly out.
 */
const overlay = document.querySelector(`.${ClassNames.DESKTOP_NAV}`) as HTMLElement;
const links = document.querySelectorAll(`[${DataAttrs.LINK}]`) as NodeListOf<HTMLElement>;
const outlets = document.querySelectorAll(`[${DataAttrs.OUTLET}]`) as NodeListOf<HTMLElement>;

type LinkOrOutlet = "outlet" | "link";
const mapLinksOutlets = (ls: NodeListOf<HTMLElement>, os: NodeListOf<HTMLElement>): Map<string, Map<LinkOrOutlet, HTMLElement>> => {
  const map = new Map();

  Array.from(ls).forEach(l => {
    Array.from(os).forEach(o => {
      if (o.attributes.getNamedItem(DataAttrs.OUTLET).value === l.attributes.getNamedItem(DataAttrs.LINK).value) {
        const val = l.attributes.getNamedItem(DataAttrs.LINK).value;
        map.set(val, new Map().set("outlet", o).set("link", l));
      }
    });
  });
  return map;
};
const linksOutletsMap = mapLinksOutlets(links, outlets);


let timeout: any = null;

const activate = (t) => {
  // linksOutletsMap
  linksOutletsMap.forEach((v) => v.get("outlet").classList.remove(ClassNames.ACTIVE));
  linksOutletsMap.get(t.attributes.getNamedItem(DataAttrs.LINK).value).get("outlet").classList.add(ClassNames.ACTIVE);
  overlay.classList.add(ClassNames.ACTIVE);
};

const deactivate = () => {
  overlay.classList.remove(ClassNames.ACTIVE);
};

const enterHandler = ({ target }: MouseEvent) => {
  activate(target);
  clearTimeout(timeout);
};

const leaveHandler = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => deactivate(), DEBOUNCE_TIMER);
};

Array.from(links).forEach(l => {
  l.addEventListener(EventTypes.MOUSEENTER, enterHandler);
  l.addEventListener(EventTypes.MOUSELEAVE, leaveHandler);
});


