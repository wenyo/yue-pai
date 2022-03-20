<template>
  <div class="print">
    <div class="title">
      <h1>
        <img v-if="imgBase64" :src="imgBase64" class="contest-img" />
        <p>{{ contestName }}賽程表</p>
      </h1>
      <div class="type">{{ CONTEST_TYPE[type].ch }}</div>
    </div>
    <img src="../assets/img/print-line.jpg" class="print-line" />
    <Single v-if="type === CONTEST_TYPE.SINGLE.id" class="single" />
    <Double v-if="type === CONTEST_TYPE.DOUBLE.id" />
    <Round v-if="type === CONTEST_TYPE.ROUND.id" />
    <div class="noPrint"></div>
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
    ...mapState(["type", "contestName", "imgBase64"]),
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
  margin-left: 30px;
  color: $dark-200;
}

.print-line {
  width: 500px;
  margin: 10px 0 20px 0;
}

h1 {
  font-weight: bolder;
  font-size: 42px;
  display: flex;
  align-items: center;
}

.contest-img {
  width: 100px;
  margin-right: 10px;
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
  &:not(:first-child) > .no-bye {
    .front-line {
      width: 20px;
      height: 1px;
      border-top: 1px solid $dark-100;
      position: absolute;
      left: -20px;
      top: 50%;
    }
  }
}
</style>
