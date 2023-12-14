<script setup lang="ts">
import { ref,reactive, nextTick,computed ,defineExpose,defineEmits} from "vue";
import http from "../../utils/http/index"; // needed for loading default image from CDN
import apiCof from "../../../api.cof";
import { toPng } from "html-to-image";
import { useWindowSize } from "@vueuse/core";
import { useElementSize } from "@vueuse/core";
import { IOption } from "../../utils/http/inteface";
import {img5,img6,img7} from './b64Img.js'
const loading = ref(false);
const loginbase64 = ref("");
const avatarbase64 = ref("");
const cardTitle = ref("");

const isbig = ref();
const RequestParam = ref<IOption>()//保存请求参数
const resData = ref<any>()//保存返回结果
let timeNumber = ref<any>(0)


const useDetails = reactive<{ loaded: boolean; data: any[] }>({
  loaded: false,
  data: [],
});

const Goldcoin = reactive<any>([
  {key:'totalCharm',name:'热力值',src:'/src/assets/reli.png'},
  {key:'ticket',name:'点券',src:'/src/assets/dianjuan.png'},
  {key:'ironCoin',name:'物资',src:'/src/assets/wuzi.png'},
  {key:'itemCoin',name:'军需',src:'/src/assets/junxu.png'},
  {key:'luckyCoin',name:'幸运币',src:'/src/assets/xingyun.png'}
])
const medalConfig = reactive<any>([
  {key:'highestDivUrl',name:''},
  {key:'wangpaiIcon',name:'王牌'},
  {key:'zywpIcon',name:'卓越'},
  {key:'cqwpIcon',name:'传奇'},
  {key:'jswpIcon',name:'绝世'}
])
const curData = computed(
    () => {
      return useDetails.data
    }
);

const skinInfo = reactive([
  {tabName:'时装',count:0,data:[]},
  {tabName:'枪械',count:0,data:[]},
  {tabName:'粉装',count:0,show:true,data:[]},
  {tabName:'特效枪',count:0,show:true,data:[]},
  {tabName:'载具',count:0,show:true,data:[]},
  {tabName:'降落伞 飞行器',show:true,count:0,data:[]}
])


/**
 * 过滤粉装数量
 * @param detail
 */
function countQualitySixItems(detail) {
  let count = 0;
  if (Array.isArray(detail)) {
    detail.forEach((item) => {
      if (item.items && Array.isArray(item.items)) {
        item.items.forEach((subItem) => {
          if (subItem.quality >= 6) {
            count++;
          }
        });
      }
      if (item.detail) {
        count += countQualitySixItems(item.detail);
      }
    });
  }
  return count;
}

/**
 * 过滤特效枪
 * @param detail
 */
function levelQualitySixItems(detail) {
  let count = 0;
  if (Array.isArray(detail)) {
    detail.forEach((item) => {
      if (item.items && Array.isArray(item.items)) {
        item.items.forEach((subItem) => {
          subItem.items.forEach((childItem=>{
            if (childItem.level) {
              count++;
            }
          }))
        });
      }
      if (item.detail) {
        count += countQualitySixItems(item.detail);
      }
    });
  }
  return count;
}

/**
 * 读取图片
 * @param name
 */
function getImageUrl(name) {
  if(name == 5){
    return new URL(`${img5}`, import.meta.url).href
  }
  if(name == 6){
    return new URL(`${img6}`, import.meta.url).href
  }
  if(name == 7){
    return new URL(`${img7}`, import.meta.url).href
  }
}

/**
 * 微信登录
 * @param uuid
 */
 function getStatus(uuid: string) {

  return new Promise((resolve, reject)=>{
    if (!uuid) return;
    loading.value = true;
    http({
      method: "post",
      url: `${(apiCof as any)[RequestParam.value.type].loginURL}?uuid=${uuid}`,
    }).then((res)=>{
      cardTitle.value = '登录成功';
      loading.value = false;
      clearTimeout(timeNumber.value)
      const {data} = res.data
      if(data.equipInfo[0].detail){
        data.equipInfo[0].detail = [data.equipInfo[0].detail[0]]//删除套装其余数据
      }
      data.equipInfo.splice(2,1)
      //时装

      skinInfo.forEach((item,index)=>{
        switch (index) {
          case 0://时装
            item.count =  data.equipInfo[0].detail[0].items.length
            //item.data = data.equipInfo[0]
            break
          case 1://枪械
            item.count = data.equipInfo[1].count
            //item.data = data.equipInfo[1]
            break
          case 2://粉装
            item.count = countQualitySixItems(data.equipInfo[0].detail)
            item.data = data.equipInfo[0]
            break
          case 3://特效
            item.count = levelQualitySixItems(data.equipInfo[1].detail)
            item.data = data.equipInfo[1]
            break
          case 4://载具
            item.count = data.equipInfo[2].count
            item.data = data.equipInfo[2]
            break
          case 5://降落伞
            item.count = countQualitySixItems(data.equipInfo[3].detail)
            item.data = data.equipInfo[3]
            break
        }

      })

      useDetails.data = data;
      useDetails.loaded = true;
      resolve('成功')
    }).catch((err) => {
      cardTitle.value = err.data.msg;
      if(err.data.code == 666 || err.data.code == 65){
        loading.value = false;
        clearTimeout(timeNumber.value)
      }
      resolve('失败')
    });
  })
}

/**
 * 获取qq扫码状态与登录信息
 * @param qrsin
 * @param hash
 */
function getStatusqq(qrsin: string, hash: string) {
  return new Promise((resolve,reject)  => {
    if (!qrsin || !hash) return reject('参数错误');
    http({
      method: "post",
      url: `${
          (apiCof as any)[RequestParam.value.type].loginURL
      }?qrsig=${qrsin}&hash33=${hash}`,
    }).then((res)=>{
      cardTitle.value = '登录成功';
      loading.value = false;

      clearTimeout(timeNumber.value)
      const {data} = res.data
      //getAvatar(data.roleInfo.avatar)
      if(data.equipInfo[0].detail){
        data.equipInfo[0].detail = [data.equipInfo[0].detail[0]]//删除套装其余数据
      }
      data.equipInfo.splice(2,1)
      //时装

      skinInfo.forEach((item,index)=>{
        switch (index) {
          case 0://时装
            item.count =  data.equipInfo[0].detail[0].items.length
            //item.data = data.equipInfo[0]
            break
          case 1://枪械
            item.count = data.equipInfo[1].count
            //item.data = data.equipInfo[1]
            break
          case 2://粉装
            item.count = countQualitySixItems(data.equipInfo[0].detail)
            item.data = data.equipInfo[0]
            break
          case 3://特效
            item.count = levelQualitySixItems(data.equipInfo[1].detail)
            item.data = data.equipInfo[1]
            break
          case 4://载具
            item.count = data.equipInfo[2].count
            item.data = data.equipInfo[2]
            break
          case 5://降落伞
            item.count =countQualitySixItems(data.equipInfo[3].detail)
            item.data = data.equipInfo[3]
            break
        }

      })
      console.log(data)
      useDetails.data = data;
      useDetails.loaded = true;
      resolve('成功')
    }).catch((err) => {
      cardTitle.value = err.data.msg;
      if(err.data.code == 666 || err.data.code == 65){
        loading.value = false;
        clearTimeout(timeNumber.value)
      }
      resolve('失败')
    });
  })
}

//公共部分height
const {width} = useWindowSize();

/**
 * 获取登录二维码
 * @param options
 */
async function getQrCode(options?: any) {
  if (timeNumber.value) {
    clearTimeout(timeNumber.value)
  }

  RequestParam.value = options//缓存获取二维码参数
  loading.value = true;
  useDetails.loaded = false;
  cardTitle.value = "正在获取登陆二维码";

  resData.value = await http({
    ...options,
    responseType: "blob",
  }).catch((err: any) => (loading.value = false));

  loginbase64.value = URL.createObjectURL(resData.value.data);
  cardTitle.value = "请扫码";
  scheduleApiCall()
}


/**
 * 计时器调度
 * 循环访问api
 */
async function  scheduleApiCall() {
  RequestParam.value.type == "qq"
      ? await getStatusqq(resData.value.headers.qrsig, resData.value.headers.hash33)
      : await getStatus(resData.value.headers.uuid)
  console.log(timeNumber.value)
  if(  loading.value){
    timeNumber.value = setTimeout(scheduleApiCall, 2000)
  }

}

/**
 * 导出事件
 */
const emit = defineEmits<{
  (event: "modal-close"): void;
}>();
/**
 * 暴露方法与数据给ref
 */
defineExpose({
  getQrCode
})
const targetheighttemp = ref(0);
const bgColor = ref("#333");
const fontColor = ref("#fff");

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

const pngtarget = ref();
const {height: targetHeight} = useElementSize(pngtarget);
targetheighttemp.value = JSON.parse(JSON.stringify(targetHeight.value)); // memorize target height for animation frame call. 这里使用屏幕的高度来计算一些额
async function savepng() {
   await nextTick()
  if (!pngtarget.value) return;
  const userId =  useDetails.data.roleInfo.userId
  toPng(pngtarget.value).then((dataUrl: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = userId+".png";
    link.click();
  });
}


</script>
<template>
  <v-card
      :loading="loading"
  >
    <template #title>
      <div  class="flex justify-between">
        <v-card-text class="text-h6 px-0">{{cardTitle}}</v-card-text>
        <v-btn v-if="useDetails.loaded" class="ma-2" color="indigo" @click="savepng"> 保存图片</v-btn>
      </div>
    </template>

    <template #default>
      <div
          ref="pngtarget"
          v-if="useDetails.loaded"
          :style="{ backgroundColor: bgColor, color: fontColor }"
      >
          <v-row   no-gutters >
            <v-col  cols="12" md="7" lg="7" class="d-flex flex-column " >
              <div class="flex flex-wrap align-center justify-between text-sm" style="background-color: #414e61;padding-right: 10px">
<!--                头像-->
                <v-img  aspect-ratio="1" cover max-height="50" max-width="50" src="/src/assets/xiangkuang.png">
<!--                  <img class="w-auto h-auto ma-1"  :src="avatarbase64" alt=""/>-->
                  <v-avatar class="w-auto h-auto ma-1" rounded  :image="curData.roleInfo.roleIcon"></v-avatar>
                </v-img>
<!--                大区-->
                <div>{{ curData.roleInfo.roleText[0] }}</div>

                <template v-for="(item,index)  of skinInfo">
                  <div v-if="index<5">{{ item.tabName + item.count }}</div>
                </template>
              </div>
<!--              金币-->
              <div class="flex  flex-wrap flex-grow-1 align-center justify-between px-4" style="background-color:  #414e61">
                <div class="d-flex align-center" v-for="(item,index) of Goldcoin">
                  <v-avatar size="31" :image="item.src"></v-avatar>
                  {{index==0 ? curData.mods.charms.totalCharm:curData.mods[item.key] }}
                </div>
              </div>
            </v-col>
            <v-col cols="12" md="5" lg="5" >
              <div class="flex justify-between">
                <div class="flex flex-column  justify-center align-center" v-for="(item,index) of medalConfig" >
                  <div class="h-5 pt-1" style="font-size: 12px">
                    <div v-if="index==0">历史最高</div>
                  </div>
                  <v-img aspect-ratio="1/1" cover :max-width="70" :max-height="70" :src="curData.yinji[item.key]"></v-img>
                  <div class="h-5 flex-grow-1" style="font-size: 12px">{{item.name?item.name:curData.yinji.highestDivName}}</div>
                </div>
              </div>
            </v-col>
          </v-row>

        <!--          装备信息-->
        <template  v-for="(item,index) of skinInfo">
          <div v-if="item.count && item.show" class=" flex align-center pa-1 flex-wrap" style="background-color: #63709d">
            {{ item.tabName }}数量：{{item.count}}
          </div>
          <div class="d-flex flex-row flex-wrap  ">
            <template v-if="item.count &&  item.show && !Array.isArray(item.data)" v-for="det in item.data.detail" class="flex flex-wrap ">
              <template  v-for="tt of det.items" >
                <template v-if="tt.imageUrl">
                  <div v-if="tt.quality>=6 " class="flex flex-col items-center justify-center  w-32 image-fen mx-2 my-2 position-relative"
                       :style="{backgroundImage:`url(${getImageUrl( tt.quality)})`}" >
                    <img class="w-20 h-20" :src="tt.imageUrl" alt=""/>
                    <div class="text-overflow">{{tt.itemName.indexOf('-')>-1?tt.itemName.slice(tt.itemName.indexOf('-')+1): tt.itemName }}</div>
                    <div class="level" v-if="tt.level">{{tt.level}}级</div>
                  </div>
                </template>
                <template v-else>
<!--                  枪械-->
                  <template v-for="gun of tt.items">
                    <div v-if="gun.quality>=6"  class="flex flex-col items-center w-32 image-fen mx-2 my-2 position-relative"
                         :style="{backgroundImage:`url(${getImageUrl( gun.quality)})`}">
                      <img class="w-20 h-20" :src="gun.imageUrl" alt=""/>
                      <div class="text-overflow">{{gun.itemName.indexOf('-')>-1?gun.itemName.slice(gun.itemName.indexOf('-')+1): gun.itemName }}</div>
                      <div class="level" v-if="gun.level">{{gun.level}}级</div>
                    </div>
                  </template>
                </template>
              </template>
            </template>
          </div>
        </template>

      </div>
      <div v-else class="pa-5 d-flex justify-center align-center">
        <v-img class="h-100 w-100" max-width="200" max-height="200" :src="loginbase64"></v-img>
      </div>
    </template>
  </v-card>

</template>

<style scoped>
.no-padding {
  margin: 0 !important;
  padding: 0 !important;
}
.image-container{
  padding:2px ;
  background-image: url('/src/assets/xiangkuang.png');
  background-repeat: no-repeat;
  background-size: cover;
  img{
    border-top-left-radius: 12px;
  }
}
.image-fen{
  font-size: 14px;
  width: 106px;
  height: 106px;
  padding:2px ;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center; /* 将背景图片居中 */
}
.level{
  position: absolute;
  top: 0px;
  right: 5px;
}

.text-overflow {
  text-align: center;
  width: 100px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

}
</style>
