import { Link } from "react-router-dom";
import PageMeta from "../../components/common/PageMeta";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
  .jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
  
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-up { animation: fadeUp 0.5s ease both; }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  .float { animation: float 3s ease-in-out infinite; }
`;

// Simple GridShape untuk background
function GridShape() {
  return (
    <>
      <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px] opacity-30">
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
      <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px] opacity-30">
        <img src="/images/shape/grid-01.svg" alt="grid" />
      </div>
    </>
  );
}

export default function NotFound() {
  return (
    <>
      <style>{css}</style>
      <PageMeta
        title="404 - Page Not Found | ParkiRent Dashboard"
        description="Halaman 404 ParkiRent Dashboard - Halaman tidak ditemukan"
      />

      <div className="jakarta relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-neutral-50 via-white to-brand-50/30 p-6 overflow-hidden">
        <GridShape />

        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px] fade-up">
          {/* Error Heading */}
          <h1 className="mb-4 font-normal text-brand-600 text-3xl xl:text-5xl">
            ERROR
          </h1>

          {/* 404 Image */}
          <div className="float mb-8">
            <img
              src="/images/error/404.svg"
              alt="404"
              className="mx-auto dark:hidden w-full max-w-[400px]"
            />
            <img
              src="/images/error/404-dark.svg"
              alt="404"
              className="mx-auto hidden dark:block w-full max-w-[400px]"
            />
          </div>

          {/* Error Message */}
          <p className="mb-8 text-base text-neutral-500 dark:text-neutral-400 sm:text-lg font-medium">
            We can't seem to find the page you are looking for!
          </p>

          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-200 transition-all duration-200 hover:bg-brand-700 hover:shadow-xl hover:shadow-brand-300 hover:-translate-y-0.5 active:translate-y-0 dark:bg-brand-600 dark:hover:bg-brand-700 dark:shadow-brand-900/20"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>
        </div>

        {/* Footer */}
        <p className="absolute text-sm text-center text-neutral-400 -translate-x-1/2 bottom-6 left-1/2 dark:text-neutral-500">
          &copy; {new Date().getFullYear()} - ParkiRent Dashboard
        </p>
      </div>
    </>
  );
}
