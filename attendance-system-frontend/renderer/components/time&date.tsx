import dynamic from "next/dynamic";

const Clock = dynamic(() => import("react-live-clock"), { ssr: false });

export default function DateTime() {
  const currentDate = new Date();
  const date = currentDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <Clock
        format={"hh:mm:ss A"}
        style={{ fontSize: "2em" }}
        ticking={true}
      />
      <div className=" text-[1em]">
        {date}
      </div>
    </>
  );
}
