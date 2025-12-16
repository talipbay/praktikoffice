import { About } from "@/components/about";
import { Amenities } from "@/components/amenities";
import { Footer } from "@/components/footer";
import { Gallery } from "@/components/gallery";
import { Hero } from "@/components/hero";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Gallery />
      <Amenities />
    </>
  );
}
