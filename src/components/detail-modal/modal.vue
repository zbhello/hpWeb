<script setup lang="ts">
import { ref } from "vue";
import type { IMODALCARD } from "./interface";
import request from "../../utils/http";
request({
  url: "equip/wxQrcode",
  method: "post",
});
const loading = ref(false);
withDefaults(defineProps<IMODALCARD>(), {});
</script>

<template>
  <div>
    <v-card :loading="loading">
      <v-card-actions>
        <v-btn>Click me</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<style scoped></style>
