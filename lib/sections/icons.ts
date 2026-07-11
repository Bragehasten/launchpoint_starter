import {
  Award,
  Calendar,
  Camera,
  Check,
  Clock,
  Gauge,
  Hammer,
  Heart,
  LayoutTemplate,
  Lock,
  MapPin,
  Moon,
  Phone,
  Scissors,
  Search,
  Shield,
  Smartphone,
  Sparkles,
  Star,
  Truck,
  Users,
  Utensils,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icons available to CMS content by name. A curated set keeps bundles small
 * (importing all of lucide would ship thousands of icons) and gives editors
 * a predictable palette. Extend as capabilities need more.
 */
export const iconMap: Record<string, LucideIcon> = {
  award: Award,
  calendar: Calendar,
  camera: Camera,
  check: Check,
  clock: Clock,
  gauge: Gauge,
  hammer: Hammer,
  heart: Heart,
  layout: LayoutTemplate,
  lock: Lock,
  "map-pin": MapPin,
  moon: Moon,
  phone: Phone,
  scissors: Scissors,
  search: Search,
  shield: Shield,
  smartphone: Smartphone,
  sparkles: Sparkles,
  star: Star,
  truck: Truck,
  users: Users,
  utensils: Utensils,
  wrench: Wrench,
  zap: Zap,
};

export const iconNames = Object.keys(iconMap);

export function getIcon(name?: string): LucideIcon | undefined {
  return name ? iconMap[name] : undefined;
}
