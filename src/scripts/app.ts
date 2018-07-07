import { Cart } from "./cart";
import { DesktopNav } from './desktop-nav';
import { LocaleDropdown } from './locale-dropdown';
import { MobileNav } from './mobile-nav';
import { SearchBar } from './search-bar';

class NavigationApp {
  public static run() {
    LocaleDropdown.run();
    DesktopNav.run();
    MobileNav.render(MobileNav.run());
    SearchBar.run();
    Cart.run();
  }
}

NavigationApp.run();
