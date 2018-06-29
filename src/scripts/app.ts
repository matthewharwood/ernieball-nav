const dropdown = document.querySelector("[data-lang-dropdown]") as HTMLElement;

const dropdownList = document.querySelector("[data-lang-dropdown-list]") as HTMLElement;
dropdown.addEventListener("click", (e) => {
  dropdownList.classList.toggle("lang-select__dropdown--active");
});

/*
 * Primary Nav Fly out.
 */
const ClassNames = {
  ACTIVE: "active"
};

const overlay = document.querySelector(".flyout__desktop-nav") as HTMLElement;
const links = document.querySelectorAll("[data-site-link]") as NodeListOf<HTMLElement>;
const outlets = document.querySelectorAll("[data-site-outlet]") as NodeListOf<HTMLElement>;

const mapLinksOutlets = (ls: NodeListOf<HTMLElement>, os: NodeListOf<HTMLElement>) => {
  const map = new Map();

  Array.from(ls).forEach(l => {
    Array.from(os).forEach(o => {
      if (o.attributes.getNamedItem("data-site-outlet").value === l.attributes.getNamedItem("data-site-link").value) {
        const val = l.attributes.getNamedItem("data-site-link").value;
        map.set(val, new Map().set("outlet", o).set("link", l));
      }
    });
  });
  return map;
};
const linksOutletsMap = mapLinksOutlets(links, outlets);
console.log(linksOutletsMap);

interface ILinksOutletsMap {
  elementOutlet: HTMLElement;
  linksOutlet: HTMLElement;
  id: number;
}


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


