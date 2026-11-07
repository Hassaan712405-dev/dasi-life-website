export interface AuthUser {
  id: string;
  email: string;
  isNewUser?: boolean;
}

export interface LoginPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  redirectTo?: string;
}

export type AuthMode = 'instant' | 'verified';