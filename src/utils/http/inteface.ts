import { CreateAxiosDefaults } from "axios";

interface IOption extends CreateAxiosDefaults {
  type?: "wx" | "qq";
  timeTmp?: number;
}

export type { IOption };
