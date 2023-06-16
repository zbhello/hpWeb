import { reactive } from "vue";
import { IOption } from "../../utils/http/inteface";
export const requestList = reactive<any>([]);

export function createModal(options: IOption) {
  requestList.push({ ...options });
}
