import { Link } from "react-router-dom";
import { Icon, Photo, Rating } from "./ui";
import { href } from "../base.js";

export default function RestaurantCard({ r, size = "md" }) {
  const big = size === "lg";
  return (
    <Link to={href(`/restaurant/${r.id}`)} className="group block rounded-xl outline-offset-4" aria-label={`${r.name}, rated ${r.rating}, ${r.time} minutes`}>
      <div className={`relative overflow-hidden rounded-xl bg-(--c-surface) ${big ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
        <Photo k={r.img} w={big ? 640 : 560} alt="" label={r.name} className="h-full w-full transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" />
        <div className="absolute inset-x-0 bottom-0 bg-black/55 px-4 py-2.5">
          <p className="truncate text-[15px] font-bold uppercase tracking-[0.04em] text-white">{r.offer}</p>
        </div>
        {r.veg && (
          <span className="absolute left-3 top-3 rounded-full bg-(--c-card) px-2.5 py-1 text-[12px] font-semibold text-(--c-veg)">Pure veg</span>
        )}
      </div>
      <div className="px-1 pt-3.5">
        <h3 className={`truncate ck-text font-bold tracking-[-0.01em] ${big ? "text-[20px]" : "text-[18px]"}`}>{r.name}</h3>
        <p className="tnum mt-1 flex items-center gap-2 text-[15px] font-semibold">
          <Rating value={r.rating} />
          <span className="flex items-center gap-1">
            <Icon name="clock" className="h-4 w-4 text-(--c-muted)" />
            {r.time}-{r.time + 8} min
          </span>
        </p>
        <p className="mt-1.5 truncate text-[15px] text-(--c-muted)">{r.cuisines.join(", ")}</p>
        <p className="tnum truncate text-[15px] text-(--c-muted)">
          {r.area}, {r.distance} km
        </p>
      </div>
    </Link>
  );
}
