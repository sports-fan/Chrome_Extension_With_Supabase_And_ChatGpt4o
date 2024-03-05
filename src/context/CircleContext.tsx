import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { CircleInterface } from '../types/circle'
import { circlePageStatus } from '../utils/constants'

interface ICircleContext {
  circles: CircleInterface[]
  currentUrl: string
  isLoading: boolean
  currentPageCircleIds: string[]
  getCircles: () => void
  pageStatus: number
  setPageStatus: Dispatch<SetStateAction<number>>
}

const CircleContext = createContext<ICircleContext>({
  circles: [],
  currentUrl: '',
  isLoading: true,
  currentPageCircleIds: [],
  getCircles: () => {},
  pageStatus: 0,
  setPageStatus: () => {},
})

export const useCircleContext = () => useContext(CircleContext)

interface ICircleContextProvider {
  children: React.ReactNode
}

export const CircleContextProvider = ({ children }: ICircleContextProvider) => {
  const [circles, setCircles] = useState<CircleInterface[]>([])
  const [currentUrl, setCurrentUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [pageStatus, setPageStatus] = useState(circlePageStatus.CIRCLE_LIST)

  const currentPageCircleIds = useMemo(
    () => circles.map((circle) => circle.id),
    [circles]
  )

  const getURLPromise: () => Promise<string> = useCallback(() => {
    return new Promise((resolve, reject) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url
        resolve(url || '')
      })
    })
  }, [])

  const getURL = useCallback(async () => {
    const urlResult = await getURLPromise()
    setCurrentUrl(urlResult)
  }, [getURLPromise])

  useEffect(() => {
    getURL()
  }, [getURL])

  const getCircles = useCallback(async () => {
    if (currentUrl) {
      chrome.runtime.sendMessage(
        { action: 'getCircles', url: currentUrl },
        (response) => {
          if (response.error) {
            setCircles([])
            setIsLoading(false)
          } else {
            if (response.data) {
              setCircles(response.data)
              setIsLoading(false)
            } else {
              setCircles([])
              setIsLoading(false)
            }
          }
        }
      )
    }
  }, [currentUrl])

  useEffect(() => {
    getCircles()
  }, [getCircles])

  return (
    <CircleContext.Provider
      value={{
        circles,
        currentUrl,
        currentPageCircleIds,
        getCircles,
        isLoading,
        pageStatus,
        setPageStatus,
      }}
    >
      {children}
    </CircleContext.Provider>
  )
}
