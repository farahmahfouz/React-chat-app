import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/api-client";
import { CREATE_CHANNEL, GET_ALL_CONTACTS } from "@/utils/constants";
import { Button } from "@/components/ui/button";
import MultipleSelector from "@/components/ui/multipleselect";
import { useAppStore } from "@/store";


function CreateChannel() {
    const { addChannel } = useAppStore();
    const [newChannelModel, setNewChannelModel] = useState(false);
    const [allContact, setAllContact] = useState([]);
    const [selectedContact, setSelectedContact] = useState([]);
    const [channelName, setChannelName] = useState('');


    useEffect(() => {
        const getData = async () => {
            const res = await apiClient.get(GET_ALL_CONTACTS, { withCredentials: true });
            const contacts = res.data.data.contacts.filter(contact => contact !== null);
            setAllContact(contacts);
        }
        getData();
    }, [allContact, channelName]);

    const createChannel = async () => {
        try {
            if (channelName.length > 0 && selectedContact.length > 0) {
                const res = await apiClient.post(CREATE_CHANNEL, { name: channelName, members: selectedContact.map(contact => contact.value) }, { withCredentials: true });
                if (res.status === 200) {
                    setChannelName('');
                    setSelectedContact([]);
                    setNewChannelModel(false);
                    addChannel(res.data.data.channel);
                }
            }
        } catch (err) {
            console.error(err)
            setNewChannelModel(false);

        }
    }

    return (
        <>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>
                        <FaPlus className="text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 
                        cursor-pointer transition-all duration-300"
                            onClick={() => setNewChannelModel(true)} />
                    </TooltipTrigger>
                    <TooltipContent className='bg-[#1c1b1e] border-none mb-2 p-3 text-white'>
                        <p>Create new channel.</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <Dialog open={newChannelModel} onOpenChange={(isOpen) => setNewChannelModel(isOpen)}>
                <DialogContent className='bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col'>
                    <DialogHeader>
                        <DialogTitle>Please fill up the details for new channel.</DialogTitle>
                        <DialogDescription>

                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Input placeholder='Channel Name'
                            className='rounded-lg p-6 bg-[#2c2e3b] border-none'
                            onChange={e => setChannelName(e.target.value)}
                            value={channelName} />
                    </div>
                    <div>
                        <MultipleSelector className='rounded-lg bg-[#2c2e3b] border-none py-2 text-white'
                            defaultOptions={allContact}
                            placeholder='Search Contacts'
                            onChange={setSelectedContact}
                            value={selectedContact}
                            emptyIndicator={<p className="text-center text-lg leading-10 text-gray-600">No contacts found</p>} />
                    </div>
                    <div>
                        <Button className='w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300'
                            onClick={createChannel}>Create Channel</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CreateChannel