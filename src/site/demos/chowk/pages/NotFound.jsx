import { Link } from "react-router-dom";
import { href } from "../base.js";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-start px-4 py-32 sm:px-8">
      <p className="tnum text-[15px] text-(--c-muted)">404</p>
      <h1 className="mt-3 text-[44px] sm:text-[56px]">This plate is empty.</h1>
      <p className="mt-4 text-[17px] text-(--c-muted)">The page you opened does not exist, or the kitchen has moved. Head back and pick something else.</p>
      <Link to={href("/")} className="mt-8 rounded-lg bg-(--c-accent) px-6 py-3 text-[15px] font-semibold text-(--c-on-accent) hover:bg-(--c-accent-ink)">
        Back to all kitchens
      </Link>
    </div>
  );
}
