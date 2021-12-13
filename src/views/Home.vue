<template>
  <div class="home">
    <div class="contain">
      <div class="logo">
        <img src="../assets/img/logo-bg.svg" alt="" />
        <img src="../assets/img/logo-yue_pai.svg" alt="" />
      </div>
      <ul>
        <li v-for="(info, type) in CONTEST_TYPE" :key="type">{{ info.ch }}</li>
      </ul>
      <div>
        <button>讀取舊檔</button>
        <router-link to="/step_one" custom v-slot="{ navigate }">
          <button @click="navigate">開新賽程</button>
        </router-link>
      </div>
    </div>
    <footer>
      <img src="../assets/img/logo-dream_way.svg" alt="" />
    </footer>
  </div>
</template>

<script>
import { CONTEST_TYPE } from "../utils/Enum";
export default {
  name: "Home",
  data() {
    return {
      CONTEST_TYPE,
    };
  },
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
  height: 88vh;
}

.logo {
  width: 50%;
  position: relative;
  img {
    // position: absolute;
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
  background-color: $primary-color-master;

  img {
    height: 35%;
  }
}
</style>
