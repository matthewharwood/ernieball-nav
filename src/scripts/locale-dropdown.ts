// Locale Dropdown
import { ClassNames, DataAttrs, EventTypes } from './enums';

export class LocaleDropdown {
  public static run() {
    const dropdown = document.querySelector(
      `[${DataAttrs.DROPDOWN}]`
    ) as HTMLElement;
    const dropdownList = document.querySelector(
      `[${DataAttrs.DROPDOWN_LIST}]`
    ) as HTMLElement;
    const localeHandler = () => {
      dropdownList.classList.toggle(ClassNames.LANG_DROPDOWN_ACTIVE);
    };
    dropdown.addEventListener(EventTypes.CLICK, localeHandler);
  }
}
