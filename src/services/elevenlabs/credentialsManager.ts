
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

// Constants
const STORAGE_KEY_USER_ID = 'speakup_user_identifier';
const STORAGE_KEY_API_KEY = 'elevenlabs_api_key';
const STORAGE_KEY_AGENT_ID = 'elevenlabs_agent_id';
const SERVICE_NAME = 'elevenlabs';

// Default credentials - these are example/fallback credentials
const DEFAULT_API_KEY = "sk_1a0816ea6a38431d3ba9a019c9339d74";
const DEFAULT_AGENT_ID = "nAizm5QqD2TXLqB5nuS";

/**
 * Initialize user identifier for credential isolation
 */
const getUserIdentifier = (): string => {
  let userId = localStorage.getItem(STORAGE_KEY_USER_ID);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(STORAGE_KEY_USER_ID, userId);
  }
  return userId;
};

/**
 * Get stored credentials from localStorage (fallback)
 */
const getLocalCredentials = () => {
  const apiKey = localStorage.getItem(STORAGE_KEY_API_KEY) || DEFAULT_API_KEY;
  const agentId = localStorage.getItem(STORAGE_KEY_AGENT_ID) || DEFAULT_AGENT_ID;
  return { apiKey, agentId };
};

/**
 * Save credentials to localStorage (fallback)
 */
const saveLocalCredentials = (apiKey: string, agentId: string) => {
  localStorage.setItem(STORAGE_KEY_API_KEY, apiKey);
  localStorage.setItem(STORAGE_KEY_AGENT_ID, agentId);
};

/**
 * Get credentials from Supabase, falling back to default if needed
 */
const getSupabaseCredentials = async (): Promise<{ apiKey: string, agentId: string }> => {
  try {
    const userIdentifier = getUserIdentifier();
    
    console.log('Fetching credentials with user identifier:', userIdentifier);
    
    // First try to get user-specific credentials
    const { data, error } = await supabase
      .from('user_credentials')
      .select('api_key, agent_id')
      .eq('service_name', SERVICE_NAME)
      .eq('user_identifier', userIdentifier)
      .maybeSingle();
      
    console.log('Supabase query result:', { data, error });
    
    if (error) {
      console.error('Error fetching user-specific credentials:', error);
      // Fall back to local credentials
      return getLocalCredentials();
    }
    
    // If no user-specific credentials, try default credentials
    if (!data) {
      console.log('No user-specific credentials found, trying default credentials');
      
      const { data: defaultData, error: defaultError } = await supabase
        .from('user_credentials')
        .select('api_key, agent_id')
        .eq('service_name', SERVICE_NAME)
        .eq('user_identifier', 'default')
        .maybeSingle();
      
      if (defaultError || !defaultData) {
        console.log('No default credentials found in database, using hardcoded defaults');
        
        // Save hardcoded defaults to user record for future use
        await saveSupabaseCredentials(DEFAULT_API_KEY, DEFAULT_AGENT_ID);
        
        // Also save to localStorage
        saveLocalCredentials(DEFAULT_API_KEY, DEFAULT_AGENT_ID);
        
        return {
          apiKey: DEFAULT_API_KEY,
          agentId: DEFAULT_AGENT_ID
        };
      }
      
      console.log('Found default credentials, copying to user-specific record');
      
      // Copy default credentials to user-specific record
      await saveSupabaseCredentials(defaultData.api_key, defaultData.agent_id);
      
      // Also save to localStorage
      saveLocalCredentials(defaultData.api_key, defaultData.agent_id);
      
      return {
        apiKey: defaultData.api_key,
        agentId: defaultData.agent_id
      };
    }
    
    console.log('Successfully retrieved user credentials from Supabase');
    
    // Save to localStorage as backup
    saveLocalCredentials(data.api_key, data.agent_id);
    
    return {
      apiKey: data.api_key,
      agentId: data.agent_id
    };
  } catch (err) {
    console.error('Error fetching credentials from Supabase:', err);
    return getLocalCredentials();
  }
};

/**
 * Save credentials to Supabase
 */
const saveSupabaseCredentials = async (apiKey: string, agentId: string): Promise<boolean> => {
  try {
    const userIdentifier = getUserIdentifier();
    console.log('Saving credentials to Supabase with user identifier:', userIdentifier);
    
    // First check if we already have a record for this user and service
    const { data: existingData, error: checkError } = await supabase
      .from('user_credentials')
      .select('id')
      .eq('service_name', SERVICE_NAME)
      .eq('user_identifier', userIdentifier)
      .maybeSingle();
      
    console.log('Existing data check:', { existingData, checkError });
    
    let result;
    
    if (existingData) {
      // Update existing record
      console.log('Updating existing record with ID:', existingData.id);
      result = await supabase
        .from('user_credentials')
        .update({
          api_key: apiKey,
          agent_id: agentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
    } else {
      // Insert new record
      console.log('Inserting new record for user:', userIdentifier);
      result = await supabase
        .from('user_credentials')
        .insert({
          api_key: apiKey,
          agent_id: agentId,
          service_name: SERVICE_NAME,
          user_identifier: userIdentifier
        });
    }
    
    if (result.error) {
      console.error('Error saving credentials to Supabase:', result.error);
      // Save to localStorage as fallback
      saveLocalCredentials(apiKey, agentId);
      return false;
    }
    
    console.log('Successfully saved credentials to Supabase');
    
    // Also save to localStorage as a backup
    saveLocalCredentials(apiKey, agentId);
    return true;
  } catch (err) {
    console.error('Error saving credentials to Supabase:', err);
    // Save to localStorage as fallback
    saveLocalCredentials(apiKey, agentId);
    return false;
  }
};

/**
 * Loads stored ElevenLabs credentials
 */
export const loadCredentials = async () => {
  const creds = await getSupabaseCredentials();
  console.log('Loaded credentials:', creds.apiKey ? 'API Key present' : 'No API key', creds.agentId ? 'Agent ID present' : 'No Agent ID');
  return creds;
};

/**
 * Sets and saves ElevenLabs credentials both locally and to Supabase
 */
export const setCredentials = async (apiKey: string, agentId: string) => {
  console.log('Setting ElevenLabs credentials');
  
  // Save to localStorage as immediate fallback
  saveLocalCredentials(apiKey, agentId);
  
  // Save to Supabase (async)
  return saveSupabaseCredentials(apiKey, agentId);
};

export default {
  loadCredentials,
  setCredentials,
  getUserIdentifier
};
