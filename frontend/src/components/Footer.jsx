export default function Footer() {
  return (
    <footer className="bg-green-700 text-white py-2 w-full mt-auto">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="text-center md:text-left mb-4 md:mb-0">
          <h3 className="text-lg font-semibold">Smart Farm Machinery Rental</h3>
          <p className="text-sm">
            Empowering farmers with affordable technology
          </p>
        </div>

        <div className="text-center text-sm">
          <p>
            📧{" "}
            <a href="mailto:info@farmease.com" className="underline">
              info@farmease.com
            </a>
          </p>
          <p>📞 +91 98765 43210</p>
          <p>
            🌐{" "}
            <a
              href="https://github.com/your-github-username/smartfarm"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              GitHub Repository
            </a>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-gray-200 mt-4">
        © {new Date().getFullYear()} FarmEase. All rights reserved.
      </div>
    </footer>
  );
}
