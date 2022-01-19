<template>
  <ul>
    <template v-for="idx in Object.values(STEP_IDX)" :key="idx">
      <li v-if="nowStep === idx" class="now-step"></li>
      <li :class="{ 'prev-step': nowStep > idx }" v-else>{{ idx }}</li>
    </template>
  </ul>
</template>

<script>
import { STEP_IDX } from "../utils/Enum";
export default {
  props: ["nowStep"],
  data() {
    return {
      STEP_IDX,
    };
  },
};
</script>

<style lang="scss" scoped>
ul {
  display: flex;
  justify-content: space-between;
}

li {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("../assets/img/step-bg.svg") no-repeat;
  color: $dark-400;
  position: relative;

  &.now-step {
    background: url("../assets/img/step-now.svg") no-repeat;
  }

  &.prev-step {
    color: $dark-100;
  }
}

ul {
  & :not(:last-child)::after {
    content: "";
    width: calc(50vw - 20px);
    height: 1px;
    position: absolute;
    z-index: -1;
    left: 0;
    border-bottom: 1px dashed $dark-100;
  }
}
</style>
