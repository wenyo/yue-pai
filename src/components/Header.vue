<template>
  <header>
    <div class="logo">
      <img src="../assets/img/logo-yue_pai.svg" alt="logo" />
    </div>
    <div class="title">
      <input
        type="text"
        name=""
        id=""
        v-model="contestNameShow"
        placeholder="請填入賽事名稱"
      />
    </div>
    <Button :type="BUTTON_TYPE.FIVE" :name="'read-file'">讀取舊檔</Button>
  </header>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { BUTTON_TYPE } from "../utils/Enum";
import Button from "../components/Button";
export default {
  data() {
    return {
      BUTTON_TYPE,
    };
  },
  components: { Button },
  computed: {
    ...mapState(["contestName"]),
    contestNameShow: {
      get() {
        return this.contestName;
      },
      set(value) {
        this.contestNameChange(value);
      },
    },
  },
  methods: {
    ...mapMutations(["contestNameChange"]),
  },
};
</script>

<style lang="scss" scope>
header {
  height: 75px;
  margin-bottom: 25px;
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
  position: absolute;
  right: 10px;
  margin-bottom: 5px;
}
</style>
