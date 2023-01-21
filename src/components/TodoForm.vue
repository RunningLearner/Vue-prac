<template>
  <div v-if="loading">Loading...</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group">
          <label>Subject</label>
          <input v-model="todo.subject" type="text" class="form-control" />
        </div>
      </div>
      <div v-if="editing" class="col-6">
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
      <div class="col-12">
        <div class="form-group">
          <label>Body</label>
          <textarea
            v-model="todo.body"
            class="form-control"
            cols="30"
            rows="10"
          ></textarea>
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
import { computed, ref } from "vue";
import _ from "lodash";
import Toast from "@/components/Toast.vue";
import { useToast } from "@/composables/toast";

export default {
  components: { Toast },
  props: {
    editing: {
      type: Boolean,
      default: false,
      body: "",
    },
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const todo = ref({
      subject: "",
      completed: false,
    });
    const originalTodo = ref(null);
    const loading = ref(false);
    const todoId = route.params.id;
    const { showToast, toastMessage, toastAlert, triggerToast } = useToast();

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`http://localhost:3000/todos/${todoId}`);
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      } catch (error) {
        loading.value = false;
        triggerToast("Something went wrong in DB!", "danger");
      }
    };

    const todoUpdate = computed(() => {
      return !_.isEqual(todo.value, originalTodo.value);
    });

    const toggleTodoStatus = () => {
      todo.value.completed = !todo.value.completed;
    };

    if (props.editing) {
      getTodo();
    }

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
