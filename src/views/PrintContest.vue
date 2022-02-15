<template>
  <div class="title">
    <h1>{{ contestName }}賽程表</h1>
    <div class="type">{{ CONTEST_TYPE[type].ch }}</div>
  </div>
  <img src="../assets/img/print-line.jpg" alt="" />
  <Single v-if="type === CONTEST_TYPE.SINGLE.id" />
  <Double v-if="type === CONTEST_TYPE.DOUBLE.id" />
  <Round v-if="type === CONTEST_TYPE.ROUND.id" />
</template>

<script>
import { mapState } from "vuex";
import { CONTEST_TYPE } from "../utils/Enum";
import Single from "../components/print/Single.vue";
import Double from "../components/print/Double.vue";
import Round from "../components/print/Round.vue";
export default {
  mounted() {
    // window.print();
  },
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
.title {
  display: flex;
  flex-direction: row;
}

img {
  width: 500px;
}

h1 {
  font-weight: bolder;
  font-size: 22px;
}
</style>