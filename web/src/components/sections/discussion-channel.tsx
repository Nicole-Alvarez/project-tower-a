import { IUser } from "@/interfaces/user.interface";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ICreateMessage, IMessage } from "@/interfaces/message.interface";
import { useToast } from "../ui/use-toast";
import { createMessage } from "../../../api/mutation/message";
import { LoaderCircle, SendHorizontal, X } from "lucide-react";
import { getLatestMessage, getMessages } from "../../../api/query/messages";
import dayjs from "dayjs";
import { ICourse } from "@/interfaces/course.interface";
import React from "react";

interface Props {
    user: IUser;
    loading: Boolean;
    data: ICourse[];
}

const DiscussionChannel = ({user, loading, data}: Props) => {
    const [selectedChannel, setSelectedChannel] = useState<ICourse | null>(null)
    const { toast } = useToast();
    const [message, setMessage] = useState('');
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const handleSelectedChannel = (item: ICourse) => {
        setSelectedChannel(item);
    }

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: ICreateMessage) => {
            return await createMessage(payload);
        },
        onSuccess: async () => {
            refetch();
            setMessage('');
        },
        onError: async (error) => {
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <X className="mr-2 text-orange-500" />
                      Something went wrong!
                    </div>
                  ),
              })
        },
    });

    const { data: messages, isLoading: isLoadingMessages, refetch } = useQuery({
        queryKey: ['user-messages', selectedChannel?.id],
        queryFn: async () => {
            return await getMessages(Number(selectedChannel?.id));
        },
        enabled: !!selectedChannel
    });

    const { data: latestMessage } = useQuery({
        queryKey: ['userlastest-message', selectedChannel?.id],
        queryFn: async () => {
            return await getLatestMessage(Number(selectedChannel?.id));
        },
        enabled: !!selectedChannel,
        refetchInterval: 1000,
    });

    const handleSendMessage = () => {
        if (!selectedChannel) {
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <X className="mr-2 text-orange-500" />
                      Please select a channel
                    </div>
                  ),
              })
            return;
        }
        if(message.trim() === '') {
            toast({
                title: "",
                description: (
                    <div className="flex items-center">
                      <X className="mr-2 text-orange-500" />
                      Message must not be empty
                    </div>
                  ),
              })
            return;
        }
        mutate({
            courseId: selectedChannel.id,
            senderId: Number(user?.id), 
            content: message,
            teacherId: selectedChannel.userId
        });
    }

    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
    <div className="w-[80%] font-DM flex flex-row h-[85vh] border rounded-md shadow-md">
        <div className="flex flex-col w-[350px] h-full border-r p-5 space-y-[10px]">
            <p className="font-bold text-[18px] text-[#292521]/90 mb-3">Discussion Channels</p>
            <div className="w-full h-full overflow-y-auto flex flex-col space-y-[10px]">
            {loading && <div className="w-full flex items-center justify-center h-full"><LoaderCircle className="mt-3 h-[32px] w-[32px] animate-spin text-slate-300" /></div>}
                {!loading && data && data.length > 0 && data.map((item: ICourse, index: number) => (
                    <div key={index} 
                         onClick={() => {handleSelectedChannel(item);item.hasUnreadMessage = false;}}
                         className={`w-[280px] h-[50px] border rounded-sm flex items-center p-2 space-x-2 cursor-pointer 
                            ${selectedChannel === item ? "bg-slate-100" : ""
                          } ${item?.hasUnreadMessage ? "border-red-200" : ""} hover:bg-slate-50`}>
                        <Avatar>
                            <AvatarImage src={item?.image} />
                            <AvatarFallback className="bg-[#FF9345] text-white h-[34px] w-[34px] text-[14px] font-bold">
                                {item?.title[0].toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <div className="text-[#292521] font-bold text-[12px] w-[200px] truncate">{item?.title}</div>
                            <div className="text-[#292521]/50 font-bold text-[10px] w-[200px] truncate">
                                {item?.message.length > 0  ? item?.message[0]?.sender?.name + ": " + item?.message[0]?.content: "No messages yet..."}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      <div className="flex flex-col w-full h-full">
      {selectedChannel !== null && (
        <div className="w-full flex flex-row items-center space-x-3 border-b pt-5 pb-1 px-5">
            <Avatar>
                <AvatarImage src={selectedChannel?.image} />
                <AvatarFallback className="bg-[#FF9345] text-white h-[34px] w-[34px] text-[14px] font-bold">
                    {selectedChannel?.title[0].toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <div className="text-[#292521]/90 font-bold text-[12px]">{selectedChannel?.title}</div>
                <div className="text-[#292521]/50 text-[11px]">{selectedChannel?.user?.name + " (teacher)"}</div>
            </div>
        </div>
        )}
        <div 
            ref={messageContainerRef} 
            className="w-full h-[60vh] overflow-y-auto flex flex-col mt-1 px-5"
        >
        {isLoadingMessages && <div className="w-full flex items-center justify-center h-full"><LoaderCircle className="mt-3 h-[32px] w-[32px] animate-spin text-slate-300" /></div>}
        {!isLoadingMessages && messages && messages.length > 0 && messages.map((item: IMessage, index: number) => (
            <div 
                key={index} 
                className={`flex ${item.senderId === user?.id ? "justify-end" : "justify-start"} mb-5`}
            >
            {item.senderId !== user?.id &&  (
                <Avatar className="h-[30px] w-[30px] mr-2">
                    <AvatarImage src={item?.sender?.profilePicture}/>
                    <AvatarFallback className="bg-[#FF9345] text-white h-[30px] w-[30px] text-[14px] font-bold">
                        {item?.sender?.name[0].toUpperCase()}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className="flex flex-col">
                <div>
                    <p className="text-[12px]">{item.senderId !== user?.id && item?.sender?.name}</p>
                </div>
                <div 
                className={`flex items-center space-x-3 p-2 rounded-[20px] text-[#292521] text-[12px]
                    ${item.senderId === user?.id ? "bg-blue-200" : "bg-gray-200"}
                `}
                >
                <p className="whitespace-pre-wrap">{item?.content}</p>
                </div>
                <p className={`text-[#292521] text-[8px] px-2 text-right`}>
                {dayjs(item?.createdAt).format('MMM D, YYYY, h:mm A')}
                </p>
            </div>
        </div>
        ))}
        {latestMessage && messages && latestMessage.id !== messages[messages.length - 1]?.id && (
            <div 
            className={`flex ${latestMessage?.senderId === user?.id ? "justify-end" : "justify-start"} mb-2`}
                >
                {latestMessage.senderId !== user?.id &&  (
                    <Avatar className="h-[30px] w-[30px] mr-2">
                        <AvatarImage src={latestMessage?.sender?.profilePicture}/>
                        <AvatarFallback className="bg-[#FF9345] text-white h-[30px] w-[30px] text-[14px] font-bold">
                            {latestMessage?.sender?.name[0].toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                )}
                <div className="flex flex-col">
                    <div>
                        <p className="text-[12px]">{latestMessage?.sender?.name}</p>
                    </div>
                    <div 
                    className={`flex items-center space-x-3 p-2 rounded-[20px] text-[#292521] text-[12px]
                        ${latestMessage.senderId === user?.id ? "bg-blue-200" : "bg-gray-200"}
                    `}
                    >
                    <p className="whitespace-pre-wrap">{latestMessage?.content}</p>
                    </div>
                    <p className={`text-[#292521] text-[8px] px-2 text-right`}>
                    {dayjs(latestMessage?.createdAt).format('MMM D, YYYY, h:mm A')}
                    </p>
                </div>
            </div>
        )}
        </div>
        {selectedChannel !== null && (
        <div className="w-full flex px-5 pt-5 pb-1">
            <div className="w-full flex items-center border border-[#EEDDEE] px-4 space-x-2 rounded-lg text-[#292521] h-[50px]">
                <textarea
                    className="font-bold text-[12px] w-full bg-white p-0 placeholder:text-[#292521]/30 border-none focus:ring-0 focus:outline-none"
                    placeholder='Write a message...'
                    style={{
                        boxShadow: 'none',
                    }}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <SendHorizontal className={`text-2xl cursor-pointer text-blue-500 ${isPending && "animate-spin"}`} onClick={handleSendMessage}/>
            </div>
        </div>
        )}
      </div>
    </div>)
}

export default DiscussionChannel;