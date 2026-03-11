export interface StoredAuthSnapshot {
  user: {
    id: string;
    company_slug: string;
    role_id: string;
    full_name: string;
    email: string;
    permissions: string[];
  };
  tokens: {
    access_token: string;
    refresh_token: string;
    token_type: "Bearer";
    expires_in: string;
  };
}

const STORAGE_KEY = "hrms.auth";

const hasWindow = (): boolean => typeof window !== "undefined";

export const authStorage = {
  get: (): StoredAuthSnapshot | null => {
    if (!hasWindow()) {
      return null;
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as StoredAuthSnapshot;
    } catch {
      return null;
    }
  },

  set: (snapshot: StoredAuthSnapshot): void => {
    if (!hasWindow()) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  },

  clear: (): void => {
    if (!hasWindow()) {
      return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
  }
};

export const authEvents = {
  tokensUpdated: "hrms.auth.tokens-updated",
  signedOut: "hrms.auth.signed-out"
} as const;
