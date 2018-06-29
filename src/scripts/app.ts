const dropdown = document.querySelector("[data-lang-dropdown]") as HTMLElement;

const dropdownList = document.querySelector("[data-lang-dropdown-list]") as HTMLElement;
dropdown.addEventListener("click", (e) => {
  dropdownList.classList.toggle("lang-select__dropdown--active");
});

/*
 * Primary Nav Fly out.
 */
const ClassNames = {
  ACTIVE: "active",
  DESKTOP_NAV: "flyout__desktop-nav"
};

const DataAttrs = {
  LINK: "data-site-link",
  OUTLET: "data-site-outlet"
};

const overlay = document.querySelector(`.${ClassNames.DESKTOP_NAV}`) as HTMLElement;
const links = document.querySelectorAll(`[${DataAttrs.LINK}]`) as NodeListOf<HTMLElement>;
const outlets = document.querySelectorAll(`[${DataAttrs.OUTLET}]`) as NodeListOf<HTMLElement>;

interface ILinksOutletsMap {
  elementOutlet: HTMLElement;
  linksOutlet: HTMLElement;
  id: number;
}

const mapLinksOutlets = (ls: NodeListOf<HTMLElement>, os: NodeListOf<HTMLElement>): Map<string, Map<string, HTMLElement>> => {
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
console.log(linksOutletsMap);




let timeout: any = null;


const addActive = () => {
  overlay.classList.add(ClassNames.ACTIVE);
};

const removeActive = () => {
  overlay.classList.remove(ClassNames.ACTIVE);
};

const showOverlayHandler = ({ target }: any) => {
  addActive();
  clearTimeout(timeout);
};

const removeOverlayHandler = () => {
  clearTimeout(timeout);
  timeout = setTimeout(() => removeActive(), 500);
};

Array.from(links).forEach(l => {
  l.addEventListener("mouseenter", showOverlayHandler);
  l.addEventListener("mouseleave", removeOverlayHandler);
});


