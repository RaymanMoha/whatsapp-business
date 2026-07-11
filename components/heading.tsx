import { HeadingProps } from "@/types";
import React from "react";

export default function Heading({ title, description }: HeadingProps) {
   return (
      <div>
         <h1
            className="font-calson-font text-2xl md:text-4xl font-semibold heading-1 tracking-wider"
            style={{ fontFamily: "var(--calson-font)" }}>
            {title}
         </h1>
         {description ? (
            <p className="mt-2 text-black text-md max-w-5xl">{description}</p>
         ) : null}
      </div>
   );
}
