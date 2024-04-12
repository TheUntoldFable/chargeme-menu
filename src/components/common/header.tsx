import Image from 'next/image';

const Header = ({ classNames }: { classNames?: string }) => {
  return (
    <div
      className={`flex min-w-full justify-center items-center h-16 bg-black ${classNames}`}
    >
      <Image src="/images/logo.png" width={150} height={100} alt="logo" />
    </div>
  );
};

export default Header;
