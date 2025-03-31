
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import GOVUKLayout from '../components/GOVUKLayout';
import { useAuth } from '@/contexts/AuthContext';
import { acceptInvitation } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';

const Invite = () => {
  const { token } = useParams<{ token: string }>();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAccepting, setIsAccepting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      // Store token in session storage and redirect to auth
      if (token) {
        sessionStorage.setItem('invitationToken', token);
      }
      navigate('/auth');
    }
  }, [user, loading, token, navigate]);

  const handleAcceptInvitation = async () => {
    if (!user || !token) return;
    
    setIsAccepting(true);
    try {
      await acceptInvitation(token, user.id, 'Parent B');
      
      toast({
        title: "Invitation accepted",
        description: "You have successfully joined the family unit.",
      });
      
      navigate('/');
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast({
        title: "Error accepting invitation",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <GOVUKLayout>
      <div className="max-w-3xl mx-auto">
        <h1>Co-parent Invitation</h1>
        <p className="text-xl mb-6">
          You have been invited to join a family unit to coordinate co-parenting arrangements.
        </p>

        <div className="bg-white border border-gray-300 p-6 rounded-md">
          <h2 className="text-xl font-bold mb-4">Join Family Unit</h2>
          <p className="mb-6">
            By accepting this invitation, you'll be able to collaborate on parenting plans, 
            financial arrangements, and holiday schedules with your co-parent.
          </p>
          
          <button 
            className="govuk-button"
            onClick={handleAcceptInvitation}
            disabled={isAccepting}
          >
            {isAccepting ? 'Accepting...' : 'Accept Invitation'}
          </button>
          
          <button 
            className="govuk-button bg-white text-govuk-blue border border-govuk-blue hover:bg-govuk-light-blue ml-4"
            onClick={() => navigate('/')}
          >
            Decline
          </button>
        </div>
      </div>
    </GOVUKLayout>
  );
};

export default Invite;
