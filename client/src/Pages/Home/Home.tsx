import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import Auth from "../../Components/Auth/Auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("User")!);
    if (User) {
      return navigate("/chat");
    }
  }, [navigate]);
  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        borderRadius="lg"
        justifyContent="center"
        p={3}
        w="100%"
        bg="white"
      >
        <Text
          fontSize="4xl"
          fontFamily="Work sans"
          color="black"
          bg="transparent"
        >
          Chat-Box
        </Text>
      </Box>
      <Box
        display="flex"
        borderRadius="lg"
        justifyContent="center"
        p={3}
        w="100%"
        bg="white"
      >
        <Tabs variant="soft-rounded" w="100%">
          <TabList>
            <Tab w="50%">Login</Tab>
            <Tab w="50%">Signup</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Auth isSignup={false} />
            </TabPanel>
            <TabPanel>
              <Auth isSignup={true} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
