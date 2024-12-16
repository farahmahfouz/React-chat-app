import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import { FiEdit2 } from "react-icons/fi";
import { BiLogOut } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { apiClient } from "@/lib/api-client";
import { LOGOUT } from "@/utils/constants";

function ProfileInfo() {
    const { userInfo, setUserInfo } = useAppStore();
    const navigate = useNavigate();

    const logout = async () => {
        try {
            const res = await apiClient.post(LOGOUT, {}, { withCredentials: true });
            document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'; 
            
            delete apiClient.defaults.headers.common['Authorization'];
            if (res.status === 200) {
                navigate('/auth')
                setUserInfo(null);
            }
        } catch (err) {
            console.error(err)
        }
    };
    return (
        <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
            <div className="flex gap-3 items-center justify-center">
                <div className="w-12 h-12 relative ">
                    <Avatar className='h-12 w-12 rounded-full'>
                        {userInfo.image ? (
                            <AvatarImage src={userInfo.image} alt="profile" className='object-cover w-full h-full bg-black rounded-full' />
                        ) : (
                            <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(userInfo.color)}`}>
                                {userInfo.firstName ? userInfo.firstName.split("").shift() : userInfo.email.split('').shift()}</div>
                        )}
                    </Avatar>
                </div>
                <div>
                    {
                        userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}` : ''
                    }
                </div>
            </div>
            <div className="flex gap-5">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <FiEdit2 onClick={() => navigate('/profile')} className='text-purple-500 text-xl font-medium' />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
                            <p>Edit Profile</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger>
                            <BiLogOut onClick={logout} className='text-red-700 text-xl font-medium' />
                        </TooltipTrigger>
                        <TooltipContent className='bg-[#1c1b1e] border-none text-white'>
                            <p>Logout</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>

            </div>
        </div>
    )
}

export default ProfileInfo