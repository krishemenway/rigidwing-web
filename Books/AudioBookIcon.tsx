import * as React from "react";
import { IconProps, ApplyIconPropsToSvg } from "Common/IconProps";

export const AudioBookIcon: React.FC<IconProps> = (p) => <svg xmlns="http://www.w3.org/2000/svg" {...ApplyIconPropsToSvg(p)} viewBox="0 -960 960 960"><path d="M360-120H200q-33 0-56.5-23.5T120-200v-280q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480v280q0 33-23.5 56.5T760-120H600v-320h160v-40q0-117-81.5-198.5T480-760q-117 0-198.5 81.5T200-480v40h160v320Zm-80-240h-80v160h80v-160Zm400 0v160h80v-160h-80Zm-400 0h-80 80Zm400 0h80-80Z"/></svg>;
