import * as React from "react";
import { ApplyIconPropsToSvg, IconProps } from "Common/IconProps";

export const MenuIcon: React.FC<IconProps> = (p) => <svg xmlns="http://www.w3.org/2000/svg" {...ApplyIconPropsToSvg(p)} viewBox="0 0 24 24"><path d="M3 18h18v-2H3zm0-5h18v-2H3zm0-7v2h18V6z"></path></svg>;
