interface Props {
  title: string;
  color1?: string;
  color2?: string;
  color3?: string;
}

const MagicBadge = ({
  title,
  color1 = "#0096FF",
  color2 = "#1434A4",
  color3 = "#6F8FAF",
}: Props) => {
  return (
    <div className="relative inline-flex h-8 overflow-hidden rounded-full p-[1.5px] focus:outline-none select-none">
      <span
        className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite]"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, ${color1} 0%, ${color2} 50%, ${color3} 100%)`,
        }}
      />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-4 py-1 text-sm font-medium text-white backdrop-blur-3xl hover:bg-accent/5 hover:px-8 transition-all">
        {title}
      </span>
    </div>
  );
};

export default MagicBadge;
