<script setup lang="ts">
import { ref } from "vue";
import type { IMODALCARD } from "./interface";
import { onMounted } from "vue";
import http from "../../utils/http/index"; // needed for loading default image from CDN
import apiCof from "../../../api.cof";
import { reactive } from "vue";
import { computed } from "vue";
import { toPng } from "html-to-image";
import { useWindowSize } from "@vueuse/core";
import { useElementSize } from "@vueuse/core";
import { getCurrentInstance } from "vue";
const loading = ref(false);
const props = withDefaults(defineProps<IMODALCARD>(), {});
const loginbase64 = ref("");
const cardTitle = ref("");
const curUser = ref();
const isbig = ref();
const curData = computed(
  () =>
    useDetails.data.filter((item) => item.roleName == curUser.value)[0] ||
    useDetails.data[0]
);

//QQ部分

const qqregex = /'([^']*)'/g;
const qqMap = new Map<
  number,
  (qrsig: string, hash33: string, title: string) => void
>([
  [
    66,
    async (qrsig: string, hash33: string) => {
      setTimeout(() => {
        getStatusqq(qrsig, hash33);
      }, 500);
    },
  ],
  [
    67,
    (qrsig: string, hash33: string, title: string) => {
      setTimeout(() => {
        cardTitle.value = title;
        getStatusqq(qrsig, hash33);
      }, 500);
    },
  ],
  [
    666,
    async () => {
      loading.value = true;
      const result = await getQrCode();
      getStatusqq(result.headers.qrsig, result.headers.hash33);
    },
  ],
  [200, () => {}],
]);

//微信部分
const wxregex = /window\.[a-zA-Z_]+=(.*?)(?:;|$)/;
const wxKeyRegex = /window\.(.*?)=/;
const wxDetails = reactive({});
const useDetails = reactive<{ loaded: boolean; data: any[] }>({
  loaded: false,
  data: [],
});
const wxMap = new Map<number, (uuid: string) => void>([
  [408, (uuid: string) => getStatus(uuid)],
  [
    404,
    (uuid: string) => {
      cardTitle.value = "请在手机中确认";
      getStatus(uuid);
    },
  ],
  [
    666,
    async () => {
      loading.value = true;
      const result = await getQrCode();
      getStatus(result.headers.uuid);
    },
  ],
  [200, () => {}],
]);

function formatWxJson(data: any[]) {
  const userTemp = JSON.parse(JSON.stringify(data));
  userTemp.forEach((element: any) => {
    const { depot } = element;
    element.assginDepot = mergeArr(depot);
  });

  return userTemp;
}

function mergeArr(target: any[]) {
  const result: any[] = [];
  target.forEach((root: any) => {
    if (Array.isArray(root.detail) && root.detail.length > 0) {
      root.detail.forEach((one: any) => {
        one.items.forEach((two: any) => {
          if (Array.isArray(two.items) && two.items.length > 0) {
            result.push(...two.items);
          } else {
            result.push(two);
          }
        });
      });
    }
  });
  return result;
}
async function getStatus(uuid: string) {
  if (!uuid) return;
  loading.value = true;
  const { data }: any = await http({
    method: "post",
    url: `${(apiCof as any)[props.type].loginURL}?uuid=${uuid}`,
  }).catch(() => {
    loading.value = false;
  });
  loading.value = false;
  if (Array.isArray(data)) {
    useDetails.data = formatWxJson(data);
    useDetails.loaded = true;
    //处理JSON
  } else {
    //内有正确返回JSON
    const strData = data.split(";").filter((item: string) => item !== "");
    strData.forEach((str: string) => {
      const match = str.match(wxregex);
      (wxDetails as any)[wxKeyRegex.exec(str)![1]] = match![1];
    });

    wxMap.get(Number((wxDetails as any)[apiCof.wx.codeKey]))?.(uuid);
  }
}

async function getStatusqq(qrsin: string, hash: string) {
  if (!qrsin || !hash) return;
  loading.value = true;
  const { data }: any = await http({
    method: "post",
    url: `${
      (apiCof as any)[props.type].loginURL
    }?qrsig=${qrsin}&hash33=${hash}`,
  }).catch(() => {
    loading.value = false;
  });
  // loading.value = false;
  if (Array.isArray(data)) {
    useDetails.data = formatWxJson(data);
    useDetails.loaded = true;
    loading.value = false;

    //处理JSON
  } else {
    //内有正确返回JSON
    const strData = data.match(qqregex);
    if (strData) {
      const params = strData
        .map((match: string) => match.replace(/'/g, ""))
        .filter((item: string) => item.trim() !== "");

      qqMap.get(Number(params[0]))?.(qrsin, hash, params[3]);
    } else {
      qqMap.get(666)?.(qrsin, hash, "");
    }
  }
}

//公共部分
const { width, height } = useWindowSize();
async function getQrCode() {
  loading.value = true;
  useDetails.loaded = false;
  cardTitle.value = "正在获取登陆二维码";
  const result: any = await http({
    ...props.option,
    responseType: "blob",
  }).catch((err: any) => (loading.value = false));
  loading.value = false;
  loginbase64.value = URL.createObjectURL(result.data);
  cardTitle.value = "请登录";
  return result;
}

const emit = defineEmits<{
  (event: "modal-close"): void;
}>();
const targetheighttemp = ref(0);
const cardWidth = computed(() => (isbig.value ? width.value * 0.9 : undefined));
const isSelectbg = ref(false);
const bgColor = ref("#333");
const fontColor = ref("#fff");
const isSelectfontcolor = ref(false);
const curuserData = computed(() =>
  (curData as any).value.assginDepot.sort((a: any, b: any) => {
    if (a.quality < b.quality) {
      return 1;
    }
    if (a.quality > b.quality) {
      return -1;
    }
    return 0;
  })
);
const cardpos = computed(() => (isbig.value ? "absolute" : "static"));
const cardlocation = computed(() => (isbig.value ? "top" : undefined));
const isOpen = ref(true);
const pngtarget = ref();

const { height: targetHeight } = useElementSize(pngtarget);
targetheighttemp.value = JSON.parse(JSON.stringify(targetHeight.value)); // memorize target height for animation frame call. 这里使用屏幕的高度来计算一些额
function savepng() {
  if (!isbig.value) isbig.value = true;
  if (!pngtarget.value) return;
  toPng(pngtarget.value).then((dataUrl: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "screenshot.png";
    link.click();
  });
}
function salce() {
  if (isbig.value) {
    isSelectbg.value = false;
    isSelectfontcolor.value = false;
  }
  isbig.value = !isbig.value;
}
onMounted(async () => {
  const result = await getQrCode();
  props.option.type == "qq"
    ? getStatusqq(result.headers.qrsig, result.headers.hash33)
    : getStatus(result.headers.uuid);
  // for some reason this needs to be a string literal otherwise it can't be set using URL.revokeObject
});
</script>

<template>
  <div>
    <v-card
      :loading="loading"
      :width="cardWidth"
      :position="cardpos"
      :location="cardlocation"
    >
      <template #title>
        <div v-if="useDetails.loaded" class="flex flex-1 justify-end">
          <v-color-picker
            v-if="isSelectfontcolor"
            v-model:model-value="fontColor"
          ></v-color-picker>
          <v-btn
            class="ma-2"
            color="indigo"
            @click="(isbig = true) && (isSelectfontcolor = !isSelectfontcolor)"
          >
            字体颜色
          </v-btn>
          <v-color-picker
            v-if="isSelectbg"
            v-model:model-value="bgColor"
          ></v-color-picker>
          <v-btn
            class="ma-2"
            color="indigo"
            @click="(isbig = true) && (isSelectbg = !isSelectbg)"
          >
            选择颜色
          </v-btn>
          <v-btn class="ma-2" color="red" @click="emit('modal-close')">
            关闭
          </v-btn>
          <v-btn class="ma-2" color="blue" @click="salce">
            {{ isbig ? "缩小" : "放大" }}
          </v-btn>
          <v-btn class="ma-2" color="indigo" @click="savepng"> 保存图片 </v-btn>
        </div>
        <div class="flex items-center">
          <div
            class="flex items-center"
            v-if="
              !(
                useDetails.loaded &&
                useDetails.data.length > 0 &&
                Array.isArray(useDetails.data)
              )
            "
          >
            {{ cardTitle }}
          </div>
          <v-select
            v-else
            label="请选择角色"
            v-model="curUser"
            :items="useDetails.data.map((item) => item.roleName)"
          ></v-select>
        </div>
      </template>
      <template #default>
        <div
          ref="pngtarget"
          v-if="
            useDetails.loaded &&
            useDetails.data.length > 0 &&
            Array.isArray(useDetails.data)
          "
          :style="{ backgroundColor: bgColor, color: fontColor }"
          :class="[
            isbig
              ? 'flex flex-wrap  justify-start'
              : 'flex flex-wrap h-96 overflow-y-auto justify-start',
          ]"
        >
          <div class="flex flex-col w-full">
            <div class="flex font-bold text-xl justify-around">
              <div>{{ curData?.roleName }}</div>
              <div>{{ curData?.roleText[0] }}</div>
              <div>{{ curData?.roleText[1] }}</div>
              <div>{{ curData?.roleText[2] }}</div>
            </div>
            <div class="flex justify-around font-bold text-xl">
              <div>时装-{{ curData.depot[0]?.count }}</div>
              <div>战备-{{ curData.depot[4]?.count }}</div>
            </div>
            <div class="flex justify-around font-bold text-xl">
              <div>
                粉装-{{
                  curuserData?.filter((item: any) => item.quality == 6).length
                }}
              </div>
              <div>套装-{{ curData.depot[0]?.detail[0]?.items?.length }}</div>
            </div>
          </div>
          <template v-for="item in curuserData" :key="item.uin">
            <div class="flex flex-col items-center w-32">
              <img class="w-20 h-20" :src="item.imageUrl" alt="" />
              <div>{{ item.itemName }}</div>
            </div>
          </template>
        </div>
        <div v-else class="h-96 flex items-center justify-center">
          <img :src="loginbase64" alt="" />
        </div>
      </template>
    </v-card>
  </div>
</template>

<style scoped></style>
