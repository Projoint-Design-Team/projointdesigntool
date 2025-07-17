import { create } from "zustand";

interface ModalStoreState {
  importModalOpen: boolean;
  setImportModalOpen: (val?: boolean) => void;
  exportModalOpen: boolean;
  setExportModalOpen: (val?: boolean) => void;
  termsModalOpen: boolean;
  setTermsModalOpen: (val?: boolean) => void;
}

export const useModalStore = create<ModalStoreState>((set) => ({
  importModalOpen: false,
  setImportModalOpen: (val) =>
    set((state) => ({ importModalOpen: val ?? !state.importModalOpen })),
  exportModalOpen: false,
  setExportModalOpen: (val) =>
    set((state) => ({
      exportModalOpen: val ?? !state.exportModalOpen,
    })),
  termsModalOpen: false,
  setTermsModalOpen: (val) =>
    set((state) => ({ termsModalOpen: val ?? !state.termsModalOpen })),
}));
