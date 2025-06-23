import { NextPage } from "next";
import Head from "next/head";
import "./style.css";
import Link from "next/link";

const HelpCenter: NextPage = () => {
  return (

      <div className="help-container">
        <Head>
          <title>Help Center | Highfield Academy</title>
        </Head>
        <main className="flex bg-gray-50">
          {/* Content */}
          <section className="flex-1 p-8">
            <h1 className="text-2xl font-bold mb-4">Help Center</h1>
            <p className="text-gray-600 mb-6">
              Browse common questions, contact support, or access documentation
              and tutorials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">FAQs</h2>
                <p className="text-sm text-gray-600">
                  Find answers to the most frequently asked questions.
                </p>
                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  Browse FAQs →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Contact Support</h2>
                <p className="text-sm text-gray-600">
                  Need help with a specific issue? Get in touch with our support
                  team.
                </p>
                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  Contact Us →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Documentation</h2>
                <p className="text-sm text-gray-600">
                  Read detailed guides and documentation about using the
                  platform.
                </p>
                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  View Docs →
                </Link>
              </div>

              <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-2">Tutorials</h2>
                <p className="text-sm text-gray-600">
                  Watch video tutorials to get the most out of your learning
                  experience.
                </p>
                <Link
                  href="#"
                  className="text-blue-600 text-sm mt-2 inline-block"
                >
                  Watch Tutorials →
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
  );
};

export default HelpCenter;
