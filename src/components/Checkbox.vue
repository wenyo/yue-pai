<template>
  <label>
    <input
      class="checkbox-seed"
      type="checkbox"
      @change="changeFunc"
      :checked="isCheck"
    />
    <i class="icon-seedling-solid seed"></i>
  </label>
</template>

<script>
export default {
  props: ["changeFunc", "isCheck"],
};
</script>

<style lang="scss" scoped>
label {
  cursor: pointer;
}

.seed {
  position: relative;
  color: $primary-color-third#{ab};
  border-radius: 50%;
  padding: 4px 3px 3px 3px;
  transition: all 0.3s;
  text-shadow: 0 0 5px $primary-color-five;

  &::after {
    position: absolute;
  }

  &:hover {
    text-shadow: 2px 2px 5px $primary-color-five;
  }
}

.checkbox-seed {
  display: none;
}

.checkbox-seed:checked ~ .seed {
  text-shadow: 2px 2px 5px $primary-color-five;
  color: $primary-color-third;
}
</style>