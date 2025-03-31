
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GOVUKLayout from '../components/GOVUKLayout';
import { useAuth } from '@/contexts/AuthContext';
import { getProfile, updateProfile, getFamilyForUser, createFamily, invitePartner } from '@/services/supabaseService';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Profile = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [family, setFamily] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [partnerEmail, setPartnerEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [invitationToken, setInvitationToken] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    const loadUserData = async () => {
      if (user) {
        try {
          // Load user profile
          const profileData = await getProfile(user.id);
          setProfile(profileData);
          setFullName(profileData.full_name || '');
          
          // Load family data
          const familyData = await getFamilyForUser(user.id);
          setFamily(familyData);
        } catch (error: any) {
          console.error('Error loading user data:', error);
          toast({
            title: "Error loading profile",
            description: error.message,
            variant: "destructive",
          });
        }
      }
    };

    loadUserData();
  }, [user, loading, navigate, toast]);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      await updateProfile(user.id, {
        full_name: fullName,
        updated_at: new Date().toISOString(),
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Refresh profile data
      const profileData = await getProfile(user.id);
      setProfile(profileData);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateFamily = async () => {
    if (!user) return;
    
    setIsSaving(true);
    try {
      const familyId = await createFamily(user.id, 'Parent A');
      
      toast({
        title: "Family created",
        description: "Your family unit has been created successfully.",
      });
      
      // Refresh family data
      const familyData = await getFamilyForUser(user.id);
      setFamily(familyData);
    } catch (error: any) {
      console.error('Error creating family:', error);
      toast({
        title: "Error creating family",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInvitePartner = async () => {
    if (!user || !family) return;
    
    setIsInviting(true);
    try {
      const token = await invitePartner(family.family_id, partnerEmail, user.id);
      
      toast({
        title: "Invitation sent",
        description: "An invitation has been sent to your partner.",
      });
      
      setInvitationToken(token);
      setPartnerEmail('');
    } catch (error: any) {
      console.error('Error inviting partner:', error);
      toast({
        title: "Error inviting partner",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsInviting(false);
    }
  };

  if (loading) {
    return (
      <GOVUKLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-govuk-blue"></div>
        </div>
      </GOVUKLayout>
    );
  }

  return (
    <GOVUKLayout>
      <div className="max-w-3xl">
        <h1>Your Profile</h1>
        <p className="text-xl mb-6">
          Manage your account and family settings.
        </p>

        <div className="grid gap-8">
          <div className="bg-white border border-gray-300 p-6">
            <h2 className="text-xl font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block mb-1">Email address</label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">Your email cannot be changed.</p>
              </div>
              <div>
                <label htmlFor="fullName" className="block mb-1">Full Name</label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </div>

          <div className="bg-white border border-gray-300 p-6">
            <h2 className="text-xl font-bold mb-4">Family Settings</h2>
            
            {!family ? (
              <div>
                <p className="mb-4">You haven't created a family unit yet. Create one to start setting up co-parenting arrangements.</p>
                <Button 
                  onClick={handleCreateFamily}
                  disabled={isSaving}
                >
                  {isSaving ? 'Creating...' : 'Create Family Unit'}
                </Button>
              </div>
            ) : (
              <div>
                <p className="mb-4">You are part of a family unit. You can invite your co-parent to join and collaborate on arrangements.</p>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="partnerEmail" className="block mb-1">Co-parent's Email</label>
                    <Input
                      id="partnerEmail"
                      type="email"
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="Enter your co-parent's email"
                    />
                  </div>
                  <Button 
                    onClick={handleInvitePartner}
                    disabled={isInviting || !partnerEmail}
                  >
                    {isInviting ? 'Sending Invitation...' : 'Send Invitation'}
                  </Button>
                  
                  {invitationToken && (
                    <div className="mt-4 p-4 bg-govuk-light-blue border-l-4 border-govuk-blue">
                      <p className="font-bold">Invitation link:</p>
                      <p className="text-sm break-all">
                        {`${window.location.origin}/invite/${invitationToken}`}
                      </p>
                      <p className="text-xs mt-2">
                        Share this link with your co-parent. In a real app, an email would be sent automatically.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </GOVUKLayout>
  );
};

export default Profile;
