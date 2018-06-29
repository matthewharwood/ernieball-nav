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
  OUTLET: "data-site-outlet",
  ROOT: "data-site-root",
};

const EventTypes = {
  CLICK: "click",
  MOUSEENTER: "mouseenter",
  MOUSELEAVE: "mouseleave"
};

// Locale Dropdown
const dropdown = document.querySelector(`[${DataAttrs.DROPDOWN}]`) as HTMLElement;
const dropdownList = document.querySelector(`[${DataAttrs.DROPDOWN_LIST}]`) as HTMLElement;

const localeHandler = () => {
  dropdownList.classList.toggle(ClassNames.LANG_DROPDOWN_ACTIVE);
};
dropdown.addEventListener(EventTypes.CLICK, localeHandler);


// Primary Desktop Overlay
const rootSiteLink = document.querySelector(`[${DataAttrs.ROOT}]`) as HTMLElement;
const overlay = document.querySelector(`.${ClassNames.DESKTOP_NAV}`) as HTMLElement;
const links = document.querySelectorAll(`[${DataAttrs.LINK}]`) as NodeListOf<HTMLElement>;
const outlets = document.querySelectorAll(`[${DataAttrs.OUTLET}]`) as NodeListOf<HTMLElement>;

const mapLinksOutlets = (ls: NodeListOf<HTMLElement>, os: NodeListOf<HTMLElement>): Map<string, Map<string, HTMLElement>> => {
  const map = new Map();
  Array.from(ls).forEach(l => {
    Array.from(os).forEach(o => {
      if (o.attributes.getNamedItem(DataAttrs.OUTLET).value === l.attributes.getNamedItem(DataAttrs.LINK).value) {
        const val = l.attributes.getNamedItem(DataAttrs.LINK).value;
        map.set(val, new Map().set(DataAttrs.OUTLET, o).set(DataAttrs.LINK, l));
      }
    });
  });
  return map;
};


const linksOutletsMap = mapLinksOutlets(links, outlets);



let timeout: any = null;

const setRootsLinkValue = (id = '*') => {
  rootSiteLink.setAttribute(DataAttrs.LINK, id);
};

const setActiveLink = (id = '*') => {
  const linkId = parseInt(id, 10);

  if(isNaN(linkId)) {
    linksOutletsMap.forEach(l => l.get(DataAttrs.LINK).classList.remove(ClassNames.ACTIVE))
  } else {
    linksOutletsMap.get(id).get(DataAttrs.LINK).classList.add(ClassNames.ACTIVE);
  }
};

const activate = (t) => {
  const linkId = t.attributes.getNamedItem(DataAttrs.LINK).value;

  linksOutletsMap.forEach((v) => v.get(DataAttrs.OUTLET).classList.remove(ClassNames.ACTIVE));
  linksOutletsMap.get(linkId).get(DataAttrs.OUTLET).classList.add(ClassNames.ACTIVE);

  setRootsLinkValue(linkId);
  setActiveLink(linkId);
  overlay.classList.add(ClassNames.ACTIVE);
};

const deactivate = () => {
  setRootsLinkValue();
  setActiveLink();
  overlay.classList.remove(ClassNames.ACTIVE);
};


// HANDLERS
const enterHandler = ({ target }: MouseEvent) => {
  activate(target);
  clearTimeout(timeout);
};

const leaveHandler = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => deactivate(), DEBOUNCE_TIMER);
};

// LISTENERS
function main() {

  Array.from(links).forEach(l => {
    l.addEventListener(EventTypes.MOUSEENTER, enterHandler);
    l.addEventListener(EventTypes.MOUSELEAVE, leaveHandler);
  });
}


main();

// TODO: make these classes;


