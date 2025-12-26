import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuTrigger } from "@radix-ui/react-navigation-menu"
import { NavigationMenuList } from "./ui/navigation-menu"

const NavBar = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList className="fixed top-0 w-full border-b border-border backdrop-blur-md">
        <NavigationMenuItem className="flex items-center gap-6 px-6 py-6">
          <div className="text-xl font-bold">KatanaID</div>
          <NavigationMenuTrigger>Source</NavigationMenuTrigger>
          <NavigationMenuContent>
            <NavigationMenuLink>Github</NavigationMenuLink>
            <NavigationMenuLink>Website</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>)
}

export default NavBar