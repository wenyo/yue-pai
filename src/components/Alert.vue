<template>
  <div id="alert-other" class="alert">
    <i class="icon icon-xmark-solid"></i>
    <p>{{ alert.msg }}</p>
  </div>
</template>
<style lang="scss" scoped></style>

<script>
export default {
  props: {
    alertClose: Function,
    alert: Object,
    autoClose: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    if (this.autoClose) {
      window.setTimeout(this.alertClose, 3000);
    }
  },
};
</script>

<style lang="scss" scoped>
#alert {
  background-color: $primary-color-five;
  position: fixed;
  top: 50%;
  left: 50%;
  width: 30%;
  max-width: 400px;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  border-radius: 2px;
  padding: 30px 20px;

  p {
    line-height: 20px;
    font-weight: bold;
  }
}

.icon {
  font-size: 100px;
  color: $primary-color-second;
  margin-bottom: 20px;
}

.bg-gray {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background-color: $dark-100;
  z-index: 9;
}
</style>
