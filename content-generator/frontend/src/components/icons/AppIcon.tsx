import { Icon, IconProps } from "@chakra-ui/react";
import {
  BellRing,
  CalendarClock,
  Clock3,
  Download,
  Feather,
  Flame,
  LayoutDashboard,
  LineChart,
  Megaphone,
  Menu,
  Palette,
  Plus,
  Settings2,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wand2,
} from "lucide-react";

const iconRegistry = {
  dashboard: LayoutDashboard,
  campaigns: Megaphone,
  insights: LineChart,
  settings: Settings2,
  sparkles: Sparkles,
  plus: Plus,
  menu: Menu,
  palette: Palette,
  wand: Wand2,
  flame: Flame,
  trend: TrendingUp,
  clock: Clock3,
  calendar: CalendarClock,
  feather: Feather,
  shield: ShieldCheck,
  bell: BellRing,
  download: Download,
  share: Share2,
} as const;

export type AppIconName = keyof typeof iconRegistry;

type AppIconProps = IconProps & {
  name: AppIconName;
};

export const AppIcon = ({ name, ...rest }: AppIconProps) => {
  const SelectedIcon = iconRegistry[name];
  return <Icon as={SelectedIcon} {...rest} />;
};

export const appIcons = iconRegistry;
