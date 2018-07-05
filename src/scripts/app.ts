import { DesktopNav } from './desktop-nav';
import { LocaleDropdown } from './locale-dropdown';
import { MobileNav } from './mobile-nav';

class NavigationApp {
  public static run() {
    LocaleDropdown.run();
    const routes = MobileNav.run();
    DesktopNav.run();
    MobileNav.render(routes);
  }
}

NavigationApp.run();
