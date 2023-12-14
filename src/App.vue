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
const gameRef = ref();
onUnmounted(() => {
  watcher?.();
});
function wxlogin() {
  console.log(gameRef.value)
  gameRef.value.getQrCode({
    url: apiCof.wx.getQrCodeURL,
    method: "post",
    type: "wx",
    timeTmp: new Date().getTime(),
  })
  // createModal({
  //   url: apiCof.wx.getQrCodeURL,
  //   method: "post",
  //   type: "wx",
  //   timeTmp: new Date().getTime(),
  // });
}

function qqLogin() {
  console.log(gameRef.value)
  gameRef.value.getQrCode({
    url: apiCof.qq.getQrCodeURL,
    method: "post",
    type: "qq",
    timeTmp: new Date().getTime(),
  })
  // createModal({
  //   url: apiCof.qq.getQrCodeURL,
  //   method: "post",
  //   type: "qq",
  //   timeTmp: new Date().getTime(),
  // });
}

function modalClose(index: number) {
  requestList.splice(
    requestList.findIndex((item) => item.timeTmp == index),
    1
  );
}
</script>

<template>
  <div class="main">
    <!-- <div
      class="flex justify-center flex1 text-3xl font-semibold font-sans mt-10"
    >
      和平精英获取装备
    </div> -->
    <div class=" flex w-52 mt-5 justify-between">
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
        <v-row  no-gutters>
          <v-col
            cols="12"
          >
            <v-sheet  max-width="900"  class=" pa-5">
              <modal ref="gameRef"></modal>
            </v-sheet>
          </v-col>
        </v-row>

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

</style>
