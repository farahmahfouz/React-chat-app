import { useSocket } from "@/Context/SocketContext";
import { apiClient } from "@/lib/api-client";
import { useAppStore } from "@/store";
import { UPLOAD_MSGS } from "@/utils/constants";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useRef, useState } from "react"
import { GrAttachment } from 'react-icons/gr'
import { IoSend } from "react-icons/io5"
import { RiEmojiStickerLine } from "react-icons/ri"

function MessageBar() {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const socket = useSocket();
  const [message, setMessage] = useState('');
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const { selectedChatType, selectedChatData, userInfo, setIsUploading, setFileUploadProgress } = useAppStore();

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [emojiRef])

  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji)
  }

  const handleSendMsg = async () => {
    console.log("Sending message:", {
      type: selectedChatType,
      data: selectedChatData,
      message: message
    });
    
    if (selectedChatType === 'contact') {
      socket.emit('sendMessage', {
        sender: userInfo.id,
        content: message,
        reciever: selectedChatData._id,
        messageType: 'text',
        fileURL: undefined
      })
    } else if (selectedChatType === 'channel') {
      console.log("Emitting channel message");

      socket.emit('send-channel-message', {
        sender: userInfo.id,
        content: message,
        messageType: 'text',
        fileURL: undefined,
        channelId: selectedChatData._id
      })
    }
    setMessage('');
  };

  const handleAttatchementClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttatchementChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_MSGS, formData,
          {
            withCredentials: true,
            onUploadProgress: data =>
              setFileUploadProgress(Math.round(((100 * data.loaded) / data.total)))
          });

        if (res.status === 201 && res.data) {
          setIsUploading(false);
          if (selectedChatType === 'contact') {
            socket.emit('sendMessage', {
              sender: userInfo.id,
              content: undefined,
              reciever: selectedChatData._id,
              messageType: 'file',
              fileURL: res.data.filePath
            })
          } else if (selectedChatType === 'channel') {
            socket.emit('send-channel-message', {
              sender: userInfo.id,
              content: undefined,
              messageType: 'file',
              fileURL: res.data.filePath,
              channelId: selectedChatData._id
            })
          }
        }
      }

    } catch (err) {
      setIsUploading(false);
      console.error(err)
    }
  };
  return (
    <div className="h-[10hv] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5 justify-between">
        <input type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Write a message ...  "
          value={message}
          onChange={e => setMessage(e.target.value)} />
        <button className="text-neutral-500  focus:border-none focus:outline-none focus:text-white duration-300 transition-all" onClick={handleAttatchementClick}>
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputRef} onChange={handleAttatchementChange} />
        <div className="relative">
          <button onClick={() => setEmojiPickerOpen(true)} className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker theme="dark" open={emojiPickerOpen} onEmojiClick={handleAddEmoji} autoFocusSearch={false} />
          </div>
        </div>
      </div>
      <button onClick={handleSendMsg} className="bg-[#8417ff] rounded-md flex justify-center items-center p-5 hover:bg-[#741bda] focus:bg-[#741bda] focus:border-none focus:outline-none focus:text-white duration-300 transition-all">
        <IoSend className="text-2xl" />
      </button>
    </div>
  )
}

export default MessageBar