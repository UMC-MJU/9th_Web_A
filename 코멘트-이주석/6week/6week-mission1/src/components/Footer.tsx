import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="flex justify-between items-center px-8 py-4 bg-[#141414] text-white z-[10] relative">
      <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
        <p>
          &copy;{new Date().getFullYear()} Spining Spining Dolimpan. All rights
          reserved.
        </p>
        <div className="flex justify-center space-x-4 mt-4">
          <Link to="#">Privacy Policy</Link>
          <Link to="#">Terms of Service</Link>
          <Link to="#">Contact</Link>
        </div>
      </div>
    </footer>
  );
};
