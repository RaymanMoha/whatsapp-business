import Image from "next/image";
import type { ComponentProps } from "react";

import AppBaseColor from "@/public/appbase-logo-color.png";
import AppBaseGreen from "@/public/appbase-logo-green.png";
import AppBaseWhite from "@/public/appbase-logo-white.png";

const logoByVariant = {
   color: AppBaseColor,
   green: AppBaseGreen,
   white: AppBaseWhite,
} as const;

type BrandLogoProps = {
   variant?: keyof typeof logoByVariant;
   priority?: boolean;
   className?: string;
   sizes?: string;
} & Pick<ComponentProps<typeof Image>, "quality">;

export function BrandLogo({
   variant = "color",
   priority = false,
   className = "h-auto w-24",
   sizes = "112px",
   quality = 90,
}: BrandLogoProps) {
   return (
      <Image
         src={logoByVariant[variant]}
         alt="AppBase"
         className={className}
         sizes={sizes}
         quality={quality}
         priority={priority}
      />
   );
}
