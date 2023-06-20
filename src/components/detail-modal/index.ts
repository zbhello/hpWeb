import { WatchStopHandle, reactive, watch } from "vue";
import { IOption } from "../../utils/http/inteface";
export let watcher: WatchStopHandle | undefined = undefined;
export const requestList = reactive<IOption[]>([]);

export function createModal(options: IOption) {
  requestList.push({ ...options });
  if (!watcher) watchinn();
}

function watchinn() {
  watcher = watch(
    () => requestList,
    (newVal) => {
      if (!newVal) return;
      if (newVal.length > 8) requestList.shift();
    },
    {
      deep: true,
    }
  );
}
