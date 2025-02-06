import { create } from 'zustand'

export const useDocName = create((set) => ({
    docName: '',
    setDocName: (newDocName) => set(() => ({ docName: newDocName })),
}))
