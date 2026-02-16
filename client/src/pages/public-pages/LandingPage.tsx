import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";
import AnimationContainer from "@/components/ui/animation-container";
import MaxWidthWrapper from "@/components/ui/max-width-container";
import { BentoCard, BentoGrid, CARDS } from "@/components/ui/bento-grid";
import { Button } from "@/components/ui/button";
import MagicBadge from "@/components/ui/magic-badge";
import { LampContainer } from "@/components/ui/lamp";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Input } from "@/components/ui/input";

const LandingPage = () => {
  return (
    <>
      {/* ----------------------------------NavBar---------------------------------- */}
      <NavBar />
      {/* ----------------------------------Hero Section---------------------------------- */}
      <div className="flex flex-col justify-center items-center pt-22 md:pt-50">
        <MagicBadge title="Branding Toolkit" />
        <h1 className="text-4xl md:text-6xl leading-tight text-center mt-5 max-w-4xl">
          Find the perfect name for your next project.{" "}
          <span className="bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            Everywhere.
          </span>
        </h1>
        <p className="text-lg text-muted-foreground mt-4 text-center max-w-xl">
          Domains, Social handles, Search presence — all in one click.
        </p>

        <div className="flex items-center justify-center gap-2 mt-12">
          <Input placeholder='I am building Tinder but for Dog lovers called "Ruffle" . . .' className="w-2xs md:w-md shadow-blue-200" />
          <Button variant="outline" asChild className="shadow-xl shadow-blue-200">
            <Link to="/login">Check</Link>
          </Button>
        </div>

        {/* <Badge variant="default">Badge</Badge> */}
      </div>


      {/* ----------------------------------Features section---------------------------------- */}
      <MaxWidthWrapper className="pt-50 md:pt-70 relative z-10">
        <AnimationContainer delay={0.1}>
          <div className="flex flex-col w-full items-center justify-center py-8">
            <MagicBadge title="Features" />
            <h2 className="text-center text-3xl md:text-5xl leading-tight font-medium font-heading text-foreground mt-6">
              Everything you need to{" "}
              <span className="bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent">
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
        <AnimationContainer delay={0.2}>
          <BentoGrid className="py-8">
            {CARDS.map((feature, idx) => (
              <BentoCard key={idx} {...feature} />
            ))}
          </BentoGrid>
        </AnimationContainer>
      </MaxWidthWrapper>

      {/* ----------------------------------CTA section---------------------------------- */}
      <MaxWidthWrapper className="my-15 pb-80 max-w-[80vw] overflow-x-hidden scrollbar-hide">
        <AnimationContainer delay={0.1}>
          <LampContainer>
            <div className="flex flex-col items-center justify-center relative w-full text-center max-w-3xl">
              <h2 className="text-3xl md:text-5xl pt-7 bg-clip-text text-center leading-tight font-medium font-heading tracking-tight">
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
