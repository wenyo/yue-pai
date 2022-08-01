<template>
  <span>
    <Button :type="BUTTON_TYPE.FIVE" :click_fun="triggerUpload">讀取舊檔</Button>
    <input v-show="false" type="file" ref="readFile" @change="fileChoose" />
  </span>
</template>
<script>
import { ref } from "vue";
import router from "../router";
import { mapMutations } from "vuex";
import { BUTTON_TYPE } from "../utils/Enum";
import Button from "./Button.vue";
export default {
  props: ["ref_value"],
  components: { Button },
  setup() {
    const readFile = ref();
    const triggerUpload = () => {
      readFile.value.click();
    };
    return { readFile, triggerUpload };
  },
  data() {
    return {
      BUTTON_TYPE,
    };
  },
  methods: {
    ...mapMutations(["filesContentGet", "contestReset"]),
    fileChoose($event) {
      const file = $event.target.files[0];
      const blob = new Blob([file], { type: "application/json" });
      let reader = new FileReader();

      reader.addEventListener("load", async () => {
        const fileContent = JSON.parse(reader.result);
        await this.contestReset(false);
        await this.filesContentGet(fileContent);
        await router.push({ name: "StepThree" });
      });

      reader.readAsText(blob);
    },
  },
};
</script>
