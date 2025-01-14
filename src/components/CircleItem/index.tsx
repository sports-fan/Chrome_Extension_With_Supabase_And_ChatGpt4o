import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'

import CommentBox from 'components/CommentBox'
import LoadingSpinner from 'components/LoadingSpinner'
import MessageIcon from 'components/SVGIcons/MessageIcon/MessageIcon'
import RoundedButton from 'components/Buttons/RoundedButton'

import { edenUrl } from 'utils/constants'
import { CircleInterface } from 'types/circle'

import { BJActions } from 'background/actions'

interface CircleItemInterface {
  circle: CircleInterface
  activeUrl: string
  setPageStatus?: Dispatch<SetStateAction<number>>
}

const CircleItem = ({ circle, activeUrl }: CircleItemInterface) => {
  const [isChecking, setIsChecking] = useState(true)
  const [isJoined, setIsJoined] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [showComment, setShowCommentBox] = useState(false)
  const [isCommenting, setIsCommenting] = useState(false)

  const checkIfJoined = useCallback(async () => {
    chrome.runtime.sendMessage(
      { action: BJActions.CHECK_IF_USER_JOINED_CIRCLE, circleId: circle.id },
      (response) => {
        setIsJoined(response)
        setIsChecking(false)
      }
    )
  }, [circle.id])

  useEffect(() => {
    checkIfJoined()
  }, [checkIfJoined])

  const handlePost = useCallback(
    (comment: string) => {
      if (comment.length > 0) {
        setIsCommenting(true)
        chrome.runtime.sendMessage(
          {
            action: BJActions.CREATE_POST,
            context: comment,
            circleId: circle.id,
          },
          (res) => {
            if (!res.error) {
              setIsCommenting(false)
              setShowCommentBox(false)
            }
          }
        )
      }
    },
    [circle.id]
  )

  const handleJoin = useCallback(
    (circleId: string) => {
      setIsJoining(true)
      chrome.runtime.sendMessage(
        { action: BJActions.JOIN_CIRCLE, circleId, activeUrl },
        async (response) => {
          if (response === true) {
            await checkIfJoined()
            setShowCommentBox(true)
          }
          setIsJoining(false)
        }
      )
    },
    [checkIfJoined, activeUrl]
  )

  return (
    <div className="w-full flex flex-col gap-y-1">
      <div
        className={classNames(
          'relative p-4 transition-transform transform border border-gray-600 hover:bg-gray-100 flex gap-4 items-center rounded-2xl group',
          {
            'border-stroke': !showComment,
          }
        )}
      >
        {isJoined && (
          <div className="absolute top-0 left-0 bg-brand rounded-tl-2xl rounded-br-2xl py-1 px-2">
            <p className="text-xs font-bold leading-normal text-white">Joined</p>
          </div>
        )}
        <a
          href={`${edenUrl}/circle/${circle.id}`}
          rel="noreferrer"
          target="_blank"
          className="cursor-pointer"
        >
          <img
            src={circle.circle_logo_image || `../duck.jpg`}
            alt="circle logo"
            className=" rounded-full min-w-[48px] h-12"
          />
        </a>
        <div className="w-full flex items-center">
          <div className="flex flex-col justify-between gap-1 group-hover:text-gray-900 w-full">
            <div className="flex justify-between items-center w-full">
              <a
                href={`${edenUrl}/circle/${circle.id}`}
                rel="noreferrer"
                target="_blank"
                className="cursor-pointer"
              >
                <p
                  className="text-base font-bold text-primary line-clamp-1"
                  title={circle.name}
                >
                  {circle.name}
                </p>
              </a>
            </div>
            <p
              className="text-ellipsis line-clamp-2 text-sm font-medium text-tertiary"
              title={circle.description}
            >
              {circle.description}
            </p>
          </div>
        </div>

        {isChecking ? (
          <LoadingSpinner size={20} />
        ) : isJoined ? (
          <div
            className="cursor-pointer text-tertiary hover:text-gray-500"
            onClick={() => setShowCommentBox(true)}
          >
            <MessageIcon />
          </div>
        ) : (
          <RoundedButton
            disabled={isJoining}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleJoin(circle.id)
            }}
          >
            {isJoining ? 'Joining' : 'Join'}
          </RoundedButton>
        )}
      </div>
      {showComment && (
        <CommentBox
          circleImageUrl={circle.circle_logo_image}
          onComment={handlePost}
          onClose={() => setShowCommentBox(false)}
          isCommenting={isCommenting}
        />
      )}
    </div>
  )
}

export default CircleItem
