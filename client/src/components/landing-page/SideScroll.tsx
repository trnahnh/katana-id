import AnimationContainer from "../ui/animation-container";

export const SideScroll = () => {
  const TickerItem = ({ name, available }: { name: string; available: boolean }) => (
    <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card/35 px-6 py-1.5 shadow-sm shadow-foreground/5 shrink-0">
      <span className={`text-md font-medium ${available ? "text-emerald-600" : "text-red-400"}`}>
        {available ? "\u2713" : "\u2717"}
      </span>
      <span className="text-xs text-foreground/80 whitespace-nowrap">{name}</span>
    </div>
  );

  return (
    <AnimationContainer delay={0.50} className="flex flex-col items-center justify-center w-full pt-20">
      {/* First row */}
      <div className="relative mt-14 overflow-hidden py-2 max-w-7xl">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex animate-[scroll_35s_linear_infinite] w-max gap-3">
          {[...Array(2)].map((_, dupeIdx) => (
            <div key={dupeIdx} className="flex gap-3 shrink-0">
              <TickerItem name="ruffle.com" available />
              <TickerItem name="ruffle.dev" available />
              <TickerItem name="@ruffle" available={false} />
              <TickerItem name="ruffle.io" available />
              <TickerItem name="npm/ruffle" available={false} />
              <TickerItem name="github/ruffle" available />
              <TickerItem name="r/ruffle" available />
              <TickerItem name="ruffle.app" available={false} />
              <TickerItem name="tiktok/@ruffle" available />
              <TickerItem name="ruffle.co" available />
              <TickerItem name="ig/ruffle" available={false} />
              <TickerItem name="ruffle on Google" available />
            </div>
          ))}
        </div>
      </div>

      {/* Second row */}
      <div className="relative overflow-hidden max-w-7mvh py-2">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
        <div className="flex animate-[scroll_40s_linear_infinite] w-max gap-3">
          {[...Array(2)].map((_, dupeIdx) => (
            <div key={dupeIdx} className="flex gap-3 shrink-0">
              <TickerItem name="ruffle.com" available />
              <TickerItem name="ruffle.dev" available />
              <TickerItem name="@ruffle" available={false} />
              <TickerItem name="ruffle.io" available />
              <TickerItem name="npm/ruffle" available={false} />
              <TickerItem name="github/ruffle" available />
              <TickerItem name="r/ruffle" available />
              <TickerItem name="ruffle.app" available={false} />
              <TickerItem name="tiktok/@ruffle" available />
              <TickerItem name="ruffle.co" available />
              <TickerItem name="ig/ruffle" available={false} />
              <TickerItem name="ruffle on Google" available />
            </div>
          ))}
        </div>
      </div>
    </AnimationContainer>
  )
}