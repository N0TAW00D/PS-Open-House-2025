import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import Image from "next/image";


export default function Header() {
  return (
    <div className="flex flex-col gap-16 items-center">
      <div className="overflow-hidden">
        <Image
          src="/image/psopehouse_banner.jpg"
          alt="Logo Icon"
          width={800}
          height={450}
          priority
          className="rounded-lg" // More curve with a larger border radius
        />
      </div>
      
      

      <h1 className="text-xl lg:text-3xl !leading-tight mx-auto max-w-xl text-center text-blue-700">
        <a
          href="www.ps.ac.th"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          PS OPENHOUSE 2025
        </a>
      </h1>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
