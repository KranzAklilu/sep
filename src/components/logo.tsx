import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/">
      <Image
        src="/logo.png"
        className="h-full object-contain"
        width={100}
        height={100}
        alt="SAP"
      />
    </Link>
  );
};

export default Logo;
