import { createStore } from "vuex";

export default createStore({
  state: {
    toastMessage: "hi",
    toastAlert: "success",
    showToast: true,
    timeout: null,
  },
});
