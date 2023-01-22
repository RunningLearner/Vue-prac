import { onUnmounted, computed } from "vue";
import { useStore } from "vuex";

export const useToast = () => {
  const store = useStore();
  const showToast = computed(() => store.state.showToast);
  const toastMessage = computed(() => store.state.toastMessage);
  const toastAlert = computed(() => store.state.toastAlert);
  const timeout = computed(() => store.state.timeout);

  console.log(showToast);
  const triggerToast = (message, type = "success") => {
    toastMessage.value = message;
    toastAlert.value = type;
    showToast.value = true;
    timeout.value = setTimeout(() => {
      toastMessage.value = "";
      toastAlert.value = "";
      showToast.value = false;
    }, 2000);
  };

  onUnmounted(() => {
    clearTimeout(timeout.value);
  });
  return {
    showToast,
    toastMessage,
    toastAlert,
    triggerToast,
  };
};
