// Mock implementation pour remplacer le SDK Blink en local
// Cette implémentation permet au projet de fonctionner sans Blink

interface MockUser {
  id: string;
  email: string;
  name: string;
}

interface MockAuthState {
  user: MockUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

class MockBlinkClient {
  private authState: MockAuthState = {
    user: {
      id: 'local-user-1',
      email: 'user@local.dev',
      name: 'Local User'
    },
    isLoading: false,
    isAuthenticated: true
  };

  private authListeners: ((state: MockAuthState) => void)[] = [];

  auth = {
    me: async () => {
      return this.authState.user;
    },

    isAuthenticated: () => {
      return this.authState.isAuthenticated;
    },

    onAuthStateChanged: (callback: (state: MockAuthState) => void) => {
      this.authListeners.push(callback);
      // Appeler immédiatement avec l'état actuel
      callback(this.authState);
      
      // Retourner une fonction de désabonnement
      return () => {
        const index = this.authListeners.indexOf(callback);
        if (index > -1) {
          this.authListeners.splice(index, 1);
        }
      };
    },

    login: (nextUrl?: string) => {
      console.log('Mock login - already authenticated');
    },

    logout: (redirectUrl?: string) => {
      this.authState.user = null;
      this.authState.isAuthenticated = false;
      this.notifyAuthListeners();
    }
  };

  db = {
    // Mock database operations
    // Tu peux étendre ceci selon tes besoins
  };

  private notifyAuthListeners() {
    this.authListeners.forEach(listener => listener(this.authState));
  }
}

export const blink = new MockBlinkClient();