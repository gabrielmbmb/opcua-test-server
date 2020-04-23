import { UserManagerOptions } from 'node-opcua';

const userManager: UserManagerOptions = {
  isValidUser: (username: string, password: string) => {
    if (
      (username === 'user1' && password === 'pass1') ||
      (username === 'user2' && password === 'pass2')
    ) {
      return true;
    }

    return false;
  },
};

export default userManager;
