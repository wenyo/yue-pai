<template>
  <div class="wrap">
    <Header />
    <div class="outer">
      <StepLine :now-step="1" />
      <div class="contain">
        <h3 class="step-title">1.1/選擇賽制與隊伍數</h3>
        <div class="article">
          <div class="setting-item">
            <label for="contest">選擇賽制</label>
            <select id="contest" :value="type" @change="typeChange">
              <option value="">請選擇</option>
              <option v-for="(info, type) in CONTEST_TYPE" :key="type" :value="info.id">
                {{ info.ch }}
              </option>
            </select>
          </div>
          <div class="setting-item">
            <label for="team-count">輸入隊伍數</label>
            <input
              class="size-l"
              type="number"
              id="team-count"
              min="0"
              v-model="teamCountNum"
              @change="roundScoreDefault"
              :disabled="type === ''"
            />
          </div>
          <div class="setting-item" v-if="type === CONTEST_TYPE.ROUND.id">
            <label for="group-count">輸入組數</label>
            <input
              class="size-l"
              type="number"
              id="group-count"
              :min="GROUP_DEFAULT"
              v-model="roundGroupCountNum"
              :defaultValue="GROUP_DEFAULT"
              :disabled="type === ''"
            />
            <p>{{ teamNumInGroup }}人/組</p>
          </div>
        </div>
        <h3 class="step-title">1.2/上傳圖片(非必填，圖片長寬比建議為1:1~1:2)</h3>
        <div class="article">
          <input class="file-input" ref="uploadImage" type="file" accept="image/*" @change="imgChange" />
          <Button :type="BUTTON_TYPE.FIVE" :click_fun="resetImg" :disabled="!imgBase64">清除圖片</Button>
          <img class="preview-img" :src="imgBase64" v-if="imgBase64" />
        </div>
      </div>
      <div class="step">
        <router-link to="/" custom v-slot="{ navigate }">
          <Button :type="BUTTON_TYPE.FIVE" :click_fun="navigate">上一步</Button>
        </router-link>
        <router-link to="/step_two" custom v-slot="{ navigate }">
          <Button
            :type="BUTTON_TYPE.SECOND"
            :click_fun="navigate"
            :disabled="type === '' || teamCount <= 0 || teamNumInGroup % 1 > 0"
            >下一步</Button
          >
        </router-link>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import { ref } from "vue";
import { mapMutations, mapState, mapActions } from "vuex";
import { CONTEST_TYPE, BUTTON_TYPE, GROUP_DEFAULT } from "../utils/Enum.js";
import Header from "../components/Header.vue";
import StepLine from "../components/StepLine.vue";
import Button from "../components/Button.vue";
import Footer from "../components/Footer.vue";

export default {
  props: ["alertOpen"],
  data() {
    return {
      CONTEST_TYPE,
      BUTTON_TYPE,
      GROUP_DEFAULT,
    };
  },
  setup() {
    const uploadImage = ref(null);
    return { uploadImage };
  },
  components: { Header, StepLine, Button, Footer },
  computed: {
    ...mapState(["type", "teamCount", "imgBase64", "roundGroupCount"]),
    teamCountNum: {
      get() {
        return this.teamCount;
      },
      set(value) {
        this.teamCountChange(parseInt(value));
      },
    },
    roundGroupCountNum: {
      get() {
        return this.roundGroupCount;
      },
      set(value) {
        let insertValue = parseInt(value);

        if (insertValue !== insertValue) insertValue = GROUP_DEFAULT;
        this.roundGroupCountChange(insertValue);
      },
    },
    teamNumInGroup() {
      console.log(this.roundGroupCount);
      return (this.teamCountNum / this.roundGroupCount).toFixed(2);
    },
  },
  methods: {
    ...mapMutations(["typeChange", "teamCountChange", "roundScoreDefault", "imgBase64Change", "roundGroupCountChange"]),
    ...mapActions(["teamCountDataChange"]),
    imgChange() {
      const file = this.uploadImage.files[0];
      this.imgToBase64(file);
    },
    imgToBase64(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgBase64Change({ img: reader.result });
      };
      reader.onerror = (error) => {
        console.log("Error: ", error);
        this.alertOpen({ msg: "出了一些錯誤，請再嘗試一次" });
      };
    },
    resetImg() {
      this.imgBase64Change({ img: "" });
      this.uploadImage = null;
    },
  },
};
</script>

<style lang="scss" scoped>
.setting-item {
  margin-bottom: 20px;

  label {
    display: block;
    margin-bottom: 6px;
    font-weight: bolder;
  }
}

.article {
  margin-bottom: 40px;
}

.preview-img {
  display: block;
  width: 200px;
  margin-top: 20px;
}
</style>
