<template>
  <div class="print">
    <div class="title">
      <h1>{{ contestName }}賽程表</h1>
      <div class="type">{{ CONTEST_TYPE[type].ch }}</div>
    </div>
    <img src="../assets/img/print-line.jpg" alt="" />
    <Single v-if="type === CONTEST_TYPE.SINGLE.id" class="single" />
    <Double v-if="type === CONTEST_TYPE.DOUBLE.id" />
    <Round v-if="type === CONTEST_TYPE.ROUND.id" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { CONTEST_TYPE } from "../utils/Enum";
import Single from "../components/print/Single.vue";
import Double from "../components/print/Double.vue";
import Round from "../components/print/Round.vue";
export default {
  data() {
    return {
      CONTEST_TYPE,
    };
  },
  computed: {
    ...mapState(["type", "contestName"]),
  },
  components: { Single, Double, Round },
};
</script>

<style lang="scss" scoped>
.print {
  margin: 20px;
  width: fit-content;
}

.title {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.type {
  margin: 0 10px;
  color: $dark-200;
}

img {
  width: 500px;
  margin: 10px 0 20px 0;
}

h1 {
  font-weight: bolder;
  font-size: 22px;
}
</style>

<style lang="scss">
.line {
  height: fit-content;
  width: 20px;
  margin-left: -1px;
  margin-right: 20px;
  display: flex;
  flex-direction: column;
}

.game {
  position: relative;
}

.round:not(.no-line) {
  &:not(:first-child) > .game::before {
    content: "";
    width: 20px;
    height: 1px;
    background-color: $dark-100;
    position: absolute;
    left: -20px;
    top: 50%;
  }
}
</style>
