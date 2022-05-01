<template>
  <router-view :alert-open="alertOpen" v-if="allowUse" />
  <Alert
    v-if="alertShow"
    :alert-close="alertClose"
    :alert="alert"
    :auto-close="autoClose"
  />
</template>

<script>
import Alert from "./components/Alert.vue";
import limit from "../public/limit.json";

export default {
  data() {
    return {
      allowUse: false,
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
    checkTime() {
      const now = new Date().getTime();
      const start = limit.start;
      const end = limit.end;
      if (now < start) {
        this.autoClose = false;
        return this.alertOpen({ msg: "尚未開放使用" });
      }
      if (now > end) {
        this.autoClose = false;
        return this.alertOpen({ msg: "已過期，請重新取得許可" });
      }
      this.allowUse = true;
    },
  },
};
</script>
