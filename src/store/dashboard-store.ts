"use client";

import { create } from "zustand";
import type { SimulationMode, SimulationResult, SuspiciousTransaction } from "@/types/aml";

type DashboardState = {
  simulationMode: SimulationMode | null;
  simulationResult: SimulationResult | null;
  selectedSuspicious: SuspiciousTransaction | null;
  setSimulationMode: (mode: SimulationMode) => void;
  setSimulationResult: (result: SimulationResult | null) => void;
  setSelectedSuspicious: (txn: SuspiciousTransaction | null) => void;
};

export const useDashboardStore = create<DashboardState>((set) => ({
  simulationMode: null,
  simulationResult: null,
  selectedSuspicious: null,
  setSimulationMode: (mode) => set({ simulationMode: mode }),
  setSimulationResult: (result) => set({ simulationResult: result }),
  setSelectedSuspicious: (txn) => set({ selectedSuspicious: txn }),
}));
