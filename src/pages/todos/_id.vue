<template>
  <h1>To-Do Page</h1>
  <div v-if="loading">Loading...</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input v-model="todo.subject" type="text" class="form-control" />
        </div>
      </div>
      <div class="col-6">
        <div class="form-group">
          <label>Status</label>
          <div>
            <button
              type="button"
              class="btn"
              :class="todo.completed ? 'btn-success' : 'btn-danger'"
              @click="toggleTodoStatus"
            >
              {{ todo.completed ? "Completed" : "Incomplete" }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="!todoUpdate">
      Save
    </button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">
      Cancel
    </button>
  </form>
  <Toast v-if="showToast" :message="toastMessage" :type="toastAlert" />
</template>

<script>
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import { computed, onUnmounted, ref } from "vue";
import _ from "lodash";
import Toast from "@/components/Toast.vue";

export default {
  components: { Toast },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const originalTodo = ref(null);
    const loading = ref(true);
    const showToast = ref(false);
    const toastMessage = ref("");
    const toastAlert = ref("");
    const timeout = ref(null);
    const todoId = route.params.id;

    onUnmounted(() => {
      clearTimeout(timeout.value);
    });

    const getTodo = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (error) {
        triggerToast("Something went wrong in DB!", "danger");
      }
    };

    const todoUpdate = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    });

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    };

    getTodo();

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

    const onSave = async () => {
      try {
        const res = await axios.put(`http://localhost:3000/todos/${todoId}`, {
          subject: todo.value.subject,
          completed: todo.value.completed,
        });

        originalTodo.value = { ...res.data };
        triggerToast("Successfully saved!");
      } catch (error) {
        triggerToast("Something went wrong in DB!", "danger");
      }
    };

    const moveToTodoListPage = () => {
      router.push({ name: "Todos" });
    };

    return {
      todo,
      loading,
      toggleTodoStatus,
      moveToTodoListPage,
      onSave,
      todoUpdate,
      showToast,
      toastMessage,
      toastAlert,
    };
  },
};
</script>

<style></style>
