import { useLocation } from "use-navigation-api";

type MemoryPaneProps = {
  title: string;
  linkId: string;
  urlId: string;
  href: string;
};

export function MemoryPane({ title, linkId, urlId, href }: MemoryPaneProps) {
  const url = useLocation();
  return (
    <section>
      <h2>{title}</h2>
      <p>
        URL: <code id={urlId}>{url}</code>
      </p>
      <nav>
        <a href={href} id={linkId}>
          {title} Link
        </a>
      </nav>
    </section>
  );
}
