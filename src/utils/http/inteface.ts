import { CreateAxiosDefaults } from "axios";

interface IOption extends CreateAxiosDefaults {
  type?: "wx" | "qq";
}

export type { IOption };
