import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-8xl font-heading bg-linear-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent italic">404</h1>
      <span className="text-lg">This is weird. <a className="text-muted-foreground text-lg hover:underline" href="">Report issue.</a></span>
      <Button asChild>
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
};

export default NotFoundPage;
