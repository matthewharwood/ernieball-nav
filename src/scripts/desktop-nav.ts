import { ClassNames, DataAttrs, DEBOUNCE_TIMER, EventTypes } from "./enums";

export class DesktopNav {
  public static run() {
    // Set up Selectors
    const rootSiteLink = document.querySelector(`[${DataAttrs.ROOT}]`) as HTMLElement;
    const overlay = document.querySelector(`.${ClassNames.DESKTOP_NAV}`) as HTMLElement;
    const links = document.querySelectorAll(`[${DataAttrs.LINK}]`) as NodeListOf<HTMLElement>;
    const outlets = document.querySelectorAll(`[${DataAttrs.OUTLET}]`) as NodeListOf<HTMLElement>;

    // Set up DataStructure
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
    // State
    const linksOutletsMap = mapLinksOutlets(links, outlets);
    let timeout: any = null;

    // HANDLERS
    const setRootsLinkValue = (id = "*") => {
      rootSiteLink.setAttribute(DataAttrs.LINK, id);
    };

    const setActiveLink = (id = "*") => {
      const prevId = rootSiteLink.attributes.getNamedItem(DataAttrs.LINK).value;
      linksOutletsMap.forEach(l => l.get(DataAttrs.LINK).classList.remove(ClassNames.ACTIVE));

      if (!isNaN(parseInt(prevId, 10))) {
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


    const enterHandler = ({ target }: MouseEvent) => {
      activate(target);
      clearTimeout(timeout);
    };

    const leaveHandler = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => deactivate(), DEBOUNCE_TIMER);
    };

    // Listeners
    Array.from(links).forEach(l => {
      l.addEventListener(EventTypes.MOUSEENTER, enterHandler);
      l.addEventListener(EventTypes.MOUSELEAVE, leaveHandler);
    });
  }
}