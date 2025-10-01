import React, { useState, useEffect } from 'react';
import { RoomData, DesignTier } from '@/types';
import { createNewRoom } from '@/utils/utils';
import { v4 as uuidv4 } from 'uuid';
import { AddRoomForm } from '@/components/add-room/AddRoomForm';
import { Modal, ModalHeader, ModalBody, ModalFooter } from './ui/Modal';

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRoom: (newRoom: RoomData) => void;
}

const AddRoomModal: React.FC<AddRoomModalProps> = ({ isOpen, onClose, onAddRoom }) => {
  const [name, setName] = useState('New Room');
  const [type, setType] = useState('Conference Room');
  const [tier, setTier] = useState<DesignTier>('Silver');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: RoomData = {
      ...createNewRoom(),
      id: uuidv4(),
      roomName: name,
      roomType: type,
      designTier: tier,
    };
    onAddRoom(newRoom);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <ModalHeader>Add New Room</ModalHeader>
        <ModalBody>
          <AddRoomForm {...{ name, setName, type, setType, tier, setTier }} />
        </ModalBody>
        <ModalFooter onCancel={onClose} submitText="Add Room" />
      </form>
    </Modal>
  );
};

export default AddRoomModal;
