import { Link } from "react-router-dom";
import { Home, SearchX } from "lucide-react";

function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        <SearchX size={30} />
      </div>

      <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-950">
        404
      </h1>

      <p className="mt-2 text-lg font-semibold text-slate-800">
        Page not found
      </p>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        The page you're looking for doesn't exist or may have
        been moved.
      </p>

      <Link
        to="/"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-600"
      >
        <Home size={17} />
        Back to Home
      </Link>
    </div>
  );
}

export default NotFoundPage;