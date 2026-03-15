import { supabase } from './supabase';

export const signUp = async (username, password) => {
  try {
    // Use Supabase's built-in auth with email format
    const email = `${username}@local.app`; // Convert username to email format
    
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          username: username
        }
      }
    });

    if (error) throw error;

    return {
      success: true,
      user: {
        id: data.user?.id,
        username: username,
        email: email
      }
    };
  } catch (error) {
    console.error('Signup error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const signIn = async (username, password) => {
  try {
    // Use Supabase's built-in auth with email format
    const email = `${username}@local.app`; // Convert username to email format
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) throw error;

    return {
      success: true,
      user: {
        id: data.user?.id,
        username: data.user?.user_metadata?.username || username,
        email: data.user?.email
      }
    };
  } catch (error) {
    console.error('Signin error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Signout error:', error);
    return { success: false, error: error.message };
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    
    if (user) {
      return {
        id: user.id,
        username: user.user_metadata?.username || user.email?.split('@')[0],
        email: user.email
      };
    }
    return null;
  } catch (error) {
    console.error('Get user error:', error);
    return null;
  }
};