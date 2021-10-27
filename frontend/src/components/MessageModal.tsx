import React from "react";
import { Modal, Button } from "react-bootstrap";

export interface MessageModalProps {
  show: boolean;
  setShow(b: boolean): void;
  header: string | JSX.Element;
  body: string | JSX.Element;
  showButtons?: boolean;
}

const MessageModal = ({ showButtons = true, ...props }: MessageModalProps) => (
  <Modal show={props.show}>
    <Modal.Header>{props.header}</Modal.Header>
    <Modal.Body>{props.body}</Modal.Body>
    <Modal.Footer className="d-flex justify-content-right">
      {showButtons && <Button onClick={() => props.setShow(false)}>OK</Button>}
    </Modal.Footer>
  </Modal>
);

export default MessageModal;
