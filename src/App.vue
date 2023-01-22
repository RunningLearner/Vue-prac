<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" :to="{ name: 'Home' }"
        >RunningLearner</router-link
      >

      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" :to="{ name: 'Todos' }"
            >Todos</router-link
          >
        </li>
      </ul>
    </div>
  </nav>
  <div class="container">
    <router-view />
  </div>
  <Toast v-if="showToast" :message="toastMessage" :type="toastAlert" />
</template>

<script>
import Toast from "@/components/Toast.vue";
import { useToast } from "@/composables/toast";

export default {
  components: { Toast },
  setup() {
    const { showToast, toastMessage, toastAlert, triggerToast } = useToast();

    return {
      showToast,
      toastMessage,
      toastAlert,
      triggerToast,
    };
  },
};
</script>

<style></style>
