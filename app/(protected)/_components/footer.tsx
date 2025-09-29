import Link from "next/link";

export const Footer = () =>  {
  return (
    <footer className="flex flex-col items-center justify-center bg-gray-300 text-gray-600 sticky bottom-0 left-0 right-0 py-4 border-t border-gray-200">
      <div className="flex items-center space-x-4 mb-2">
        <p className="text-sm">
          Copyright © 2025 Schools Division of Nueva Vizcaya Made by Digital
          Innovations Group.{" "}
          <Link href="/privacy" className="underline hover:text-gray-900">
            Privacy Policy
          </Link>
        </p>
      </div>
    </footer>
  );
}