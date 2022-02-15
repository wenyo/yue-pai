<template>
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
    ...mapState(["type"]),
  },
  components: { Single, Double, Round },
};
</script>