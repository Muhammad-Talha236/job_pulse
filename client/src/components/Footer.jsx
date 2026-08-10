// src/components/Footer.jsx

import { Zap } from "lucide-react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";

import { Link } from "react-router-dom";

const footerLinks = {
  Product: [
    {
      label: "Features",
      href: "#features",
    },
    {
      label: "How It Works",
      href: "#how-it-works",
    },
    {
      label: "Get Started",
      to: "/login",
    },
  ],

  Resources: [
    {
      label: "Documentation",
      href: "#",
    },
    {
      label: "FAQ",
      href: "#",
    },
    {
      label: "Support",
      href: "#",
    },
  ],

  Company: [
    {
      label: "About",
      href: "#about",
    },
    {
      label: "Contact",
      href: "#contact",
    },
  ],
};

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-5">

          {/* Brand */}
          <div className="lg:col-span-2">

            <Link
              to="/"
              className="inline-flex items-center gap-2 text-xl font-bold text-slate-900"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Zap size={20} />
              </span>

              <span>
                Job<span className="text-blue-600">Pulse</span>
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              A smarter workspace for discovering, organizing, and tracking
              job opportunities from multiple sources.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">

              {/* GitHub */}
              <a
                href="#"
                aria-label="GitHub"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faGithub} size="lg" />
              </a>

              {/* Twitter */}
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faTwitter} size="lg" />
              </a>

              {/* LinkedIn */}
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
              >
                <FontAwesomeIcon icon={faLinkedin} size="lg" />
              </a>

            </div>
          </div>

          {/* Link Groups */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>

              <h3 className="text-sm font-semibold text-slate-900">
                {title}
              </h3>

              <ul className="mt-4 space-y-3">

                {links.map((link) => (
                  <li key={link.label}>

                    {link.to ? (
                      <Link
                        to={link.to}
                        className="text-sm text-slate-600 transition-colors hover:text-blue-600"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-slate-600 transition-colors hover:text-blue-600"
                      >
                        {link.label}
                      </a>
                    )}

                  </li>
                ))}

              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col gap-4 border-t border-slate-200 pt-8 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} JobPulse. All rights reserved.
          </p>

          <div className="flex items-center gap-5">

            <a
              href="#"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Privacy
            </a>

            <a
              href="#"
              className="text-sm text-slate-500 transition-colors hover:text-slate-900"
            >
              Terms
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;