"use client";

import { useParams } from "next/navigation";
import CityInfoPage from "@/pages/cityInfoPage/cityInfoPage";

export default function CityPage() {
  const { name } = useParams(); // дістаємо назву з URL
  return <CityInfoPage cityName={name} />;
}
