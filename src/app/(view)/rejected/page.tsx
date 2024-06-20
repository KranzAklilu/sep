import Image from "next/image";

export default function Page() {
  return (
    <div className="container flex h-screen flex-col items-center justify-center">
      <Image src="/rejected.png" alt="under review" width={500} height={500} />
      <p>please contact the admin at 0912414324</p>
      <p>
        you have been rejected due to poor quality of the image and/or invalid
        license
      </p>
    </div>
  );
}
