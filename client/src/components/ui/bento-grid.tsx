import { buttonVariants } from "@/components/ui/button";
import { cn } from "../../lib/utils";
import {
  ArrowRightIcon,
  SparklesIcon,
  GlobeIcon,
  AtSignIcon,
  SearchIcon,
  FileTextIcon,
} from "lucide-react";
import type { ReactNode } from "react";

export const CARDS = [
  // First row
  {
    Icon: SparklesIcon,
    name: "Generate the perfect name",
    description:
      "Describe what you're building and we'll generate brand name candidates that are memorable, available, and ready to claim.",
    href: "#",
    cta: "Describe your idea",
    className: "col-span-2 lg:col-span-2",
  },
  {
    Icon: GlobeIcon,
    name: "Domain Availability",
    description:
      "Check .com, .dev, .io, and dozens more TLDs instantly. See what's taken, what's premium, and what's yours.",
    href: "#",
    cta: "Check and claim now",
    className: "col-span-2 lg:col-span-1",
  },
  // Second row
  {
    Icon: AtSignIcon,
    name: "Social Handles",
    description:
      "Twitter/X, Instagram, TikTok, Reddit — check handle availability across every platform in one shot.",
    href: "#",
    cta: "Grab them all",
    className: "col-span-2 lg:col-span-1",
  },
  {
    Icon: SearchIcon,
    name: "Search Presence",
    description:
      "See how crowded your name is on Google, the App Store, and Play Store before you commit to it.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "See how you rank",
  },
  {
    Icon: FileTextIcon,
    name: "Summary report",
    description:
      "Get a shareable summary and comparison of every check — availability, conflicts, and top picks — to share with your team.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
  },
];

const BentoGrid = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-3 gap-4",
        className
      )}
    >
      {children}
    </div>
  );
};

const BentoCard = ({
  name,
  className,
  Icon,
  description,
  href,
  cta,
}: {
  name: string;
  className: string;
  background?: ReactNode;
  Icon: any;
  description: string;
  href: string;
  cta: string;
}) => (
  <div
    key={name}
    className={cn(
      "group relative col-span-3 flex flex-col justify-between overflow-hidden rounded-xl h-50",
      "bg-card border border-border/60 shadow-md hover:shadow-lg transition-shadow duration-300",
      className
    )}
  >
    <div className="pointer-events-none z-10 flex flex-col gap-1 p-6 transition-all duration-300 group-hover:-translate-y-10">
      <Icon className="h-12 w-12 origin-left text-primary/70 transition-all duration-300 ease-in-out group-hover:scale-75" />
      <h3 className="text-xl font-semibold text-foreground">{name}</h3>
      <p className="max-w-lg text-muted-foreground">{description}</p>
    </div>

    <div
      className={cn(
        "absolute bottom-0 flex w-full translate-y-10 flex-row items-center p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
      )}
    >
      <a
        href={href}
        className={buttonVariants({
          size: "sm",
          variant: "ghost",
          className: "cursor-pointer",
        })}
      >
        {cta}
        <ArrowRightIcon className="ml-2 h-4 w-4" />
      </a>
    </div>
    <div className="pointer-events-none absolute inset-0 transition-all duration-300 group-hover:bg-foreground/[.02]" />
  </div>
);

export { BentoCard, BentoGrid };
