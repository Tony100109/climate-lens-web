import { Piazzolla, Rubik } from "next/font/google";
import "./globals.css";
import "./theme.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

// Loaded through next/font so they are self-hosted; a remote @import in CSS is ignored by Next.
const piazzolla = Piazzolla({ variable: "--font-piazzolla", subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"] });
const rubik = Rubik({ variable: "--font-rubik", subsets: ["latin"], weight: ["300", "400", "500", "600"] });

export const metadata = {
  title: "Climate Lens — Environmental Data for Community Action",
  description: "Open-source tool turning public air-quality, weather and environmental-justice data into grant reports, classroom activities, and advocacy materials for nonprofits and community organizations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${piazzolla.variable} ${rubik.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
