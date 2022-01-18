<template>
  <header>
    <div class="logo">
      <img src="../assets/img/logo-yue_pai.svg" alt="" />
    </div>
    <div class="title">
      <input type="text" name="" id="" />
    </div>
    <Button :type="BUTTON_TYPE.FIVE" :name="'read-file'">讀取舊檔</Button>
  </header>
</template>

<script>
import { BUTTON_TYPE } from "../utils/Enum";
import Button from "../components/Button";
export default {
  data() {
    return {
      BUTTON_TYPE,
    };
  },
  components: { Button },
};
</script>

<style lang="scss" scope>
header {
  position: fixed;
  left: 0;
  right: 0;
  height: 75px;
  background-color: $primary-color-third;
  background: url("../assets/img/header.jpg") top;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: flex-end;

  div {
    display: inline-block;
  }
}

.logo {
  width: 200px;
  transform: translateY(15px);
}

.title {
  transform: translateY(10px);
}

.read-file {
  position: fixed;
  right: 10px;
  margin-bottom: 5px;
}
</style>
