<template lang="html">
  <div class="dashboard">
    <transition name="fade">
      <div class="container" id="content">
        <div class="jumbotron text-center">
          <h1 class="display-1 text-uppercase text-strong">Velkommen</h1>
          <p class="lead">byHands administrasjonsområde</p>
          <hr class="my-4">
          <p class="lead">
            <slot></slot>
          </p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="css">
</style>
