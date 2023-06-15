import { createVNode, render } from "vue";
import modal from "./modal.vue";

export function createModal() {
  const VNode = createVNode(modal); // 这里使用Vue的createVNode函数，因此可以省略该步骤。 创建

  render(VNode, document.documentElement);
}
