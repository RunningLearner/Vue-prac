import { computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  const store = useStore();
  const showToast = computed(() => store.state.showToast);
  const toastMessage = computed(() => store.getters.toastMessageWithSmile);
  const toastAlert = computed(() => store.state.toastAlert);

  const triggerToast = (message, type = "success") => {
    store.dispatch("triggerToast", message, type);
  };

  return {
    showToast,
    toastMessage,
    toastAlert,
    triggerToast,
  };
};
