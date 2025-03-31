
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import GOVUKLayout from "../components/GOVUKLayout";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <GOVUKLayout>
      <div className="max-w-3xl">
        <h1>Page not found</h1>
        <p className="text-xl mb-6">If you typed the web address, check it is correct.</p>
        <p className="mb-6">If you pasted the web address, check you copied the entire address.</p>
        <p className="mb-6">
          <Link to="/" className="text-govuk-blue hover:underline">
            Return to the home page
          </Link>
        </p>
      </div>
    </GOVUKLayout>
  );
};

export default NotFound;
