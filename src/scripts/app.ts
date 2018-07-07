import { DesktopNav } from './desktop-nav';
import { LocaleDropdown } from './locale-dropdown';
import { MobileNav } from './mobile-nav';
import { SearchBar } from './search-bar';

class NavigationApp {
  public static run() {
    LocaleDropdown.run();
    DesktopNav.run();
    const routes = MobileNav.run();
    MobileNav.render(routes);
    SearchBar.run();
  }
}

NavigationApp.run();
