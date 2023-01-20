<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">RunningLearner</router-link>

      <ul class="navbar-nav mr-auto">
        <li class="nav-item active">
          <router-link class="nav-link" to="/todos">Todos</router-link>
        </li>
      </ul>
    </div>
  </nav>
  <router-view />
</template>

<script>
export default {};
</script>

<style></style>
