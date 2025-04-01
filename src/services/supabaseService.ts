
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { FamilyData } from '@/types/family';
import { mapChatMessageToMessage } from '@/types/message';

// Define a type for Supabase service functions
type SupabaseTable = 'profiles' | 'family_units' | 'family_members' | 'invitations' | 
                     'financial_arrangements' | 'holiday_arrangements' | 'chat_messages';

// Profile services
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles' as SupabaseTable)
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  
  return data;
};

export const updateProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles' as SupabaseTable)
    .update(updates)
    .eq('id', userId);
    
  if (error) throw error;
  
  return data;
};

// Family services
export const getFamilyForUser = async (userId: string): Promise<FamilyData | null> => {
  const { data, error } = await supabase
    .from('family_members' as SupabaseTable)
    .select('family_id, family_units(*)')
    .eq('user_id', userId)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  
  return data as FamilyData | null;
};

export const createFamily = async (userId: string, role: string) => {
  // Create a new family unit
  const { data: familyData, error: familyError } = await supabase
    .from('family_units' as SupabaseTable)
    .insert({})
    .select();
    
  if (familyError) throw familyError;
  
  const familyId = familyData?.[0]?.id;
  
  if (!familyId) {
    throw new Error('Failed to create family unit');
  }
  
  // Add current user as a family member
  const { data: memberData, error: memberError } = await supabase
    .from('family_members' as SupabaseTable)
    .insert({
      user_id: userId,
      family_id: familyId,
      role
    });
    
  if (memberError) throw memberError;
  
  return familyId;
};

// Invitation services
export const invitePartner = async (familyId: string, email: string, invitedBy: string) => {
  const token = uuidv4();
  
  const { data, error } = await supabase
    .from('invitations' as SupabaseTable)
    .insert({
      family_id: familyId,
      invited_by: invitedBy,
      email,
      token
    });
    
  if (error) throw error;
  
  // In a production app, you would send an email with the invitation link
  // For now, we just return the token
  return token;
};

export const acceptInvitation = async (token: string, userId: string, role: string) => {
  // Get the invitation
  const { data: invitation, error: inviteError } = await supabase
    .from('invitations' as SupabaseTable)
    .select('*')
    .eq('token', token)
    .eq('status', 'pending')
    .single();
    
  if (inviteError) throw inviteError;
  
  if (!invitation) throw new Error('Invitation not found or already accepted');
  
  // Add user to the family
  const { data: memberData, error: memberError } = await supabase
    .from('family_members' as SupabaseTable)
    .insert({
      user_id: userId,
      family_id: invitation.family_id,
      role
    });
    
  if (memberError) throw memberError;
  
  // Update invitation status
  const { data, error } = await supabase
    .from('invitations' as SupabaseTable)
    .update({ status: 'accepted' })
    .eq('id', invitation.id);
    
  if (error) throw error;
  
  return invitation.family_id;
};

// Financial arrangements services
export const getFinancialArrangements = async (familyId: string) => {
  const { data, error } = await supabase
    .from('financial_arrangements' as SupabaseTable)
    .select('*')
    .eq('family_id', familyId)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  
  return data;
};

export const addFinancialArrangement = async (arrangement: any) => {
  const { data, error } = await supabase
    .from('financial_arrangements' as SupabaseTable)
    .insert(arrangement)
    .select();
    
  if (error) throw error;
  
  return data?.[0];
};

export const updateFinancialArrangement = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('financial_arrangements' as SupabaseTable)
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  
  return data?.[0];
};

// Holiday arrangements services
export const getHolidayArrangements = async (familyId: string) => {
  const { data, error } = await supabase
    .from('holiday_arrangements' as SupabaseTable)
    .select('*')
    .eq('family_id', familyId)
    .order('start_date', { ascending: true });
    
  if (error) throw error;
  
  return data;
};

export const addHolidayArrangement = async (arrangement: any) => {
  const { data, error } = await supabase
    .from('holiday_arrangements' as SupabaseTable)
    .insert(arrangement)
    .select();
    
  if (error) throw error;
  
  return data?.[0];
};

export const updateHolidayArrangement = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('holiday_arrangements' as SupabaseTable)
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  
  return data?.[0];
};

export const deleteHolidayArrangement = async (id: string) => {
  const { error } = await supabase
    .from('holiday_arrangements' as SupabaseTable)
    .delete()
    .eq('id', id);
    
  if (error) throw error;
  
  return true;
};

// Chat messages services
export const getChatMessages = async (familyId: string) => {
  const { data, error } = await supabase
    .from('chat_messages' as SupabaseTable)
    .select('*, profiles:sender_id(full_name)')
    .eq('family_id', familyId)
    .order('created_at', { ascending: true });
    
  if (error) throw error;
  
  return data;
};

export const addChatMessage = async (message: any) => {
  const { data, error } = await supabase
    .from('chat_messages' as SupabaseTable)
    .insert(message)
    .select();
    
  if (error) throw error;
  
  return data?.[0];
};

// Set up real-time subscriptions
export const subscribeToFinancialArrangements = (familyId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('financial-arrangements')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'financial_arrangements',
        filter: `family_id=eq.${familyId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToHolidayArrangements = (familyId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('holiday-arrangements')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'holiday_arrangements',
        filter: `family_id=eq.${familyId}`
      },
      callback
    )
    .subscribe();
};

export const subscribeToChatMessages = (familyId: string, callback: (payload: any) => void) => {
  return supabase
    .channel('chat-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `family_id=eq.${familyId}`
      },
      callback
    )
    .subscribe();
};
