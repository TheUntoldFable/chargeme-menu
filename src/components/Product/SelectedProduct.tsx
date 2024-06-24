'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useRecoilState } from 'recoil';
import IconPlus from '../../../public/svg/IconPlus';
import IconMinus from '../../../public/svg/IconMinus';
import { orderState } from '@/store/order';
import { Product } from '@/models/product';
import { cartState } from '@/store/cart';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from '../ui/use-toast';

interface ProductCardProps {
  itemData: Product;
  classNames?: string;
  isCartScreen?: boolean
}

const ProductCard = ({ itemData, classNames, isCartScreen }: ProductCardProps) => {
  const [cartItems, setCartItems] = useRecoilState(cartState);

  const handleRemoveFromCart = () => {
    const filteredItems = cartItems.filter((i) => i.id !== id);
    setCartItems(filteredItems);
    toast({
      variant: 'destructive',
      title: 'Премахване от количка',
      description: `Продуктът ${title} е успешно премахнат от вашата количка!`
    });
  };

  if (!itemData) return null;

  const { title, price, weight, id, isSelected, quantity = 0 } = itemData;

  const increment = () => {
    const itemIndex = cartItems.findIndex((i) => i.id === id);
    const updatedItems = [...cartItems];

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: quantity + 1
    };

    setCartItems(updatedItems);
  };

  const decrement = () => {
    const itemIndex = cartItems.findIndex((i) => i.id === id);
    const updatedItems = [...cartItems];
    const quantityUpdated = quantity - 1;

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity: quantityUpdated
    };
    setCartItems(quantityUpdated > 0 ? updatedItems : cartItems);
  };

  const onTap = () => {
    const itemIndex = cartItems.findIndex((i) => i.id === id);
    const updatedItems = [...cartItems];

    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      isSelected: !isSelected
    };

    setCartItems(updatedItems);
  };

  return (
    <Card
      className={`
     flex-col
     bg-transparent
     relative
     w-[85%]
     border-defaultGray
     border-[1px]
     flex
     bg-black bg-opacity-55
     justify-center ${classNames}`}
    >
      <CardContent className="flex flex-row items-center p-2 w-full rounded-lg border-none">
        {isCartScreen && 
        <Checkbox
          onClick={onTap}
          className="mx-2 bg-transparent border-[2px] border-white text-black w-6 h-6"
          checked={isSelected}
        />}
        {!isCartScreen &&
        <div
          className="bg-yellow rounded-full p-1 cursor-pointer absolute -top-2.5 -right-2.5 rotate-45" 
          onClick={handleRemoveFromCart}
        >
          <IconPlus color="#880808" />
        </div>
        }
        <Image
          src="/images/pizza.png"
          width={200}
          height={200}
          className="w-[50%] mb-4"
          alt="Img"
        />
        <div className="flex flex-1 flex-col gap-4 px-4 mb-4 justify-between">
          <h1>{title}</h1>
          <div className="flex flex-row justify-between gap-1">
            <div className="flex gap-2">
              <p>{weight}гр.</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter
        className="
        pt-2
       w-[90%]
      items-center
      justify-between
      gap-2
      mx-auto
      border-t-[1px]
      border-defaultGray"
      >
        <div
          className=" bg-white rounded-lg p-1 flex flex-1
          w-full
          h-10
          px-4
          items-center
          justify-around
          text-lg gap-2
          text-black
          "
        >
          <div
            className="bg-yellow rounded-full p-1 cursor-pointer"
            onClick={decrement}
          >
            <IconMinus color="black" />
          </div>
          {quantity}
          <div
            className="bg-yellow rounded-full p-1 cursor-pointer"
            onClick={increment}
          >
            <IconPlus color="black" />
          </div>
        </div>
        <Button
          disabled
          className="flex-1 w-full text-lg gap-2"
          type="button"
          id="price"
          variant="default"
        >
          {price}лв
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
