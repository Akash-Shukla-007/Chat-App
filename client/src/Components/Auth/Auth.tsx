import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import cloudinaryUrl from "../../../config";
import NameValidator from "../../helper/NameValidatore";
import EmailValidator from "../../helper/EmailValidator";
import PasswordValidator from "../../helper/PasswordValidator";
import { logIn, signUp } from "../../services/httpServices";
import { useNavigate } from "react-router-dom";

export default function Auth({ isSignup }: { isSignup?: boolean }) {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState(null);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const [guestCred, setGuestCred] = useState(false);

  const navigate = useNavigate();

  const postPic = (pic: any) => {
    if (pic === undefined) return toast.error("Please select an image");
    if (
      pic.type === "image/jpeg" ||
      pic.type === "image/png" ||
      pic.type === "image/jpg"
    ) {
      const data = new FormData();
      data.append("file", pic);
      data.append("upload_preset", "Image-Uploader");
      data.append("cloud_name", "dtnbdozcb");
      setProfileLoading(true);

      fetch(cloudinaryUrl, {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setProfileLoading(false);
          // console.log(data.url.toString());
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  useEffect(() => {
    setEmail("guest@gmail.com");
    setPassword("Guest@123");
  }, [guestCred]);

  const handleSubmit = () => {
    if (isSignup) {
      if (NameValidator(name) === true) {
        if (EmailValidator(email) === true) {
          if (PasswordValidator(password) === true) {
            setLoading(true);
            return signUp(
              pic !== null
                ? { name, email, password, pic }
                : { name, email, password }
            )
              .then((res: any) => {
                // console.log(res.data);
                localStorage.setItem("User", JSON.stringify(res.data.User));
                setLoading(false);
                navigate("/chat");
              })
              .catch((err: any) => {
                setLoading(false);

                toast.error(err.message);
              });
          }
          return toast.error(PasswordValidator(password));
        }
        return toast.error(EmailValidator(email));
      }
      return toast.error(NameValidator(name));
    }
    if (email === "" || password === "")
      return toast.error("Fill required fields");
    setLoading(true);

    logIn({ email, password })
      .then((res: any) => {
        // console.log(res.data);
        localStorage.setItem("User", JSON.stringify(res.data.User));
        setLoading(false);
        navigate("/chat");
      })
      .catch((err: any) => {
        toast.error(err.response.data.message);
        setLoading(false);
        // console.log(err);
      });
  };

  return (
    <VStack bg="white">
      {isSignup && (
        <FormControl isRequired>
          <FormLabel htmlFor="name">Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e: any) => setName(e.target.value)}
            id="name"
            type="text"
            textTransform={"capitalize"}
          />
        </FormControl>
      )}
      <FormControl isRequired>
        <FormLabel htmlFor="email">Email</FormLabel>
        <Input
          placeholder="Enter Your Email"
          onChange={(e: any) => setEmail(e.target.value)}
          id="email"
          type="text"
        />
      </FormControl>
      <FormControl isRequired>
        <FormLabel htmlFor="password">Password</FormLabel>
        <InputGroup>
          <Input
            placeholder="Enter Your Password"
            onChange={(e: any) => setPassword(e.target.value)}
            id="password"
            type={show ? "text" : "password"}
          />
          <InputRightElement mr={1} display={"flex"} alignItems={"center"}>
            <Button onClick={() => setShow(!show)} padding={1}>
              {show ? "show" : "hide"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      {isSignup && (
        <FormControl isRequired>
          <FormLabel htmlFor="pic">Picture</FormLabel>
          <Input
            placeholder="Choose a picture"
            onChange={(e: any) => postPic(e.target.files[0])}
            id="pic"
            type="file"
            accept="image/png"
          />
          {profileLoading && <Spinner />}
        </FormControl>
      )}
      <Button
        isDisabled={profileLoading || loading}
        w={"100%"}
        mt={"20px"}
        colorScheme="blue"
        onClick={handleSubmit}
      >
        Submit
      </Button>
      {loading && <Spinner size={"lg"} />}
      {!isSignup && (
        <Button
          w={"100%"}
          mt={"10px"}
          colorScheme="red"
          onClick={() => {
            setGuestCred(true);
            setEmail("guest@gmail.com");
            setPassword("Guest@123");
            handleSubmit();
          }}
        >
          Get Guest Credentials
        </Button>
      )}
    </VStack>
  );
}
