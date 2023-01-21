import { ref, onUnmounted } from "vue";

export const useToast = () => {
  const showToast = ref(false);
  const toastMessage = ref("");
  const toastAlert = ref("");
  const timeout = ref(null);
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
