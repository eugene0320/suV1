# New Supabase Tables for SpeakUp Simulate

## User Credentials Table

This table stores API credentials securely with row-level security to protect sensitive information.

```sql
-- Create user credentials table
CREATE TABLE user_credentials (
  id SERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  service_name VARCHAR(50) NOT NULL,
  api_key TEXT NOT NULL,
  agent_id TEXT,
  user_identifier TEXT
);

-- Enable RLS
ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;

-- Create policies for secure access
CREATE POLICY "Allow credential access by user_identifier" 
  ON user_credentials 
  FOR ALL 
  TO anon
  USING (user_identifier = current_setting('app.user_identifier', true));

CREATE POLICY "Allow credential insertion with user_identifier" 
  ON user_credentials 
  FOR INSERT 
  TO anon
  WITH CHECK (user_identifier = current_setting('app.user_identifier', true));

-- Create policy for updating credentials
CREATE POLICY "Allow credential update by user_identifier" 
  ON user_credentials 
  FOR UPDATE 
  TO anon
  USING (user_identifier = current_setting('app.user_identifier', true))
  WITH CHECK (user_identifier = current_setting('app.user_identifier', true));
```

## Implementation Notes

1. **Security Considerations**:
   - API keys are sensitive information; this implementation uses Supabase RLS to restrict access
   - The user_identifier field allows for credential isolation without requiring full user authentication
   - Each browser/device will generate a unique identifier (UUID) stored in localStorage

2. **How to Use**:
   - When saving credentials, set the 'app.user_identifier' header in your Supabase client:
   ```typescript
   // Example usage in code
   const userIdentifier = localStorage.getItem('user_identifier') || generateNewUserIdentifier();
   supabase.rpc('your_function', {}, {
     headers: {
       'app-user-identifier': userIdentifier
     }
   });
   ```

3. **Fallback Strategy**:
   - If Supabase is unavailable, the app will fall back to localStorage for temporary credential storage
   - When connection is restored, credentials will sync back to Supabase

4. **Future Enhancements**:
   - When user authentication is added, the user_identifier can be replaced with a proper user_id
   - Encryption of API keys can be added for additional security
   - Audit logging for credential usage can be implemented