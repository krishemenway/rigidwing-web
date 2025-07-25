import * as React from "react";
import { IconProps, ApplyIconPropsToSvg } from "Common/IconProps";

export const EditImagesIcon: React.FC<IconProps> = (p) => <svg xmlns="http://www.w3.org/2000/svg" {...ApplyIconPropsToSvg(p)} viewBox="0 -960 960 960"><path d="M240-280h480L597-444q-11-2-22.5-5t-22.5-7L450-320l-90-120-120 160Zm-40 160q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h200v80H200v560h560v-213l80 80v133q0 33-23.5 56.5T760-120H200Zm280-360Zm382 56L738-548q-21 14-45 21t-51 7q-74 0-126-52.5T464-700q0-75 52.5-127.5T644-880q75 0 127.5 52.5T824-700q0 27-8 52t-20 46l122 122-56 56ZM644-600q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Z"/></svg>;
