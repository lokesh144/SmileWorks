import { services } from "@/data/services";

/** In-page navigation to each service section. Wraps instead of scrolling horizontally. */
export function ServiceNav() {
  return (
    <nav aria-label="Services on this page" className="border-b border-line bg-white/95 backdrop-blur-xl lg:sticky lg:top-16 lg:z-30">
      <ul className="container-site flex flex-wrap gap-2 py-4">
        {services.map((service, index) => (
          <li key={service.id}>
            <a
              href={`#${service.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink/80 transition-colors hover:border-ink/40 hover:text-ink"
            >
              <span aria-hidden="true" className="font-display text-xs font-extrabold text-ink/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              {service.cardTitle}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
