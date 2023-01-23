<template>
  <div>
    <div class="d-flex justify-content-between m-3">
      <h2>To-Do List</h2>
      <button @click="moveToCreatePage" class="btn btn-primary">
        Create Todo
      </button>
    </div>
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search..."
      @keyup.enter="searchTodo"
    />
    <hr />

    <div v-if="!todos.length">추가된 Todo가 없습니다!</div>
    <TodoList
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
    />
    <hr />
    <Pagination
      v-if="todos.length"
      :numberOfPages="numberOfPages"
      :currentPage="currentPage"
      @click="getTodo"
    />
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import TodoList from "@/components/TodoList.vue";
import axios from "@/axios";
import { useToast } from "@/composables/toast";
import { useRouter } from "vue-router";
import Pagination from "@/components/Pagination.vue";

export default {
  components: {
    TodoList,
    Pagination,
  },
  setup() {
    const router = useRouter();
    const todos = ref([]);
    const error = ref("");
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const searchText = ref("");
    const { showToast, toastMessage, toastAlert, triggerToast } = useToast();

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    });

    const getTodo = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        const res = await axios.get(
          `todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );
        numberOfTodos.value = res.headers["x-total-count"];
        todos.value = res.data;
      } catch (err) {
        triggerToast("Something went wrong", "danger");
        console.log(err);
      }
    };

    getTodo();

    const addTodo = async (todo) => {
      error.value = "";

      try {
        await axios.post(`todos`, {
          subject: todo.subject,
          completed: todo.completed,
        });

        getTodo(1);
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong", "danger");
        error.value = "Something went wrong";
      }
    };

    const deleteTodo = async (id) => {
      error.value = "";
      try {
        await axios.delete(`todos/${id}`);
        getTodo(1);
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong", "danger");
        error.value = "Something went wrong";
      }
    };

    const toggleTodo = async (index, checked) => {
      error.value = "";
      const id = todos.value[index].id;

      try {
        await axios.patch(`todos/${id}`, {
          completed: !todos.value[index].completed,
        });
        todos.value[index].completed = checked;
      } catch (err) {
        console.log(err);
        triggerToast("Something went wrong", "danger");
        error.value = "Something went wrong";
      }
    };

    const moveToCreatePage = () => {
      router.push({
        name: "TodoCreate",
      });
    };

    let timeout = null;

    const searchTodo = () => {
      clearTimeout(timeout);
      getTodo(1);
    };

    watch(searchText, () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        getTodo(1);
      }, 1000);
    });

    return {
      searchText,
      addTodo,
      todos,
      deleteTodo,
      toggleTodo,
      error,
      searchTodo,
      numberOfPages,
      currentPage,
      getTodo,
      showToast,
      toastAlert,
      toastMessage,
      moveToCreatePage,
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>
