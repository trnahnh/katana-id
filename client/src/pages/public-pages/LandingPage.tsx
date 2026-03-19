import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AnimationContainer from "@/components/ui/animation-container";
import MaxWidthWrapper from "@/components/ui/max-width-container";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import { LampContainer } from "@/components/ui/lamp";
import Footer from "@/components/landing-page/Footer";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";
import { Comparison } from "@/components/landing-page/Comparison";
import { SideScroll } from "@/components/landing-page/SideScroll";

const LandingPage = () => {
  return (
    <>
      {/* ----------------------------------NavBar---------------------------------- */}
      <NavBar />
      {/* ----------------------------------Hero Section---------------------------------- */}
      <div className="relative flex flex-col justify-center items-center pt-22 md:pt-35 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-125 rounded-full bg-[radial-gradient(ellipse_at_center,oklch(65%_0.22_268/0.12)_0%,transparent_70%)] pointer-events-none blur-3xl" />
        <MagicBadge title="Branding Toolkit" />
        <h1 className="font-heading text-5xl md:text-7xl leading-[1.1] text-center mt-5 max-w-4xl tracking-tight">
          Find the perfect name for your next project.{" "}
          <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">
            Everywhere.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground mt-6 text-center max-w-xl">
          Domains, Social handles, Search presence — all in one click.
        </p>

        <div className="flex items-center justify-center gap-2 mt-16">
          <Input
            placeholder='I am building Tinder but for Dog lovers called "Ruffle" . . .'
            className="w-2xs md:w-xl rounded-full border-white/10 bg-white/5 backdrop-blur-sm shadow-[0_0_24px_-6px_oklch(65%_0.22_268/0.25)] focus-visible:border-primary/40"
          />
          <Button asChild className="rounded-full shadow-[0_0_24px_-4px_oklch(65%_0.22_268/0.5)] hover:shadow-[0_0_32px_-4px_oklch(65%_0.22_268/0.7)] transition-shadow">
            <Link to="/signin">Check</Link>
          </Button>
        </div>
      </div>

      {/* ----------------------------------Side scroll---------------------------------- */}
      <SideScroll />
      {/* ----------------------------------Features section---------------------------------- */}
      <MaxWidthWrapper className="pt-50 md:pt-70 relative z-10">
        <AnimationContainer delay={0.3}>
          <div className="flex flex-col w-full items-center justify-center py-8">
            <MagicBadge title="Features" />
            <h2 className="text-center text-3xl md:text-5xl leading-tight font-heading text-foreground mt-6">
              Everything you need to{" "}
              <span className="bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">
                name your brand
              </span>
              .
            </h2>
            <p className="text-sm md:text-xl mt-4 text-center text-muted-foreground max-w-lg">
              Check availability across domains, package registries, social
              platforms, and search engines — all at once.
            </p>
          </div>
        </AnimationContainer>
        <AnimationContainer delay={0.3}>
          <BentoGrid className="py-8">
            {CARDS.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* ----------------------------------Comparison---------------------------------- */}
      <Comparison />

      {/* ----------------------------------CTA---------------------------------- */}
      <MaxWidthWrapper className="mt-60 pb-70 max-w-[80vw] overflow-x-hidden scrollbar-hide">
        <AnimationContainer delay={0.3}>
          <LampContainer>
            <div className="flex flex-col items-center justify-center relative w-full text-center max-w-3xl">
              <h2 className="text-3xl md:text-5xl pt-7 text-center leading-tight font-heading tracking-tight">
                Ship your brand faster.
              </h2>
              <p className="text-sm md:text-xl text-muted-foreground mt-4 max-w-md mx-auto">
                Stop Googling one platform at a time. Check everything in
                seconds — free to start.
              </p>
              <div className="mt-6">
                <Button asChild>
                  <Link to="/login">
                    Check your name
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </LampContainer>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* ----------------------------------Footer---------------------------------- */}
      <Footer />
    </>
  );
};

export default LandingPage;
