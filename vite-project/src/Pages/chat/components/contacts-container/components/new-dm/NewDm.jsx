import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import Lottie from "react-lottie";
import { animationDefault, getColor } from "@/lib/utils";
import { apiClient } from "@/lib/api-client";
import { SEARCH_CONTACTS_ROUTES } from "@/utils/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/store";


function NewDm() {
    const { setSelectedChatType, setSelectedChatData } = useAppStore();
    const [openNewContactModal, setOpenNewContactModal] = useState(false);
    const [searchContact, setSearchContact] = useState([]);

    const handleSearchContacts = async (searchTerm) => {
        try {
            if (searchTerm.length > 0) {
                const res = await apiClient.post(SEARCH_CONTACTS_ROUTES, { searchTerm }, { withCredentials: true });
                    if (res.status === 200 && res.data.data.contacts) {
                    setSearchContact(res.data.data.contacts)
                }
            } else {
                setSearchContact([]);
            }
        } catch (err) {
            console.error(err)
        }
    };

    const selectedNewContact = contact => {
        setOpenNewContactModal(false);
        setSelectedChatType('contact');
        setSelectedChatData(contact);
        setSearchContact([]);
    };
    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 
                        cursor-pointer transition-all duration-300"
                            onClick={() => setOpenNewContactModal(true)} />
                    </TooltipTrigger>
                    <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
                        <p>Select new contact</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={openNewContactModal} onOpenChange={setOpenNewContactModal}>
                <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
                    <DialogHeader>
                        <DialogTitle>Please select a contact</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder='Search Contacts' className='rounded-lg p-6 bg-[#2c2e3b] border-none' onChange={e => handleSearchContacts(e.target.value)} />
                    </div>
                    {searchContact.length > 0 && (
                        <ScrollArea className='h-[250px]'>
                            <div className="flex flex-col gap-5">
                                {searchContact.map(contact => <div key={contact._id}
                                    className="flex gap-3 items-center cursor-pointer"
                                    onClick={() => selectedNewContact(contact)}>
                                    <div className="w-12 h-12 relative ">
                                        <Avatar className='h-12 w-12 rounded-full'>
                                            {contact.image ? (
                                                <AvatarImage src={contact.image} alt="profile" className='object-cover w-full h-full bg-black rounded-full' />
                                            ) : (
                                                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full ${getColor(contact.color)}`}>
                                                    {contact.firstName ? contact.firstName.split("").shift() : contact.email.split('').shift()}</div>
                                            )}
                                        </Avatar>
                                    </div>
                                    <div className="flex flex-col">
                                        <span>
                                            {
                                                contact.firstName && contact.lastName ? `${contact.firstName}${contact.lastName}` : `${contact.email}`
                                            }
                                        </span>
                                        <span className="text-xs">{contact.email}</span>
                                    </div>
                                </div>
                                )}
                            </div>
                        </ScrollArea>
                    )}
                    {searchContact.length <= 0 && (
                        <div className="flex-1 md:flex flex-col mt-5 md:mt-0 justify-center items-center duration-1000 transition-all">
                            <Lottie
                                isClickToPauseDisabled={true}
                                height={100}
                                width={100}
                                options={animationDefault}
                            />
                            <div className='text-opacity-80 text-white flex flex-col mt-5 gap-5 items-center lg:text-2xl text-xl transition-all duration-300 text-center'>
                                <h3 className='poppins-medium'>
                                    Hi <span className='text-purple-500'>! </span> Search new
                                    <span className='text-purple-500'> Contacts</span>
                                </h3>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default NewDm