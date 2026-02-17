import AnimationContainer from "../ui/animation-container";

export const SideScroll = () => {
  const TickerItem = ({ name, available }: { name: string; available: boolean }) => (
    <div className="flex items-center gap-1.5 rounded-full border border-border/10 bg-card/35 px-6 py-1.5 shadow-sm shadow-foreground/5 shrink-0">
      <span className={`text-md font-medium ${available ? "text-emerald-600" : "text-red-400"}`}>
        {available ? "\u2713" : "\u2717"}
      </span>
      <span className="text-xs text-foreground/80 whitespace-nowrap">{name}</span>
    </div>
  );

  return (
    <AnimationContainer delay={0.50} className="flex flex-col items-center justify-center w-full pt-20">
      {/* First row */}
      <div className="relative mt-14 overflow-hidden py-2 w-8/12">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex animate-[scroll_50s_linear_infinite] w-max gap-3">
          {[...Array(2)].map((_, dupeIdx) => (
            <div key={dupeIdx} className="flex gap-3 shrink-0">
              <TickerItem name="Tinder for petshop owners" available />
              <TickerItem name="AI powered Voicenote" available />
              <TickerItem name="Agentic LifeOS for Mobile" available />
              <TickerItem name="Webhook as a service" available />
              <TickerItem name="QR payment for small business" available />
              <TickerItem name="Hypervisualized productivity tracking" available />
              <TickerItem name="Edge ML for healthcare" available />
              <TickerItem name="Data labelling for gestures" available />
              <TickerItem name="Tinder + Spotify" available />
              <TickerItem name="Collaborative file storage" available />
              <TickerItem name="Productivity suite" available />
              <TickerItem name="Auth0 but for Indie devs" available />
            </div>
          ))}
        </div>
      </div>

      {/* Second row */}
      <div className="relative overflow-hidden w-9/12 py-2">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex animate-[scroll_50s_linear_infinite] w-max gap-3">
          {[...Array(2)].map((_, dupeIdx) => (
            <div key={dupeIdx} className="flex gap-3 shrink-0">
              <TickerItem name="ruffle.com" available />
              <TickerItem name="awwmatch.com" available />
              <TickerItem name="@ruffle" available={false} />
              <TickerItem name="pawmatch.io" available />
              <TickerItem name="r/ruffle" available={false} />
              <TickerItem name="PawwMatch on Google" available />
              <TickerItem name="ig/@pawwmates" available />
              <TickerItem name="pawmatch VS ruffle" available={false} />
              <TickerItem name="tiktok/@ruffle" available />
              <TickerItem name="ruffle.co" available />
              <TickerItem name="ig/@ruffle" available={false} />
              <TickerItem name="Ruffle on Google" available />
            </div>
          ))}
        </div>
      </div>

      {/* Third row */}
      <div className="relative overflow-hidden w-11/12 py-2">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex animate-[scroll_55s_linear_infinite] w-max gap-3">
          {[...Array(2)].map((_, dupeIdx) => (
            <div key={dupeIdx} className="flex gap-3 shrink-0">
              <TickerItem name="ParrotHint" available />
              <TickerItem name="Caphene" available />
              <TickerItem name="KagiHomes" available={false} />
              <TickerItem name="AZX.org" available />
              <TickerItem name="Wayfare" available={false} />
              <TickerItem name="RizzHub" available />
              <TickerItem name="QuestCV" available />
              <TickerItem name="MyCentry" available={false} />
              <TickerItem name="RoundTrip.com" available />
              <TickerItem name="kunai.co" available />
              <TickerItem name="TypeOS" available={false} />
              <TickerItem name="CZ.cloud" available />
            </div>
          ))}
        </div>
      </div>
    </AnimationContainer>
  )
}