import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { getColor } from '@/lib/utils';
import { useAppStore } from '@/store'
import { RiCloseFill } from 'react-icons/ri'

function ChatHeader() {
  const { closeChat, selectedChatData, selectedChatType } = useAppStore();

  if (!selectedChatData) {
    return null;
  }

  return (
    <div className="h-[10vh] border-b-2 border-[#2f303b] flex items-center justify-between px-6">
      <div className="flex gap-5 items-center justify-between w-full">
        <div className="flex gap-3 items-center justify-center">
          <div className="w-12 h-12 relative ">
            {selectedChatType === "channel" ? (
              <div className="bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full">
                #
              </div>
            ) : (
              <Avatar className='h-12 w-12 rounded-full'>
                {selectedChatData.image ? (
                  <AvatarImage 
                    src={selectedChatData.image} 
                    alt="profile" 
                    className='object-cover w-full h-full bg-black rounded-full' 
                  />
                ) : (
                  <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(selectedChatData.color)}`}>
                    {selectedChatData.firstName 
                      ? selectedChatData.firstName.charAt(0)
                      : selectedChatData.email?.charAt(0) || '#'}
                  </div>
                )}
              </Avatar>
            )}
          </div>
          <div>
            {selectedChatType === "channel" && selectedChatData.name}
            {selectedChatType === "contact" && selectedChatData.firstName ? `${selectedChatData.firstName} ${selectedChatData.lastName}` : selectedChatData.email}
          </div>
        </div>
        <div className="flex items-center justify-center gap-5">
          <button className='text-neutral-500 focus:border-none focus:outline-none
           focus:text-white duration-300 transition-all' onClick={closeChat}>
            <RiCloseFill className='text-3xl' />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatHeader