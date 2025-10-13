"use client";

import { useEffect } from "react";
import { useServicesStore } from "@/stores/use-services";

export const ServicesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const fetchServices = useServicesStore((state) => state.fetchServices);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return <>{children}</>;
};
