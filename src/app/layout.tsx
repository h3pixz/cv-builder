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

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem("theme");
    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    var isDark = stored === "dark" || (stored !== "light" && prefersDark);
    document.documentElement.classList.toggle("dark", isDark);
  } catch (error) {}
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={cn("font-sans", roboto.variable)}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
