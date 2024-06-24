import Link from 'next/link';
import IconArrowRight from '../../../public/svg/IconArrowRight';

interface MenuItemProps {
  name: string;
  catQuantity: number;
  id: string,
}

const MenuItem = ({ name, catQuantity, id }: MenuItemProps) => {
  return (
    <Link href={`/category/${id}`}>
      <div className="flex flex-1 justify-between border-b-defaultGray border-b-[1px] py-1">
        <p className="capitalize ">{name ?? '[Empty]'}</p>
        <div className="flex items-center gap-3">
          <p className="text-yellow">{catQuantity}</p>
          <IconArrowRight />
        </div>
      </div>
    </Link>
  );
};

export default MenuItem;
