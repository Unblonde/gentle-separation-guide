
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Handle the OAuth callback
        const { error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        toast({
          title: "Successfully signed in",
          description: "You have been successfully signed in with your social account.",
        });
        
        navigate('/');
      } catch (error: any) {
        console.error('Error during auth callback:', error);
        toast({
          title: "Error during authentication",
          description: error.message,
          variant: "destructive",
        });
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-4">Completing authentication...</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-govuk-blue"></div>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
