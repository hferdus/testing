import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#C0DDD9] text-black">
      <div className="flex flex-col items-center">
        <Image
          src="https://www.nytimes.com/games/prototype/dist/strands100px.ea3b90d2.svg"
          alt="Strands Logo"
          className="mb-8"
          width="68"
          height="68"
        />
        <h1 className="text-4xl font-bold">Strands</h1>
        <p className="mb-4 text-xl">for daniel cho</p>
        <p className="mb-6 w-[304px] text-center text-2xl">
          Find hidden words and uncover the day&apos;s theme
        </p>
        <Link href="/play" legacyBehavior>
          <a className="mb-4 flex h-[48px] w-[150px] items-center justify-center rounded-full bg-black px-6 py-2 text-white no-underline">
            Play
          </a>
        </Link>
        <p className="text-m">Humyra Ferdus</p>
      </div>
    </main>
  );
}
