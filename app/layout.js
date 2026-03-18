import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Nav from "../components/Nav";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "Climate Lens — Green Infrastructure Impact Database",
  description: "Helping conservatory nonprofits prove their environmental impact with real data. Educational climate justice database for communities, teachers, and advocates.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Nav />
        {children}
        <footer className="footer">
          <div className="container">
            <p>Climate Lens — Open-source environmental justice data for everyone.</p>
            <p style={{ marginTop: 4 }}>Data from EPA, NOAA, FEMA, Open-Meteo. Free forever.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
