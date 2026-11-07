export interface AuthUser {
  id: string;
  email: string;
  isNewUser?: boolean;
}

// ✅ AuthModal ke liye props (ye missing tha — isi wajah se error aa raha tha)
export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (user: AuthUser) => void;
  redirectTo?: string;
  closeOnEscape?: boolean;
  termsUrl?: string;
  privacyUrl?: string;
}

export interface LoginPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: AuthUser) => void;
  redirectTo?: string;
}

export type AuthMode = 'instant' | 'verified';