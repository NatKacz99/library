export const AuthService = {
  setUser: (userData) => {
    try {
      const userToStore = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };
      localStorage.setItem('userData', JSON.stringify(userToStore));
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  },

  getUser: () => {
    try {
      const stored = localStorage.getItem('userData');
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('userData');
      return null;
    }
  },

  clearUser: () => {
    localStorage.removeItem('userData');
  },

  isAuthenticated: () => {
    return AuthService.getUser() !== null;
  }
};