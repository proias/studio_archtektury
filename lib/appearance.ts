import content from "../content/appearance.json";

type Appearance = {
  logo: { title: string; subtitle: string; src: string | null; alt: string };
  hero: {
    src: string | null;
    alt: string;
    objectFit: "contain" | "cover";
    objectPosition: string;
  };
};

export const appearance: Appearance = content as Appearance;
