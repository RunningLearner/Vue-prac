import { computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  const store = useStore();
  const toasts = computed(() => store.state.toast.toasts);

  // const showToast = computed(() => store.state.toast.showToast);
  // const toastMessage = computed(
  //   () => store.getters["toast/toastMessageWithSmile"]
  // );
  // const toastAlert = computed(() => store.state.toast.toastAlert);

  const triggerToast = (message, type = "success") => {
    store.dispatch("toast/triggerToast", { message, type });
  };

  return {
    toasts,
    triggerToast,
  };
};
