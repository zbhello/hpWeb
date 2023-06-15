<script setup lang="ts">
import { createModal } from "./components/detail-modal/index";

function wxlogin() {
  createModal();
}
</script>

<template>
  <div class="main">
    <div
      class="flex justify-center flex1 text-3xl font-semibold font-sans mt-10"
    >
      和平精英获取装备
    </div>
    <div class="main-action flex w-52 mt-5 justify-between">
      <v-btn variant="elevated" class="text-none mb-4" color="indigo-darken-3"
        ><div @click="wxlogin">wx登录</div>
      </v-btn>
      <v-btn variant="elevated" class="text-none mb-4" color="indigo-darken-3"
        >QQ登录</v-btn
      >
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
</style>
