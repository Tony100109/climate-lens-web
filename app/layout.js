import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Climate Lens — Environmental Data Research Tool",
  description: "Open-source tool aggregating EPA, NOAA, and FEMA data into grant reports, classroom activities, and advocacy materials for community organizations.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Nav />
        {children}
        <footer className="footer">
          <div className="container">
            <p>Climate Lens is an open-source research tool. Not affiliated with any government agency.</p>
            <p style={{ marginTop: 3 }}>Data: EPA AirNow, EPA EJScreen, NOAA/ECMWF via Open-Meteo, FEMA NRI, UofR Mapping Inequality.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
