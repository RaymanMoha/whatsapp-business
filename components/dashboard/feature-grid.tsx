import { FeatureCard } from "./feature-card";
import { features } from "@/constants";

export function FeatureGrid() {
   return (
      <section className="grid gap-2 lg:gap-8 md:grid-cols-2 lg:grid-cols-4 pt-6">
         {features.map((f) => (
            <FeatureCard key={f.title} feature={f} />
         ))}
      </section>
   );
}
