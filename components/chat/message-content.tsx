import Link from "next/link";

const LINK_PATTERN = /(https?:\/\/[^\s]+|\/dashboard(?:\/[a-z0-9-]+)?)/gi;

export function MessageContent({ content }: { content: string }) {
   const parts = content.split(LINK_PATTERN);

   return (
      <div className="whitespace-pre-wrap break-words leading-6">
         {parts.map((part, index) => {
            if (!part) return null;
            if (part.startsWith("/dashboard")) {
               return (
                  <Link
                     key={`${part}-${index}`}
                     href={part}
                     className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-800 underline decoration-emerald-300 underline-offset-2 transition hover:bg-emerald-100">
                     {part}
                  </Link>
               );
            }
            if (/^https?:\/\//i.test(part)) {
               return (
                  <a
                     key={`${part}-${index}`}
                     href={part}
                     target="_blank"
                     rel="noreferrer"
                     className="font-semibold text-emerald-800 underline underline-offset-2">
                     {part}
                  </a>
               );
            }
            return <span key={index}>{part}</span>;
         })}
      </div>
   );
}
