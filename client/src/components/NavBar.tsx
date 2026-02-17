import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { ContactDialog } from "./ContactDialog";
import Logo from "./Logo";

const NavBar = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();
  const { showNavbar } = useScrollNavbar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 supports-backdrop-filter:bg-background/50 z-50">
      <nav
        className={`flex items-center mx-auto max-w-7xl px-4 py-4 transition-opacity duration-500 ${
          showNavbar ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Logo */}
        <div className="flex flex-1 justify-start gap-4">
          <Logo />
          <button
            onClick={() => navigate("/")}
            className="text-xl"
          >
            KatanaID
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex flex-3 gap-2 justify-center">
          <div>
            <Button className="rounded-l-3xl rounded-r-none">Development</Button>
            <Button className="rounded-none">Donate</Button>
            <Button className="rounded-l-none">Support</Button>
          </div>
          <div>
            <Button className="rounded-l-md rounded-r-none" asChild>
              <a href="https://docs.katanaid.com/">Docs</a>
            </Button>
            <ContactDialog>
              <Button className="rounded-l-none rounded-r-3xl">Contact</Button>
            </ContactDialog>
          </div>
        </div>

        {/* Desktop right section */}
        <div className="hidden lg:flex flex-1 gap-2 justify-end">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="bg-primary/10 text-primary hover:bg-primary/20">
                  <Globe className="size-5" />
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="p-2">
                    <NavigationMenuLink asChild>
                      <button className="block w-full px-3 py-2 text-sm rounded-md hover:bg-accent text-left">
                        English
                      </button>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <button className="block w-full px-3 py-2 text-sm rounded-md hover:bg-accent text-left">
                        Vietnamese
                      </button>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          {token === null ? (
            <Button onClick={() => navigate("/signup")}>
              Sign in
            </Button>
          ) : (
            <Button
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Log out
            </Button>
          )}
        </div>

        {/* Mobile hamburger button */}
        <div className="flex lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-6" />
            ) : (
              <Menu className="size-6" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t">
          <div className="flex flex-col gap-2 px-4 py-4">
            <Button variant="ghost" className="justify-start">
              Stories
            </Button>
            <Button variant="ghost" className="justify-start">
              Events
            </Button>
            <Button variant="ghost" className="justify-start">
              Friends
            </Button>
            <Button variant="ghost" className="justify-start">
              Support
            </Button>
            <Button variant="ghost" className="justify-start" asChild>
              <a href="https://docs.katanaid.com/">Docs</a>
            </Button>
            <ContactDialog>
              <Button variant="ghost" className="justify-start">
                Contact
              </Button>
            </ContactDialog>
            <div className="border-t my-2" />
            <p className="text-sm text-muted-foreground px-4">Language</p>
            <Button variant="ghost" className="justify-start">
              English
            </Button>
            <Button variant="ghost" className="justify-start">
              Vietnamese
            </Button>
            <div className="border-t my-2" />
            {token === null ? (
              <Button
                className="w-full"
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigate("/signup");
                }}
              >
                Sign in
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                  navigate("/");
                }}
              >
                Log out
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
