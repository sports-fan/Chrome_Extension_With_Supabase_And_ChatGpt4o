import Send from "../SVGIcons/Send"
import { CircleInterface } from "../../types/circle"

interface IShareCircleItem {
  circle: CircleInterface
  onShare: (circleId: string) => void
}

const ShareCircleItem = ({ circle, onShare }: IShareCircleItem) => {
  return (
    <button
      className="w-full flex gap-x-2 items-center rounded-full px-3 py-4 bg-white hover:bg-brand cursor-pointer group"
      type="button"
      onClick={() => onShare(circle.id)}
    >
      <img
        src={circle.circle_logo_image || `../duck.jpg`}
        alt="circle logo"
        className=" rounded-full min-w-[24px] h-6"
      />
      <p
        className="text-ellipsis line-clamp-1 text-sm font-bold leading-normal text-primary group-hover:text-white"
        title={circle.name}
      >
        {circle.name}
      </p>
      <span className="text-white hidden group-hover:flex"><Send /></span>
    </button>
  )
}

export default ShareCircleItem
