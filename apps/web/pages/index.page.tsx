import Head from "next/head";

export default function Web() {
  return (
    //  https://transfonter.org/ 在线字体压缩
    <div className="font-['js'] text-white relative w-screen h-screen bg-cover bg-[url('/bg.png')] ">
      <Head>
        <title>AI实验室</title>
      </Head>
      <div
        style={{
          background:
            "linear-gradient(180deg, rgba(13, 27, 61, 1) 15.28%, rgba(13, 27, 61, 0.56) 100%)",
        }}
        className="absolute w-full h-full z-10"
      ></div>
      <div className="absolute z-10 flex flex-col  w-full h-full items-center justify-center ">
        <h1 className="text-6xl">AI 实验室</h1>
        <p className="mt-8 font-thin">为AI赋能，让未来更美好</p>

        <ul className="mt-32 text-center list-none">
          <li>
            <a className="text-white" href="/translate.html">
              翻译助手
            </a>
          </li>
          <li className="mt-4">
            <a className="text-white" href="/chat.html">
              个人助手（普通版）
            </a>
          </li>
          <li className="mt-4">
            <a className="text-gray-300">个人助手（高级版）</a>
          </li>
          <li className="mt-4">
            <a
              className="text-white"
              href="https://github.com/mengjian-github/ailab"
            >
              Github
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
