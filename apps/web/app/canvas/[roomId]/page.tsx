import { RoomCanvas } from "../../../components/RoomCanvas";

export default async function CanvasPage({
  params,
}: {
  params: {
    roomId: string;
  };
}) {
  const roomId = params.roomId;
  return (
    <>
      {/* <div className="h-screen w-sreen bg-zinc-950 text-gray-50">
        canvasPage
      </div> */}
      <RoomCanvas roomId={roomId} />
    </>
  );
}
