import type { Metadata } from "next";
import "./globals.css";
import { Roboto } from "next/font/google";
import { cn } from "@/lib/utils";
import { Toaster } from "@/shared/ui/toast";

const roboto = Roboto({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "CV Builder",
  description: "Конструктор резюме",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={cn("font-sans", roboto.variable)}>
      <body>{children}</body>
      <Toaster />
    </html>
  );
}
