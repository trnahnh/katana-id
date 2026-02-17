import { useState } from "react";
import { Button } from "./ui/button";
import { Menu, X, Globe, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollNavbar } from "@/hooks/useScrollNavbar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";

const NavBar = () => {
  const navigate = useNavigate();
  const { showNavbar } = useScrollNavbar();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-50">
      <nav
        className={`flex items-center mx-auto max-w-7xl px-4 py-4 transition-opacity duration-500 ${showNavbar ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
      >
        {/* Logo */}
        <div className="flex flex-1 justify-start">
          <button
            onClick={() => navigate("/")}
            className="text-xl font-bold"
          >
            Caphne
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex flex-3 gap-2 justify-center">
          <div>
            <Button className="rounded-l-3xl rounded-r-none">Stories</Button>
            <Button className="rounded-none">Events</Button>
            <Button className="rounded-none">Friends</Button>
            <Button className="rounded-l-none">Support</Button>
          </div>
          <div className="flex">
            <Button className="rounded-r-none">Donate</Button>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="rounded-l-none rounded-r-3xl">
                    Contribute
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex gap-2 p-4">
                      <a
                        href="https://github.com/suka712/caphne-studybuddy"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="size-24">
                          <Github className="size-8" />
                        </Button>
                      </a>
                      <div>
                        <a
                          href="https://github.com/suka712"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                          >
                            Khiem Nguyen
                          </Button>
                        </a>
                        <a
                          href="https://github.com/Giaugg"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                          >
                            Rich Le
                          </Button>
                        </a>
                        <a
                          href="https://github.com/trnahnh"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="ghost"
                            className="h-8 w-full justify-start"
                          >
                            Andrea Tran
                          </Button>
                        </a>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
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
          <Button onClick={() => navigate("/start")}>Start now</Button>
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
            <Button variant="ghost" className="justify-start">
              Donate
            </Button>
            <div className="border-t my-2" />
            <p className="text-sm text-muted-foreground px-4">Contribute</p>
            <a
              href="https://github.com/suka712/caphne-studybuddy"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" className="justify-start w-full">
                <Github className="size-5 mr-2" />
                GitHub Repo
              </Button>
            </a>
            <div className="border-t my-2" />
            <p className="text-sm text-muted-foreground px-4">Language</p>
            <Button variant="ghost" className="justify-start">
              English
            </Button>
            <Button variant="ghost" className="justify-start">
              Vietnamese
            </Button>
            <div className="border-t my-2" />
            <Button
              className="w-full"
              onClick={() => {
                setMobileMenuOpen(false);
                navigate("/start");
              }}
            >
              Start now
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default NavBar;
