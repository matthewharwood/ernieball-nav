import { DesktopNav } from "./desktop-nav";
import { LocaleDropdown } from "./locale-dropdown";
import { MobileNav } from "./mobile-nav";

class NavigationApp {
  public static run() {
    LocaleDropdown.run();
    MobileNav.run();
    DesktopNav.run();
  }
}

NavigationApp.run();