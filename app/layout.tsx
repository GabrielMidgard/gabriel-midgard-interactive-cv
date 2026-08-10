import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gabriel Vázquez Ruiz | Full Stack Developer",
  description: "Currículum interactivo de Gabriel Vázquez Ruiz: desarrollo full stack, liderazgo y ocho años creando productos digitales.",
  icons: { icon: "/favicon.svg" },
  metadataBase: new URL("https://gabriel-vazquez-ruiz.pages.dev"),
  openGraph: {
    title: "Gabriel Vázquez Ruiz | Full Stack Developer",
    description: "Una travesía interactiva por ocho años de desarrollo, liderazgo y productos digitales.",
    images: ["/og.png"],
    locale: "es_MX",
    type: "website",
  },
  twitter: { card: "summary_large_image", images: ["/og.png"] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}
