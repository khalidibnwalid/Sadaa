import Button from '@/components/ui/Button'
import ButtonRadioGroup from '@/components/ui/ButtonRadioGroup'
import Dialog from '@/components/ui/Dialog'
import Input from '@/components/ui/Input'
import type { Room } from '@/types/rooms'
import { useEffect, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { FaHashtag } from 'react-icons/fa'
import { PiPlus, PiSpeakerSimpleHighBold } from 'react-icons/pi'

type RoomForm = Pick<Room, 'name' | 'type'>

interface NewRoomDialogProps {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  onAddRoom: (room: RoomForm) => void
}


export default function NewRoomDialog({ isOpen, setIsOpen, onAddRoom }: NewRoomDialogProps) {
  const { handleSubmit, reset, control, setError, watch } = useForm<RoomForm>({
    defaultValues: { name: '', type: 'TEXT' }
  })

  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (isOpen) ref.current?.focus()
  }, [isOpen])


  const onSubmit = (data: RoomForm) => {
    if (!data.name) {
      setError('name', { message: 'Name is required' })
      return
    }
    onAddRoom({ name: data.name, type: data.type })
    reset()
    setIsOpen(false)
  }

  const inputIsEmpty = !watch('name').trim()

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <h1 className='text-lg font-bold flex items-center px-2 pb-2'>
        Add New Room
      </h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='space-y-2 mb-4'>
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                ref={ref}
                error={error?.message}
                className="flex-grow w-full"
                placeholder="Room Name"
              />
            )}
          />
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ButtonRadioGroup.Container
                className='w-full'
                value={field.value}
                onChange={field.onChange}
              >
                <ButtonRadioGroup.Item
                  className='flex flex-row items-center justify-center w-full rounded-3xl'
                  value='TEXT'
                  label='Text'
                >
                  <FaHashtag className='text-2xl' />
                </ButtonRadioGroup.Item>
                <ButtonRadioGroup.Item
                  className='flex flex-row items-center justify-center w-full rounded-3xl'
                  value='VOICE'
                  label='Voice'
                >
                  <PiSpeakerSimpleHighBold className='text-2xl' />
                </ButtonRadioGroup.Item>
              </ButtonRadioGroup.Container>
            )}
          />
        </div>
        <div className='flex justify-end gap-2'>
          <Button
            variant="ghost"
            onClick={() => {
              reset();
              setIsOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            className='flex items-center gap-2 font-medium'
            type='submit'
            disabled={inputIsEmpty}
          >
            <PiPlus /> Add
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
