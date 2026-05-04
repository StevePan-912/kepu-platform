import { create } from 'zustand'

interface AppState {
  currentDeviceId: string | null
  setCurrentDeviceId: (id: string | null) => void
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
  activeCategory: string | null
  setActiveCategory: (category: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  currentDeviceId: null,
  setCurrentDeviceId: (id) => set({ currentDeviceId: id }),
  searchKeyword: '',
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  activeCategory: null,
  setActiveCategory: (category) => set({ activeCategory: category }),
}))