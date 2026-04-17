import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { apiUrl } from "../config/api";

const FavoritesContext = createContext();

const GUEST_KEY = "vitrax_guest_wishlist";
const LEGACY_KEY = "favorites";

export const normalizeWishlistProduct = (p) => {
  if (!p) return null;
  const id = p.product_id ?? p.id;
  return { ...p, id, product_id: id };
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

const readGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(GUEST_KEY) || localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(normalizeWishlistProduct).filter(Boolean) : [];
  } catch {
    return [];
  }
};

const writeGuestWishlist = (items) => {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
};

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const tokenHeaders = useCallback(() => {
    const token = user?.access_token || localStorage.getItem("token");
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }, [user?.access_token]);

  const fetchServerWishlist = useCallback(async () => {
    if (!user?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/wishlist"), { headers: { ...tokenHeaders() } });
      if (!res.ok) throw new Error("wishlist fetch failed");
      const data = await res.json();
      const items = (data.items || []).map(normalizeWishlistProduct).filter(Boolean);
      setFavorites(items);
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [user?.access_token, tokenHeaders]);

  useEffect(() => {
    if (user?.access_token) {
      const guest = readGuestWishlist();
      (async () => {
        await fetchServerWishlist();
        if (guest.length) {
          for (const p of guest) {
            const pid = p.product_id ?? p.id;
            if (!pid) continue;
            try {
              await fetch(apiUrl("/wishlist"), {
                method: "POST",
                headers: { "Content-Type": "application/json", ...tokenHeaders() },
                body: JSON.stringify({ product_id: pid }),
              });
            } catch {
              /* ignore merge errors */
            }
          }
          localStorage.removeItem(GUEST_KEY);
          localStorage.removeItem(LEGACY_KEY);
          await fetchServerWishlist();
        }
      })();
    } else {
      setFavorites(readGuestWishlist());
    }
  }, [user?.access_token, fetchServerWishlist, tokenHeaders]);

  const isFavorite = useCallback(
    (productId) => {
      const pid = Number(productId);
      return favorites.some((f) => Number(f.product_id ?? f.id) === pid);
    },
    [favorites]
  );

  const addToFavorites = useCallback(
    async (product) => {
      const normalized = normalizeWishlistProduct(product);
      if (!normalized) return;
      const pid = normalized.product_id;

      if (user?.access_token) {
        try {
          const res = await fetch(apiUrl("/wishlist"), {
            method: "POST",
            headers: { "Content-Type": "application/json", ...tokenHeaders() },
            body: JSON.stringify({ product_id: pid }),
          });
          if (res.ok || res.status === 200) await fetchServerWishlist();
        } catch {
          /* noop */
        }
        return;
      }

      setFavorites((prev) => {
        if (prev.some((f) => (f.product_id ?? f.id) === pid)) return prev;
        const next = [...prev, { ...normalized, addedAt: new Date().toISOString() }];
        writeGuestWishlist(next);
        return next;
      });
    },
    [user?.access_token, tokenHeaders, fetchServerWishlist]
  );

  const removeFromFavorites = useCallback(
    async (productId) => {
      const pid = Number(productId);
      if (user?.access_token) {
        try {
          await fetch(apiUrl(`/wishlist/${pid}`), {
            method: "DELETE",
            headers: { ...tokenHeaders() },
          });
          await fetchServerWishlist();
        } catch {
          /* noop */
        }
        return;
      }

      setFavorites((prev) => {
        const next = prev.filter((f) => Number(f.product_id ?? f.id) !== pid);
        writeGuestWishlist(next);
        return next;
      });
    },
    [user?.access_token, tokenHeaders, fetchServerWishlist]
  );

  const toggleFavorite = useCallback(
    async (product) => {
      const normalized = normalizeWishlistProduct(product);
      if (!normalized) return;
      const pid = normalized.product_id ?? normalized.id;
      const exists = favorites.some((f) => Number(f.product_id ?? f.id) === Number(pid));
      if (exists) {
        await removeFromFavorites(pid);
      } else {
        await addToFavorites(normalized);
      }
    },
    [favorites, addToFavorites, removeFromFavorites]
  );

  const clearFavorites = useCallback(async () => {
    if (user?.access_token) {
      for (const f of [...favorites]) {
        const pid = f.product_id ?? f.id;
        if (pid) {
          try {
            await fetch(apiUrl(`/wishlist/${pid}`), {
              method: "DELETE",
              headers: { ...tokenHeaders() },
            });
          } catch {
            /* continue */
          }
        }
      }
      await fetchServerWishlist();
    } else {
      setFavorites([]);
      writeGuestWishlist([]);
      localStorage.removeItem(LEGACY_KEY);
    }
  }, [user?.access_token, favorites, tokenHeaders, fetchServerWishlist]);

  const favoritesCount = favorites.length;

  const value = {
    favorites,
    favoritesCount,
    wishlistLoading: loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    clearFavorites,
    refreshWishlist: fetchServerWishlist,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
