
import { UserAccount, UserProfile } from '../types';
import { storageService } from './storageService';

export const apiService = {
  async login(credentials: { email: string; username?: string; password?: string }): Promise<UserAccount> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const account: UserAccount = {
      email: credentials.email,
      username: credentials.username || credentials.email.split('@')[0],
      joinedDate: new Date().toISOString(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${credentials.username || 'Astro'}`
    };
    storageService.saveAccount(account);
    return account;
  },

  async saveProfiles(profiles: UserProfile[]): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800));
    storageService.saveProfiles(profiles);
  },

  async getProfiles(): Promise<UserProfile[]> {
    return storageService.getProfiles();
  },

  async getActiveProfileId(): Promise<string | null> {
    return storageService.getActiveProfileId();
  },

  async setActiveProfileId(id: string): Promise<void> {
    storageService.setActiveProfileId(id);
  },

  async getAccount(): Promise<UserAccount | null> {
    return storageService.getAccount();
  },

  async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));
    storageService.clearAll();
  }
};
