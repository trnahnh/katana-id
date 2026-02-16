import { Button } from "./ui/button";
import { ArrowRight, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import Logo from "./Logo";
import { ContactDialog } from "./ContactDialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet";

const NavBar = () => {
  const navigate = useNavigate();
  const { token, logout } = useAuthStore();

  return (
    <nav className="sticky top-0 z-50 w-full h-full border-b border-border/40 bg-background/10 backdrop-blur-md py-1.5 px-4">
      <div className="mx-auto max-w-6xl flex items-center">
        {/* Logo */}
        <div
          className="flex-1 flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Logo />
          <p className="text-xl hover:drop-shadow-[0_0_10px_rgba(60,130,240,1)] transition-all">
            KatanaID
          </p>
        </div>

        {/* Desktop nav - hidden on mobile */}
        <div className="flex-1 hidden md:flex items-center justify-center gap-3">
          <Button variant="ghost" asChild>
            <a href="https://docs.katanaid.com/">Docs</a>
          </Button>
          <ContactDialog>
            <Button variant="ghost">Contact</Button>
          </ContactDialog>
        </div>

        {/* Desktop right section - hidden on mobile */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-3">
          {token === null ? (
            <Button variant="ghost" onClick={() => navigate("/signup")}>
              Sign in
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              Log out
            </Button>
          )}
          <Button variant="default">
            Build now <ArrowRight />
          </Button>
        </div>

        {/* Mobile menu button + sheet */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="">
              <div className="flex flex-col gap-4 mt-4 px-5 pt-10">
                <Button variant="ghost" className="justify-start" asChild>
                  <a href="https://docs.katanaid.com/">Docs</a>
                </Button>
                <ContactDialog>
                  <Button variant="ghost" className="justify-start">
                    Contact
                  </Button>
                </ContactDialog>
                <div className="border-t pt-4 flex flex-col gap-2">
                  {token === null ? (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => navigate("/signup")}
                    >
                      Sign in
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      className="justify-start"
                      onClick={() => {
                        logout();
                        navigate("/");
                      }}
                    >
                      Log out
                    </Button>
                  )}
                  <Button variant="default" className="w-full justify-start">
                    Build now <ArrowRight />
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
