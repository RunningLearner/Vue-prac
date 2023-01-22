<template>
  <div v-if="loading">Loading...</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <Input
          v-model:subject="todo.subject"
          label="SUbject"
          :error="subjectError"
        />
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
      {{ editing ? "Update" : "Create" }}
    </button>
    <button class="btn btn-outline-dark ml-2" @click="moveToTodoListPage">
      Cancel
    </button>
  </form>
  <transition name="fade">
    <Toast v-if="showToast" :message="toastMessage" :type="toastAlert" />
  </transition>
</template>

<script>
import axios from "@/axios";
import { useRoute, useRouter } from "vue-router";
import { computed, onUpdated, ref } from "vue";
import _ from "lodash";
import Toast from "@/components/Toast.vue";
import { useToast } from "@/composables/toast";
import Input from "@/components/Input.vue";

export default {
  components: { Toast, Input },
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
      body: "",
    });
    onUpdated(() => {
      console.log(todo.value.subject);
    });
    const subjectError = ref("");
    const originalTodo = ref(null);
    const loading = ref(false);
    const todoId = route.params.id;
    const { showToast, toastMessage, toastAlert, triggerToast } = useToast();

    const getTodo = async () => {
      loading.value = true;
      try {
        const res = await axios.get(`todos/${todoId}`);
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
      subjectError.value = "";
      if (!todo.value.subject) {
        subjectError.value = "Subject is required!";
        return;
      }
      try {
        let res;
        const data = {
          subject: todo.value.subject,
          completed: todo.value.completed,
          body: todo.value.body,
        };
        if (props.editing) {
          res = await axios.put(`todos/${todoId}`, data);
          originalTodo.value = { ...res.data };
        } else {
          res = await axios.post(`todos/`, data);
          todo.value.subject = "";
          todo.value.body = "";
        }

        const message =
          "Successfully " + (props.editing ? "Updated!" : "Created!");
        triggerToast(message);
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
      subjectError,
    };
  },
};
</script>

<style scoped>
.text-red {
  color: red;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0px);
}
</style>
