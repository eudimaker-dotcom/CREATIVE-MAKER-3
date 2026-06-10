import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Detect if keys are actually configured and not placeholders
const isConfigured = supabaseUrl && supabaseAnonKey && 
                     !supabaseUrl.includes('YOUR_') && 
                     !supabaseAnonKey.includes('YOUR_');

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Mock database helpers
const getMockAccounts = () => {
  try {
    return JSON.parse(localStorage.getItem('designali_mock_accounts') || '[]');
  } catch (e) {
    return [];
  }
};

const saveMockAccounts = (accounts) => {
  localStorage.setItem('designali_mock_accounts', JSON.stringify(accounts));
};

export const authService = {
  isRealSupabase: !!supabase,

  signUp: async (email, password, name) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name }
        }
      });
      if (error) throw error;
      
      return {
        email: data.user.email,
        name: data.user.user_metadata?.name || name || data.user.email.split('@')[0],
        downloads: [],
        favorites: [],
        collections: [],
        recentActivity: []
      };
    } else {
      const accounts = getMockAccounts();
      if (accounts.some(acc => acc.email === email)) {
        throw new Error('An account with this email already exists.');
      }
      const newUser = { email, password, name, downloads: [], favorites: [], collections: [], recentActivity: [] };
      accounts.push(newUser);
      saveMockAccounts(accounts);
      // Automatically set active session
      localStorage.setItem('designali_mock_session', JSON.stringify(newUser));
      return newUser;
    }
  },

  signIn: async (email, password) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      
      return {
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        downloads: data.user.user_metadata?.downloads || [],
        favorites: data.user.user_metadata?.favorites || [],
        collections: data.user.user_metadata?.collections || [],
        recentActivity: data.user.user_metadata?.recentActivity || []
      };
    } else {
      const accounts = getMockAccounts();
      const user = accounts.find(acc => acc.email === email && acc.password === password);
      if (!user) {
        throw new Error('Invalid email or password.');
      }
      // Ensure mock user has all required arrays
      const checkedUser = {
        ...user,
        downloads: user.downloads || [],
        favorites: user.favorites || [],
        collections: user.collections || [],
        recentActivity: user.recentActivity || []
      };
      localStorage.setItem('designali_mock_session', JSON.stringify(checkedUser));
      return checkedUser;
    }
  },

  signInWithGoogle: async () => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      return data;
    } else {
      const googleUser = {
        email: 'google-creator@gmail.com',
        name: 'Google Creator',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
        downloads: [],
        favorites: [],
        collections: [],
        recentActivity: []
      };
      localStorage.setItem('designali_mock_session', JSON.stringify(googleUser));
      return googleUser;
    }
  },

  signOut: async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localStorage.removeItem('designali_mock_session');
    }
  },

  resetPassword: async (email) => {
    if (supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      if (error) throw error;
      return data;
    } else {
      const accounts = getMockAccounts();
      const userExists = accounts.some(acc => acc.email === email) || email === 'google-creator@gmail.com';
      if (!userExists) {
        throw new Error('No account found with this email.');
      }
      return { message: 'Password reset email simulated successfully.' };
    }
  },

  getCurrentUser: async () => {
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        return {
          email: user.email,
          name: user.user_metadata?.name || user.email.split('@')[0],
          downloads: user.user_metadata?.downloads || [],
          favorites: user.user_metadata?.favorites || [],
          collections: user.user_metadata?.collections || [],
          recentActivity: user.user_metadata?.recentActivity || []
        };
      }
      return null;
    } else {
      try {
        const user = JSON.parse(localStorage.getItem('designali_mock_session'));
        if (user) {
          return {
            ...user,
            downloads: user.downloads || [],
            favorites: user.favorites || [],
            collections: user.collections || [],
            recentActivity: user.recentActivity || []
          };
        }
        return null;
      } catch (e) {
        return null;
      }
    }
  },

  updateCurrentUser: async (userData) => {
    if (supabase) {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          name: userData.name,
          downloads: userData.downloads,
          favorites: userData.favorites,
          collections: userData.collections,
          recentActivity: userData.recentActivity
        }
      });
      if (error) throw error;
      return {
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.email.split('@')[0],
        downloads: data.user.user_metadata?.downloads || [],
        favorites: data.user.user_metadata?.favorites || [],
        collections: data.user.user_metadata?.collections || [],
        recentActivity: data.user.user_metadata?.recentActivity || []
      };
    } else {
      const session = JSON.parse(localStorage.getItem('designali_mock_session'));
      if (session) {
        const updated = {
          ...session,
          name: userData.name ?? session.name,
          downloads: userData.downloads ?? session.downloads ?? [],
          favorites: userData.favorites ?? session.favorites ?? [],
          collections: userData.collections ?? session.collections ?? [],
          recentActivity: userData.recentActivity ?? session.recentActivity ?? []
        };
        localStorage.setItem('designali_mock_session', JSON.stringify(updated));
        
        const accounts = getMockAccounts();
        const index = accounts.findIndex(acc => acc.email === session.email);
        if (index !== -1) {
          accounts[index] = {
            ...accounts[index],
            name: userData.name ?? accounts[index].name,
            downloads: userData.downloads ?? accounts[index].downloads ?? [],
            favorites: userData.favorites ?? accounts[index].favorites ?? [],
            collections: userData.collections ?? accounts[index].collections ?? [],
            recentActivity: userData.recentActivity ?? accounts[index].recentActivity ?? []
          };
          saveMockAccounts(accounts);
        }
        return updated;
      }
      return null;
    }
  }
};
