
import React from 'react';
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';

interface GOVUKLayoutProps {
  children: React.ReactNode;
}

const GOVUKLayout: React.FC<GOVUKLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="govuk-header">
        <div className="govuk-width-container">
          <div className="flex justify-between items-center py-2">
            <div className="flex items-center">
              <Link to="/" className="inline-flex items-center no-underline">
                <span className="text-white font-bold mr-2">GOV.UK</span>
              </Link>
            </div>
            <nav>
              <ul className="flex space-x-6 text-sm">
                <li><Link to="/" className="text-white hover:underline">Home</Link></li>
                <li><Link to="/parenting-plan" className="text-white hover:underline">Parenting plan</Link></li>
                <li><Link to="/finances" className="text-white hover:underline">Financial arrangements</Link></li>
                <li><Link to="/help" className="text-white hover:underline">Get help</Link></li>
                <li><UserMenu /></li>
              </ul>
            </nav>
          </div>
        </div>
      </header>

      <div className="bg-govuk-blue">
        <div className="govuk-width-container">
          <div className="py-4 text-white">
            <h2 className="text-lg font-bold mb-0">Supporting separated families</h2>
          </div>
        </div>
      </div>

      <main className="flex-grow">
        <div className="govuk-width-container py-8">
          {children}
        </div>
      </main>

      <footer className="bg-[#f3f2f1] border-t border-gray-300">
        <div className="govuk-width-container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-govuk-blue hover:underline">Help</a></li>
                <li><a href="#" className="text-govuk-blue hover:underline">Privacy</a></li>
                <li><a href="#" className="text-govuk-blue hover:underline">Cookies</a></li>
                <li><a href="#" className="text-govuk-blue hover:underline">Accessibility statement</a></li>
                <li><a href="#" className="text-govuk-blue hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Related information</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-govuk-blue hover:underline">Child Maintenance Service</a></li>
                <li><a href="#" className="text-govuk-blue hover:underline">Court and tribunal guidance</a></li>
                <li><a href="#" className="text-govuk-blue hover:underline">Mediation services</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Need urgent help?</h3>
              <p>Call the National Domestic Abuse Helpline (24 hours)</p>
              <p className="font-bold text-lg">0808 2000 247</p>
              <p>In an emergency, always call 999</p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-300">
            <p className="text-sm text-gray-600">&copy; Crown copyright</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default GOVUKLayout;
