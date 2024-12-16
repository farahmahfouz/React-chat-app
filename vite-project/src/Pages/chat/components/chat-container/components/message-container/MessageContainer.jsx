import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { GET_ALL_MSGS, GET_CHANNEL_MSGS, HOST } from "@/utils/constants.js";
import { useEffect, useRef, useState } from "react";
import { MdFolderZip } from 'react-icons/md'
import { IoMdArrowRoundDown } from 'react-icons/io'
import { IoCloseSharp } from "react-icons/io5";
import moment from "moment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getColor } from "@/lib/utils";

function MessageContainer() {
  const scrollRef = useRef();
  const { userInfo, selectedChatType, selectedChatData, selectedChatMessages, setSelectedChatMessages, setIsDownloading, setFileDownloadProgress } = useAppStore();
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);


  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await apiClient.post(GET_ALL_MSGS, { id: selectedChatData._id }, { withCredentials: true });
        if (res.data.data.message) {
          setSelectedChatMessages(res.data.data.message)
        }
      } catch (err) { console.error(err) }
    };
    const getChannelMessages = async()=> {
      try{
        const res = await apiClient.get(`${GET_CHANNEL_MSGS}/${selectedChatData._id}`, {withCredentials: true});
        if(res.data.data.messages){
          setSelectedChatMessages(res.data.data.messages)
        }
      } catch (err) { console.error(err) }
    }

    if (selectedChatData._id) {
      if (selectedChatType === 'contact') getMessages();
      if (selectedChatType === 'channel') getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [selectedChatMessages]);

  const checkIfImg = (filePath) => {
    const imageRegex = /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  }

  const renderMessage = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY_MM_DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={`${message._id}-${index}`}>
          {
            showDate && (
              <div className="text-center text-gray-500 my-2">
                {moment(message.timestamp).format('LL')}
              </div>
            )}
          {
            selectedChatType === 'contact' && renderDMMessages(message)
          }
          {
            selectedChatType === 'channel' && renderChannelMessages(message)
          }
        </div>
      )
    })
  };

  const downloadFile = async (url) => {
    try {
      setIsDownloading(true);
      setFileDownloadProgress(0);
      const res = await apiClient.get(`${HOST}/${url}`,
        {
          responseType: 'blob',
          withCredentials: true,
          onDownloadProgress: progressEvent => {
            const { loaded, total } = progressEvent;
            const percentageCompleted = Math.round(((loaded * 100) / total));
            setFileDownloadProgress(percentageCompleted);
          }
        });
      const urlBlob = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = urlBlob;
      link.setAttribute('download', url.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(urlBlob);
      setIsDownloading(false);
      setFileDownloadProgress(0);
    } catch (err) {
      console.error('Error downloading file:', err)
    }
  };

  const renderDMMessages = (msg) => (
    <div className={`${msg.sender === selectedChatData._id ? 'text-left' : 'text-right'}`}>
      {
        msg.messageType === 'text' && (
          <div className={`${msg.sender !== selectedChatData._id
            ? 'bg-[#8417ff] text-white/80 border-[#8417ff]/50'
            : 'bg-[#2a2b33] text-white/80 border-[#ffffff]/20'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}>
            {msg.content}
          </div>
        )
      }
      {
        msg.messageType === 'file' && (
          <div className={`${msg.sender !== selectedChatData._id
            ? 'bg-[#8417ff] text-white/80 border-[#8417ff]/50'
            : 'bg-[#2a2b33] text-white/80 border-[#ffffff]/20'
            } border inline-block p-1 rounded-sm my-1 max-w-[50%] break-words`}>
            {checkIfImg(msg.fileURL) ? (
              <div className="cursor-pointer" onClick={() => { setShowImage(true); setImageUrl(msg.fileURL) }}>
                <img src={`${HOST}/${msg.fileURL}`} alt="image" height={300} width={300} />
              </div>
            ) : (
              <div className="flex items-center justify-center gap-4">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{msg.fileURL.split("/").pop()}</span>
                <span className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(msg.fileURL)}>
                  <IoMdArrowRoundDown />
                </span>
              </div>
            )}
          </div>
        )}
      <div className="text-sm text-gray-500">{moment(msg.timestamp).format('LT')}</div>
    </div>
  );

  const renderChannelMessages = (msg) => {
    return (
      <div className={`mt-5 flex ${msg.sender._id === userInfo.id ? 'justify-end' : 'justify-start'}`}>
        {msg.sender._id !== userInfo.id && (
          <div className="flex flex-col items-center justify-center gap-1 mr-3">
            <Avatar className='h-8 w-8'>
              {msg.sender.image ? (
                <AvatarImage
                  src={msg.sender.image}
                  alt="profile"
                  className='object-cover w-full h-full bg-black rounded-full'
                />
              ) : (
                <AvatarFallback className={`uppercase h-8 w-8 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(msg.sender.color)}`}>
                  {msg.sender.firstName ? msg.sender.firstName.charAt(0) : msg.sender.email.charAt(0)}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="text-white/60 text-xs">{msg.sender.firstName ? `${msg.sender.firstName}` : msg.sender.email}</span>
          </div>
        )}
        {
          msg.messageType === 'file' && (
            <div className={`${msg.sender._id === userInfo.id
              ? 'bg-[#8417ff] text-white/80 border-[#8417ff]/50'
              : 'bg-[#2a2b33] text-white/80 border-[#ffffff]/20'
              } border inline-block p-2 rounded-sm my-1 max-w-[50%] break-words`}>
              {checkIfImg(msg.fileURL) ? (
                <div className="cursor-pointer" onClick={() => { setShowImage(true); setImageUrl(msg.fileURL) }}>
                  <img src={`${HOST}/${msg.fileURL}`} alt="image" height={300} width={300} />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4 p-2 bg-[#2a2b33] rounded-sm max-w-full overflow-hidden">
                  <span className="text-white/80 text-3xl bg-black/20 rounded-full p-2 min-w-[48px] flex-shrink-0">
                    <MdFolderZip />
                  </span>
                  <span className="text-white/80 text-sm truncate flex-1  md:text-base">{msg.fileURL.split("/").pop()}</span>
                  <span className="bg-black/20 p-2 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300 flex-shrink-0"
                    onClick={() => downloadFile(msg.fileURL)}>
                    <IoMdArrowRoundDown />
                  </span>
                </div>
              )}
            </div>
          )}

        <div className="flex flex-col">
          {msg.messageType === 'text' && (
            <div className={`${msg.sender._id === userInfo.id
              ? 'bg-[#8417ff] text-white/80 border-[#8417ff]/50'
              : 'bg-[#2a2b33] text-white/80 border-[#ffffff]/20'
              } border p-4 rounded my-1 max-w-[300px] break-words`}>
              {msg.content}
            </div>
          )}
          <div className="text-xs text-white/60 ml-2 mt-1">
            {moment(msg.timestamp).format('LT')}
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide p-4 px-8 md:w-[65vw] lg:w-[79vw] xl:w-[80wv] w-full">
      {renderMessage()}
      <div ref={scrollRef}></div>
      {
        showImage &&
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg">
          <div>
            <img src={`${HOST}/${imageUrl}`}
              className="h-[80vh] w-full bg-cover pt-5" />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageUrl)}>
              <IoMdArrowRoundDown />
            </button>
            <button className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => { setShowImage(false); setImageUrl(null) }}>
              <IoCloseSharp />
            </button>
          </div>
        </div>
      }
    </div>
  )
}

export default MessageContainer