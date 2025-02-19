import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { authApi } from "../api/index.js";
import { tokenStorage, onUnauthorized } from "../api/client.js";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const ready = ref(false);

  const isAuthenticated = computed(() => Boolean(user.value));
  const isAdmin = computed(() => ["admin", "superadmin"].includes(user.value?.role));
  const isSuperAdmin = computed(() => user.value?.role === "superadmin");

  const applySession = ({ user: u, token }) => {
    tokenStorage.set(token);
    user.value = u;
  };

  const login = async (credentials) => applySession(await authApi.login(credentials));
  const register = async (data) => applySession(await authApi.register(data));

  const logout = () => {
    tokenStorage.clear();
    user.value = null;
  };

  /** Sahifa yuklanganda saqlangan token bo'yicha foydalanuvchini tiklaydi */
  let bootstrapPromise;
  const bootstrap = () => {
    bootstrapPromise ??= (async () => {
      if (tokenStorage.get()) {
        try {
          user.value = (await authApi.me()).user;
        } catch {
          logout();
        }
      }
      ready.value = true;
    })();
    return bootstrapPromise;
  };

  const updateProfile = async (data) => {
    user.value = (await authApi.updateProfile(data)).user;
  };

  onUnauthorized(logout);

  return { user, ready, isAuthenticated, isAdmin, isSuperAdmin, login, register, logout, bootstrap, updateProfile };
});
