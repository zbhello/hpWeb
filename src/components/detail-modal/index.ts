import { WatchStopHandle, reactive, watch } from "vue";
import { IOption } from "../../utils/http/inteface";
export let watcher: WatchStopHandle | undefined = undefined;
export const requestList = reactive<IOption[]>([]);

export function createModal(options: IOption) {
  requestList.push({ ...options });
  if (!watcher) watchinn();
}

function watchinn() {
  console.log(123444);

  watcher = watch(
    () => requestList,
    (newVal) => {
      console.log(newVal.length);
      if (!newVal) return;
      if (newVal.length > 8) requestList.shift();
    },
    {
      deep: true,
    }
  );
}
