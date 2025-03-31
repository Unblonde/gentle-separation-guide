
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GOVUKLayout from '../components/GOVUKLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Github, Mail } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signIn('email', email, password);
    setIsSubmitting(false);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await signUp(email, password, fullName);
    setIsSubmitting(false);
  };

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setIsSubmitting(true);
    await signIn(provider);
    setIsSubmitting(false);
  };

  // For demo purposes
  const signInAsDemo = async (email: string, password: string) => {
    setIsSubmitting(true);
    await signIn('email', email, password);
    setIsSubmitting(false);
  };

  return (
    <GOVUKLayout>
      <div className="max-w-md mx-auto">
        <h1>Sign in or create an account</h1>
        <p className="text-xl mb-6">
          Access your co-parenting tools and information.
        </p>

        <div className="bg-white border border-gray-300 p-6 rounded-md mb-6">
          <Tabs defaultValue="signin">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Create Account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block mb-1">Email address</label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block mb-1">Password</label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  className="govuk-button w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block mb-1">Full Name</label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-email" className="block mb-1">Email address</label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="signup-password" className="block mb-1">Password</label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button 
                  className="govuk-button w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating account...' : 'Create account'}
                </button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6 pt-6 border-t border-gray-300">
            <p className="text-center text-sm text-gray-600 mb-4">Or continue with</p>
            <div className="grid grid-cols-2 gap-4">
              <button 
                className="flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-50"
                onClick={() => handleOAuthSignIn('google')}
                disabled={isSubmitting}
              >
                <Mail className="h-5 w-5 mr-2" />
                Google
              </button>
              <button 
                className="flex items-center justify-center border border-gray-300 p-2 rounded-md hover:bg-gray-50"
                onClick={() => handleOAuthSignIn('github')}
                disabled={isSubmitting}
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </button>
            </div>
          </div>
        </div>

        <div className="bg-govuk-light-blue border-l-4 border-govuk-blue p-4">
          <h2 className="text-lg font-bold mb-2">Demo accounts</h2>
          <p className="mb-4">Try out the app with these demo accounts:</p>
          <div className="grid gap-2">
            <button 
              className="border border-govuk-blue bg-white p-2 rounded text-sm hover:bg-gray-50"
              onClick={() => signInAsDemo('parent1@example.com', 'password123')}
              disabled={isSubmitting}
            >
              Sign in as Parent A
            </button>
            <button 
              className="border border-govuk-blue bg-white p-2 rounded text-sm hover:bg-gray-50"
              onClick={() => signInAsDemo('parent2@example.com', 'password123')}
              disabled={isSubmitting}
            >
              Sign in as Parent B
            </button>
          </div>
          <p className="text-xs mt-2">Note: These are for demonstration purposes only.</p>
        </div>
      </div>
    </GOVUKLayout>
  );
};

export default Auth;
