
import "../globals.css";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Header } from "../../components/header/Header";
import Sidebar from "../../components/aside/Sidebar";
config.autoAddCss = false;
import { Inter } from "next/font/google";
import AuthChecker from "@/components/AuthChecker";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthChecker>
          <div className="all-x">
            <Header />
            <Sidebar />
            <div className="x-container">{children}</div>
            <footer className="bg-gray-800 text-white py-6 text-center">
              <p>
                &copy; {new Date().getFullYear()} Educational Academy. All
                rights reserved.
              </p>
            </footer>
          </div>
        </AuthChecker>
      </body>
    </html>
  );
}
