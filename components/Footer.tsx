// components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      className="
      mt-8 
      border-t border-white/10 
      bg-gray-950/60 
      backdrop-blur-md 
      text-gray-400 
      py-10
    "
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-12">
        
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">

          {/* Branding */}
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-400 to-indigo-400 text-transparent bg-clip-text">
              Phexara
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-xs">
              Explore AI-generated art and the prompts that created them.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col">
            <h3 className="text-sm font-semibold text-white mb-3">Follow Us</h3>

            <div className="flex items-center gap-5">

              {/* Instagram */}
              <Link
                href="https://instagram.com/phexara6/"
                target="_blank"
                className="hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="3.5" />
                  <circle cx="17" cy="7" r="1" />
                </svg>
              </Link>

              {/* Twitter / X */}
              <Link
                href="https://twitter.com/phexara6"
                target="_blank"
                className="hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M4 4l7 7m0 0l9-9M11 11l9 9M11 11l-9 9" />
                </svg>
              </Link>

              {/* Facebook */}
              <Link
                href="https://www.facebook.com/profile.php?id=61585266861855"
                target="_blank"
                className="hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M9 8h3V5.5A3.5 3.5 0 0 1 15.5 2H17v3h-1.5c-.3 0-.5.2-.5.5V8h3l-.5 3h-2.5v9h-3v-9H9V8z" />
                </svg>
              </Link>

              {/* YouTube */}
              <Link
                href="https://youtube.com/@phexara"
                target="_blank"
                className="hover:text-white transition-colors"
                aria-label="YouTube"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="2" y="5" width="20" height="14" rx="4" />
                  <path d="M10 9l5 3-5 3V9z" />
                </svg>
              </Link>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mt-10 border-t border-white/5 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Phexara. All rights reserved.
        </div>

        {/* Created By Line */}
        <div className="mt-2 text-center text-xs text-gray-400">
          Created by <span className="text-pink-400 font-semibold">Kissi</span> ❤️
        </div>

      </div>
    </footer>
  );
}
