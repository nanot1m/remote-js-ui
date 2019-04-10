import { AppDefaultTheme } from "client/themes/defaultTheme";
import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme extends AppDefaultTheme {}
}
