import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Viewicon from "../../../assets/view.svg";

function ProfileModal({ user, children }: { user?: any; children?: any }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <img src={Viewicon}></img>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display={"flex"} justifyContent="center">
            {user.name}
          </ModalHeader>
          <ModalBody display="flex" flexDirection="column" gap={5} py={5}>
            <Image
              borderRadius={10}
              display="flex"
              justifyContent="center"
              alignSelf="center"
              boxSize="200px"
              backgroundSize="cover"
              src={user.pic}
              alt={user.name}
            ></Image>
            <Text alignSelf="center" justifyContent="center" color={"blue.400"}>
              {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
