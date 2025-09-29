// import { Poppins } from "next/font/google";
// import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/public/e-logo.svg"

// const font = Poppins({
//   subsets: ['latin'],
//   weight: ["400"]
// })

interface HeaderProps {
  label: string
}

export const Header = ({
  label
} : HeaderProps) => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* <h1 className={cn("text-3xl font-semibold drop-shadow-md", font)}>
        eTravelOrder
      </h1> */}
      <Image
        src={logo}
        alt="E-TRAVEL Logo"
        width={150}
        height={150}
        loading="lazy"
      />
      {/* <p className={cn("text-muted-foreground text-sm", font.className)}>{label}</p> */}
    </div>
  );
}