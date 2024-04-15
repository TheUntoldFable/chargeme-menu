import { Product } from '@/models/product';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist({
  key: 'recoil-persist', // this key is using to store data in local storage
  storage: localStorage // configure which storage will be used to store the data
});

export const orderState = atom<Product[] | []>({
  key: 'Order',
  default: [],
  effects_UNSTABLE: [persistAtom]
});
