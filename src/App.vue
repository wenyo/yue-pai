<template>
  <div>
    <router-view :alert-open="alertOpen" />
    <Alert v-if="alertShow" :alert-close="alertClose" :alert="alert" :auto-close="autoClose" />
  </div>
</template>

<script>
import Alert from "./components/Alert.vue";

export default {
  data() {
    return {
      alertShow: false,
      autoClose: true,
      alert: {
        msg: "",
      },
    };
  },
  mounted() {
    this.checkTime();
  },
  components: { Alert },
  methods: {
    alertCall({ msg, show }) {
      this.alertShow = show;
      this.alert.msg = msg;
    },
    alertOpen({ msg }) {
      this.alertCall({ msg, show: true });
    },
    alertClose() {
      this.alertCall({ msg: "", show: false });
    },
  },
};
</script>
