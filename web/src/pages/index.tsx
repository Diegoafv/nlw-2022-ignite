interface HomeProps {
  pollCount: number;
  guessCount: number;
  userCount: number;
}
//Necessary to import this to use Images in a Next application
import Image from "next/image";
import { FormEvent, useState } from "react";
import appPreviewImg from "../assets/app-preview.png";
import iconCheckImg from "../assets/icon-check.png";
import logoImg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import { api } from "../lib/axios";

export default function Home(props: HomeProps) {
  const [pollTitle, setPollTitle] = useState("");
  async function createPoll(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/polls", {
        title: pollTitle,
      });
      const { code } = response.data;
      //copies the code to the users ctrl C
      await navigator.clipboard.writeText(code);

      alert("Poll created successfully! Code copied to your clipboard. ;)");
      setPollTitle("");
    } catch (err) {
      console.log(err);
      alert("Failed to create the poll! Try again.");
    }
  }
  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="Logo" />
        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Create your own World Cup poll and share with your friends!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={usersAvatarExampleImg} alt="" />
          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{props.userCount}</span> people
            have joined
          </strong>
        </div>
        <form onSubmit={createPoll} className="mt-10 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
            type="text"
            required
            placeholder="Name your poll..."
            onChange={(event) => setPollTitle(event.target.value)}
            value={pollTitle}
          />
          <button
            className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
            type="submit"
          >
            Create Poll
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          After creating your poll, you will receive a unique code that you can
          use to invite others! 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.pollCount}</span>
              <span>Polls created </span>
            </div>
          </div>

          <div className="w-px h-14 bg-gray-600"></div>

          <div className="flex items-center gap-6">
            <Image src={iconCheckImg} alt="" />
            <div className="flex flex-col">
              <span className="font-bold text-2xl">+{props.guessCount}</span>
              <span>Guesses sent </span>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Two smartphones showing a preview of the mobile app"
        quality={100}
      />
    </div>
  );
}

export const getServerSideProps = async () => {
  //Performance problem, promises dont depend on each other
  //const pollCountResponse = await api.get("polls/count");
  //const guessCountResponse = await api.get("guesses/count");
  //Instead:
  const [pollCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("polls/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      pollCount: pollCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
};
