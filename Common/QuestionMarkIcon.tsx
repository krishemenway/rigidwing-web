import * as React from "react";
import { ApplyIconPropsToSvg, IconProps } from "Common/IconProps";

export const QuestionMarkIcon: React.FC<IconProps> = (p) => <svg xmlns="http://www.w3.org/2000/svg" {...ApplyIconPropsToSvg(p)} viewBox="0 -960 960 960"><path d="M424-320q0-81 14.5-116.5T500-514q41-36 62.5-62.5T584-637q0-41-27.5-68T480-732q-51 0-77.5 31T365-638l-103-44q21-64 77-111t141-47q105 0 161.5 58.5T698-641q0 50-21.5 85.5T609-475q-49 47-59.5 71.5T539-320H424Zm56 240q-33 0-56.5-23.5T400-160q0-33 23.5-56.5T480-240q33 0 56.5 23.5T560-160q0 33-23.5 56.5T480-80Z"/></svg>;
