import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams, useRouteContext } from '@tanstack/react-router'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from "react-hook-form"
import { PiPlus } from 'react-icons/pi'
import z from 'zod'

const PLACEHOLDER_ID = 'NEW_ROOM_GROUP'

type NewGroupDialogProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    roomsNumber: number;
};

const newGroupSchema = z.object({
    name: z.string().min(1, "Group name is required"),
});
type NewGroupForm = z.infer<typeof newGroupSchema>;

export default function NewRoomsGroupDialog({ isOpen, setIsOpen, roomsNumber }: NewGroupDialogProps) {
    const { serverId } = useParams({ from: "/chat/$serverId" })
    const { roomsGroupsCollection } = useRouteContext({ from: "/chat/$serverId" })
    const ref = useRef<HTMLInputElement>(null);

    const { control, handleSubmit, reset } = useForm<NewGroupForm>({
        resolver: zodResolver(newGroupSchema),
        defaultValues: { name: "" },
    });

    useEffect(() => {
        if (isOpen) ref.current?.focus();
    }, [isOpen]);

    function onSubmit(data: NewGroupForm) {
        roomsGroupsCollection.insert({
            id: PLACEHOLDER_ID,
            name: data.name,
            orderIndex: roomsNumber,
            serverId,
            rooms: [],
        });
        reset();
        setIsOpen(false);
    }

    return (
        <Dialog open={isOpen} onClose={() => { setIsOpen(false); reset(); }}>
            <h1 className='text-lg font-bold flex items-center px-2'>
                Add New Group
            </h1>
            <form className='flex flex-row gap-2 items-center pt-3 w-sm' onSubmit={handleSubmit(onSubmit)}>
                <Controller
                    name="name"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                        <Input
                            {...field}
                            ref={ref}
                            error={error?.message}
                            className="flex-grow w-full"
                            placeholder="Group Name"
                        />
                    )}
                />
                <Button type="submit" className="h-9 flex-none">
                    <PiPlus className='text-xl' />
                </Button>
            </form>
        </Dialog>
    );
}