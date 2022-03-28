<template>
  <label>
    <input class="checkbox-seed" type="checkbox" />
    <i class="icon-seedling-solid seed"></i>
  </label>
</template>

<script>
export default {
  props: ["changeFunc"],
};
</script>

<style lang="scss" scoped>
label {
  cursor: pointer;
}

.seed {
  position: relative;
  color: $primary-color-third;
  opacity: 0.3;
  transition: all 0.1s;

  &::after {
    position: absolute;
  }
}

.checkbox-seed {
  display: none;

  &:checked ~ .seed {
    opacity: 1;
  }
}
</style>