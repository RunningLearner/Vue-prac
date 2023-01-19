<template>
  <router-view />
  <div class="container">
    <h2>To-Do List</h2>
    <input
      class="form-control"
      type="text"
      v-model="searchText"
      placeholder="Search..."
      @keyup.enter="searchTodo"
    />
    <hr />
    <TodoSimpleForm @add-todo="addTodo" />
    <div style="color: red">{{ error }}</div>

    <div v-if="!todos.length">추가된 Todo가 없습니다!</div>
    <TodoList
      :todos="todos"
      @toggle-todo="toggleTodo"
      @delete-todo="deleteTodo"
    />
    <hr />
    <nav aria-label=" Page navigation example">
      <ul class="pagination">
        <li v-if="currentPage !== 1" class="page-item">
          <a
            style="cursor: pointer"
            class="page-link"
            @click="getTodo(currentPage - 1)"
            >Prev</a
          >
        </li>
        <li
          v-for="page in numberOfPages"
          :key="page"
          class="page-item"
          :class="currentPage === page ? 'active' : ''"
        >
          <a style="cursor: pointer" class="page-link" @click="getTodo(page)">{{
            page
          }}</a>
        </li>
        <li v-if="currentPage !== numberOfPages" class="page-item">
          <a
            style="cursor: pointer"
            class="page-link"
            @click="getTodo(currentPage + 1)"
            >Next</a
          >
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import TodoSimpleForm from "./components/TodoSimpleForm.vue";
import TodoList from "./components/TodoList.vue";
import axios from "axios";

export default {
  components: {
    TodoSimpleForm,
    TodoList,
  },
  setup() {
    const todos = ref([]);
    const error = ref("");
    const numberOfTodos = ref(0);
    const limit = 5;
    const currentPage = ref(1);
    const searchText = ref("");

    const numberOfPages = computed(() => {
      return Math.ceil(numberOfTodos.value / limit);
    });

    const getTodo = async (page = currentPage.value) => {
      currentPage.value = page;
      try {
        const res = await axios.get(
          `http://localhost:3000/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${page}&_limit=${limit}`
        );
        numberOfTodos.value = res.headers["x-total-count"];
        todos.value = res.data;
      } catch (err) {
        console.log(err);
      }
    };

    getTodo();

    const addTodo = async (todo) => {
      error.value = "";

      try {
        await axios.post(`http://localhost:3000/todos`, {
          subject: todo.subject,
          completed: todo.completed,
        });

        getTodo(1);
      } catch (err) {
        console.log(err);
        error.value = "Something went wrong";
      }
    };

    const deleteTodo = async (index) => {
      error.value = "";
      const id = todos.value[index].id;
      try {
        await axios.delete(`http://localhost:3000/todos/${id}`);
        todos.value.splice(index, 1);
      } catch (err) {
        console.log(err);
        error.value = "Something went wrong";
      }
    };

    const toggleTodo = async (index) => {
      error.value = "";
      const id = todos.value[index].id;

      try {
        await axios.patch(`http://localhost:3000/todos/${id}`, {
          completed: !todos.value[index].completed,
        });
        todos.value[index].completed = !todos.value[index].completed;
      } catch (err) {
        console.log(err);
        error.value = "Something went wrong";
      }
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
