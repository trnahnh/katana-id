import AnimationContainer from "../ui/animation-container"
import MaxWidthWrapper from "../ui/max-width-container"

export const Comparison = () => {
  const BrowserTab = ({ url, className }: { url: string; className?: string }) => (
    <div className={`w-56 rounded-lg border border-border/50 bg-card shadow-md overflow-hidden ${className ?? ""}`}>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/40 border-b border-border/30">
        <div className="flex gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-300/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-yellow-300/60" />
          <div className="w-1.5 h-1.5 rounded-full bg-green-300/60" />
        </div>
        <div className="flex-1 h-4 rounded bg-muted/60 flex items-center px-1.5">
          <span className="text-[9px] text-muted-foreground/60 truncate font-mono">{url}</span>
        </div>
      </div>
      <div className="h-14 p-2 space-y-1.5">
        <div className="h-1.5 w-3/4 rounded-full bg-muted/40" />
        <div className="h-1.5 w-1/2 rounded-full bg-muted/30" />
        <div className="h-1.5 w-2/3 rounded-full bg-muted/20" />
      </div>
    </div>
  );

  const ResultRow = ({
    name,
    results,
  }: {
    name: string;
    results: { platform: string; ok: boolean }[];
  }) => (
    <div className="flex items-center gap-3 rounded-lg bg-muted/30 border border-border/40 px-3 py-2">
      <span className="text-sm font-semibold text-foreground w-20 shrink-0">{name}</span>
      <div className="flex items-center gap-2 flex-wrap">
        {results.map((r) => (
          <span
            key={r.platform}
            className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${r.ok
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
              : "bg-red-50 text-red-500 border border-red-200/60"
              }`}
          >
            {r.platform} {r.ok ? "\u2713" : "\u2717"}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <MaxWidthWrapper className="flex flex-col justify-center items-center pt-36 md:pt-50 relative z-10">
      {/* Punch line */}
      <AnimationContainer delay={0.1}>
        <p className="text-center text-3xl md:text-5xl leading-tight font-medium font-heading text-foreground mt-6">
          Finding a name used to take days{" "}
          <br/>
          <span className="bg-linear-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            now it takes minutes.
          </span>
        </p>
      </AnimationContainer>

      {/* Visual comparison */}
      <AnimationContainer delay={0.2}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 max-w-5xl mx-auto items-start">
          {/* Old way — chaotic browser tabs */}
          <div className="relative h-80 md:h-96">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-6">
              Without KatanaID
            </p>
            <div className="relative h-full">
              {/* Stacked browser tab mockups */}
              <BrowserTab url="namecheap.com" className="absolute top-0 left-2 rotate-[-3deg] z-[1] opacity-70" />
              <BrowserTab url="github.com/ruffle" className="absolute top-8 left-8 rotate-[2deg] z-[2] opacity-75" />
              <BrowserTab url="twitter.com/ruffle" className="absolute top-16 right-4 rotate-[-1.5deg] z-[3] opacity-80" />
              <BrowserTab url="npmjs.com/ruffle" className="absolute top-28 left-0 rotate-[1deg] z-[4] opacity-80" />
              <BrowserTab url="instagram.com/ruffle" className="absolute top-40 left-10 rotate-[-2deg] z-[5] opacity-85" />
              <BrowserTab url="google.com/search?q=ruffle" className="absolute top-52 right-2 rotate-[1.5deg] z-[6] opacity-90" />
              {/* Tab counter */}
              <div className="absolute bottom-60 left-1/2 -translate-x-1/2 bg-card border border-border/60 rounded-full px-4 py-1.5 shadow-lg z-10">
                <span className="text-xs font-mono">16 tabs open...</span>
              </div>
            </div>
          </div>

          {/* New way — single clean input + results */}
          <div className="relative h-80 md:h-96">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-6">
              With KatanaID
            </p>
            <div className="rounded-xl border border-primary/20 bg-card p-5 shadow-lg ring-1 ring-primary/5">
              {/* Fake input */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex-1 h-9 rounded-lg bg-muted/50 border border-border/60 px-3 flex items-center">
                  <span className="text-sm text-muted-foreground">Tinder for dog lovers</span>
                </div>
                <div className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-sm flex items-center font-medium">
                  Check
                </div>
              </div>
              {/* Fake results */}
              <div className="space-y-2">
                <ResultRow name="Ruffle" results={[
                  { platform: ".com", ok: true },
                  { platform: ".dev", ok: true },
                  { platform: "GH", ok: true },
                  { platform: "npm", ok: false },
                  { platform: "X", ok: false },
                  { platform: "IG", ok: true },
                ]} />
                <ResultRow name="Pawmatch" results={[
                  { platform: ".com", ok: false },
                  { platform: ".dev", ok: true },
                  { platform: "GH", ok: true },
                  { platform: "npm", ok: true },
                  { platform: "X", ok: true },
                  { platform: "IG", ok: true },
                ]} />
                <ResultRow name="Snoutdate" results={[
                  { platform: ".com", ok: true },
                  { platform: ".dev", ok: true },
                  { platform: "GH", ok: true },
                  { platform: "npm", ok: true },
                  { platform: "X", ok: true },
                  { platform: "IG", ok: true },
                ]} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-4 text-center">3 names generated, 18 checks completed in 2.4s</p>
            </div>
          </div>
        </div>
      </AnimationContainer>
    </MaxWidthWrapper>)

}