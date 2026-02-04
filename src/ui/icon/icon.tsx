import type { SVGProps } from 'react';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MapPinIcon,
  PhoneIcon,
  PlusIcon,
} from '@heroicons/react/20/solid';

type HeroIcon = ForwardRefExoticComponent<
  SVGProps<SVGSVGElement> &
    RefAttributes<SVGSVGElement> & { title?: string; titleId?: string }
>;

type IconName = string;

interface IconProps extends SVGProps<SVGSVGElement> {
  icon: IconName;
  size?: number | string;
}

const iconMap: Record<string, HeroIcon> = {
  phone: PhoneIcon,
  plus: PlusIcon,
  arrow_up: ArrowUpIcon,
  arrow_down: ArrowDownIcon,
  directions_walk: MapPinIcon,
  directions_run: MapPinIcon,
};

// eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
function Icon({ icon, size, style, ref, ...props }: IconProps) {
  const IconComponent = iconMap[icon] ?? MapPinIcon;
  const mergedStyle = size ? { ...style, height: size, width: size } : style;

  return <IconComponent {...props} style={mergedStyle} />;
}

export default Icon;
