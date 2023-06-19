<script setup lang="ts">
import { ref } from "vue";
import {
  createModal,
  requestList,
  watcher,
} from "./components/detail-modal/index";
import modal from "./components/detail-modal/modal.vue";
import apiCof from "../api.cof";
import { onUnmounted } from "vue";

onUnmounted(() => {
  watcher?.();
});
function wxlogin() {
  createModal({ url: apiCof.wx.getQrCodeURL, method: "post", type: "wx" });
}

function qqLogin() {
  createModal({ url: apiCof.qq.getQrCodeURL, method: "post", type: "qq" });
}
</script>

<template>
  <div class="main">
    <!-- <div
      class="flex justify-center flex1 text-3xl font-semibold font-sans mt-10"
    >
      和平精英获取装备
    </div> -->
    <div class="main-action flex w-52 mt-5 justify-between">
      <v-btn
        variant="elevated"
        class="text-none mb-4"
        color="indigo-darken-3"
        @click="wxlogin"
      >
        wx登录
      </v-btn>
      <v-btn
        variant="elevated"
        @click="qqLogin"
        class="text-none mb-4"
        color="indigo-darken-3"
        >QQ登录</v-btn
      >
    </div>
    <div class="card-container">
      <v-container>
        <v-row no-gutters>
          <v-col
            v-for="(item, index) in requestList"
            :key="index"
            cols="3"
            xl="3"
            md="6"
          >
            <v-sheet class="ma-2 pa-2"
              ><modal :option="item" :type="item.type!"></modal>
            </v-sheet>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>
</template>

<style scoped>
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  overflow: hidden auto;
}
.card-container {
  width: 100%;
}
</style>
