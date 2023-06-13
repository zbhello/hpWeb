<script setup lang="ts">
import { ref } from "vue";

const dialogisShow = ref(false);
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
        >wx登录
        <v-dialog
          v-model="dialogisShow"
          activator="parent"
          :scrim="false"
          width="auto"
        >
          <v-card>
            <v-card-text>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" block @click="">Close Dialog</v-btn>
            </v-card-actions>
          </v-card></v-dialog
        >
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
