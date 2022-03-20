<template>
  <router-view :alert-open="alertOpen" />
  <Alert v-if="alertShow" :alert-close="alertClose" />
</template>

<script>
import Alert from "./components/Alert.vue";
export default {
  data() {
    return {
      alertShow: false,
      alert: {
        msg: "",
      },
    };
  },
  components: { Alert },
  methods: {
    alertCall({ msg, show }) {
      this.alertShow = show;
      this.alert = msg;
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
