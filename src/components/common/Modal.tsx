import { useRef } from "react";
import type { MouseEvent, ReactNode } from "react";

import Portal from "@/components/common/Portal";

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    enter?: string;
    leave?: string;
    className?: string;
    onClose?: () => void;
}

const Modal = ({
    children,
    isOpen,
    className = "",
    enter = "",
    leave = "",
    onClose = () => undefined,
}: ModalProps) => {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleModalClick = (event: MouseEvent) => {
        if (!modalRef.current) {
            return;
        }

        if (!modalRef.current.contains(event.target as Node)) {
            onClose();
        }
    };

    return (
        <Portal>
            <div
                className={`fixed inset-0 bg-black/70 transition-all duration-300 ${
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={handleModalClick}
            >
                <div
                    ref={modalRef}
                    className={`absolute bg-white transition-all ${className} ${
                        isOpen ? enter : leave
                    }`}
                >
                    {children}
                </div>
            </div>
        </Portal>
    );
};

export default Modal;
