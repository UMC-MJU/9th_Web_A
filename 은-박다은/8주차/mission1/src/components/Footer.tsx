import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="w-full bg-[#141414] text-gray-400 text-center py-6 mt-16">
      <p className="text-sm">
        © {new Date().getFullYear()} 돌려돌려LP판. All rights reserved.
      </p>
      <div className="space-x-4 mt-2 text-sm">
        <Link to="#">Privacy Policy</Link>
        <Link to="#">Terms of Service</Link>
        <Link to="#">Contact</Link>
      </div>
    </footer>
  );
};

export default Footer;
