 import { Product } from '@/models/product';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const localStorage = typeof window !== `undefined` ? window.localStorage : undefined

const { persistAtom } = recoilPersist({
  key: 'recoil-persist', // this key is using to store data in local storage
  storage: localStorage // configure which storage will be used to store the data
});

export const cartState = atom<Product[] | []>({
  key: 'Cart',
  default: [],
  effects_UNSTABLE: [persistAtom]
});
