import logo from "/logo.svg";

const Logo = () => {
  return (
    <img
      src={logo}
      className="size-12 p-1 hover:bg-accent/90 rounded-md transition-all"
    />
  );
};

export default Logo;
