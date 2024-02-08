import { Dispatch, SetStateAction, useCallback, useState } from "react";
import classNames from "classnames";

import { CircleInterface } from "../../types/circle";
import { circlePageStatus } from "../../utils/constants";

interface AutoCircleItemInterface {
  circle: CircleInterface;
  url: string;
  setPageStatus: Dispatch<SetStateAction<number>>;
}

const AutoCircleItem = ({
  circle,
  setPageStatus,
  url,
}: AutoCircleItemInterface) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const { name, description, tags } = circle;

  const handleAdd = useCallback(() => {
    setIsAdding(true);
    chrome.runtime.sendMessage(
      {
        action: "addTags",
        names: tags,
      },
      (res) => {
        if (res.error) {
          console.log("An error occured while adding tags");
          setIsAdding(false);
        } else {
          chrome.runtime.sendMessage(
            {
              action: "createCircle",
              circleName: name,
              circleDescription: description,
              url,
              tags: res.data || [],
            },
            (response) => {
              if (response.error) {
                console.log(
                  "CirclesView: createCircle response.error: ",
                  response.error
                );
                setIsAdding(false);
              } else {
                console.log("CirclesView: createCircle response: ", response);
                setIsAdding(false);
                setPageStatus(circlePageStatus.CIRCLE_LIST);
                // now we want to load circles again just to make sure the result went through
              }
            }
          );
        }
      }
    );
  }, [description, name, setPageStatus, tags, url]);

  return (
    <div className="circles-item px-4 py-2 hover:h-auto transition-transform transform hover:cursor-pointer hover:bg-slate-50 flex gap-5 items-center rounded-lg group delay-300">
      <img
        src="../duck.jpg"
        alt="circle logo"
        className=" rounded-full min-w-[64px] h-16"
      />
      <div className="w-full flex justify-between items-center">
        <div className="flex flex-col justify-between gap-2 text-sm text-gray-700 group-hover:text-gray-900 w-full relative">
          <div className="flex justify-between items-center w-full">
            <p className="font-semibold">{circle.name}</p>
          </div>
          <p>{circle.description}</p>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <button
              disabled={isAdding}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleAdd();
              }}
              className={classNames(
                "px-6 py-3 rounded-full hidden group-hover:block bg-gray-400 text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50",
                {
                  " bg-gray-500 hover:bg-gray-600 active:bg-gray-700 focus:ring-gray-500 cursor-not-allowed":
                    isAdding,
                }
              )}
            >
              {isAdding ? "Adding" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutoCircleItem;