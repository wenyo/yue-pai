<template>
  <div class="home">
    <div class="contain">
      <div class="logo">
        <img src="../assets/img/logo-bg.svg" alt="" />
        <img src="../assets/img/logo-yue_pai.svg" alt="" />
      </div>
    </div>
  </div>
  <footer>
    <img src="../assets/img/logo-dream_way.svg" alt="" />
  </footer>
</template>

<script>
export default {
  name: "Home",
  components: {},
};
</script>

<style scoped lang="scss">
.home {
  width: 100vw;
  height: 100vh;
  background: url("../assets/img/bg-homepage.jpg") center;
  background-repeat: no-repeat;
  background-size: cover;
}

.contain {
  width: 60%;
  background-color: bisque;
}

.logo {
  width: 50%;
  position: relative;
  img {
    position: absolute;
  }
}

footer {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 12vh;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 35%;
  }
}
</style>
