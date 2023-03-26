import { useState } from "react";

interface ModalHook {
    (): [boolean, () => void];
}

const useModal: ModalHook = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => setIsOpen(!isOpen);

    return [isOpen, toggleModal];
};

export default useModal;
