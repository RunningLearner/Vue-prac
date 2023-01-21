<template>
  <div v-for="(todo, index) in todos" :key="todo.id" class="card mt-2">
    <div
      class="card-body p-2 d-flex align-items-center"
      style="cursor: pointer"
      @click="moveToPage(todo.id)"
    >
      <div class="flex-grow-1">
        <input
          class="ml-2 mr-2"
          type="checkbox"
          :checked="todo.completed"
          @change="toggleTodo(index, $event)"
          @click.stop
        />
        <span :class="{ todo: todo.completed }">{{ todo.subject }}</span>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click.stop="openModal(todo.id)">
          Delete
        </button>
      </div>
    </div>
  </div>
  <Modal v-if="showModal" @close="closeModal" />
</template>

<script>
import { useRouter } from "vue-router";
import Modal from "@/components/Modal.vue";
import { ref } from "vue";

export default {
  components: { Modal },
  props: {
    todos: {
      type: Array,
      required: true,
    },
  },
  emits: ["toggle-todo", "delete-todo"],
  setup(props, { emit }) {
    const router = useRouter();
    const showModal = ref(false);
    const showDeleteId = ref(null);

    const toggleTodo = (index, event) => {
      emit("toggle-todo", index, event.target.checked);
    };

    const openModal = (id) => {
      showDeleteId.value = id;
      showModal.value = true;
    };

    const closeModal = () => {
      showDeleteId.value = null;
      showModal.value = false;
    };

    const deleteTodo = (index) => {
      emit("delete-todo", index);
    };

    const moveToPage = (todoId) => {
      router.push({ name: "Todo", params: { id: todoId } });
    };

    return {
      moveToPage,
      toggleTodo,
      deleteTodo,
      showModal,
      openModal,
      closeModal,
    };
  },
};
</script>

<style></style>
