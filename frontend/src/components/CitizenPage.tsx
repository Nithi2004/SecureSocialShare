"use client";
import { fromHexString } from "@nucypher/shared";
import { conditions, domains, fromBytes, toHexString } from "@nucypher/taco";
import { ethers } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { useEffect, useState } from "react";

import useTaco from "../hooks/useTaco";
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Code,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import FileDataViewer from "./FileDataViewer";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { AttachmentIcon } from "@chakra-ui/icons";
import {
  allowDnrRecordCondition,
  allowFinancialRecordCondition,
  allowGenomicRecordCondition,
  allowMedicalRecordCondition,
  allowMyDIDCondition,
} from "./conditions";

declare const window: any;

const ritualId = 0; // Replace with your own ritual ID
const domain = domains.TESTNET;

function CitizenPage() {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [medicalRecords, setMedicalRecords] = useState("");
  const [financialRecords, setFinancialRecords] = useState("");
  const [dnrRecords, setDnrRecords] = useState("");
  const [genomicRecords, setGenomicRecords] = useState("");
  const [myDID, setMyDID] = useState("");
  const [encrypting, setEncrypting] = useState(false);
  const [encryptedData, setEncryptedData] = useState<string | undefined>("");
  const [ipfsHash, setIpfsHash] = useState<string | undefined>("");
  const [ipfsUrl, setIpfsUrl] = useState<string | undefined>("");

  const toast = useToast();

  const loadWeb3Provider = async () => {
    if (!window.ethereum) {
      console.error("You need to connect to your wallet first");
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    const { chainId } = await provider.getNetwork();
    const amoyChainId = 80002;
    if (chainId !== amoyChainId) {
      // Switch to Polygon Amoy testnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: hexlify(amoyChainId) }],
      });
    }

    await provider.send("eth_requestAccounts", []);
    setProvider(provider);
  };

  useEffect(() => {
    loadWeb3Provider();
  }, []);

  const { isInit, encryptDataToBytes } = useTaco({
    domain,
    provider,
    ritualId,
  });

  if (!isInit || !provider) {
    return <div>Loading...</div>;
  }

  const handleMedicalRecordsChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setMedicalRecords(e.target.value);
  };

  const uploadFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    fileType: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result as string;
      switch (fileType) {
        case "medicalRecords":
          setMedicalRecords(text);
          break;
        case "financialRecords":
          setFinancialRecords(text);
          break;
        case "dnrRecords":
          setDnrRecords(text);
          break;
        case "genomicRecords":
          setGenomicRecords(text);
          break;
        case "myDID":
          setMyDID(text);
          break;
        default:
          break;
      }
    };
    reader.readAsText(file);
  };

  const encryptMessage = async () => {
    const eMedicalData = await encryptRecord(medicalRecords, "medicalRecords");
    const eFinData = await encryptRecord(financialRecords, "financialRecords");
    const eDnrData = await encryptRecord(dnrRecords, "dnrRecords");
    const eGenData = await encryptRecord(genomicRecords, "genomicRecords");
    const eDidData = await encryptRecord(myDID, "myDID");
    const edata = {
      medicalRecords: eMedicalData,
      financialRecords: eFinData,
      dnrRecords: eDnrData,
      genomicRecords: eGenData,
      myDID: eDidData,
    };
    setEncryptedData(JSON.stringify(edata));
    toast({
      title: "Data Encrypted",
      description: "Data has been encrypted successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    // Send data to "upload" API route, to upload to IPFS
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(edata),
    });

    if (response.ok) {
      const { ipfsHash, ipfsUrl } = await response.json();
      console.log("IPFS hash:", ipfsHash);
      console.log("IPFS URL:", ipfsUrl);
      setIpfsHash(ipfsHash);
      setIpfsUrl(ipfsUrl);
      toast({
        title: "Data uploaded to IPFS",
        description: "Data has been uploaded to IPFS successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      console.error("Failed to upload data to IPFS");
      toast({
        title: "Failed to upload data to IPFS",
        description: "Failed to upload data to IPFS",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const encryptRecord = async (record: string, recordType: string) => {
    if (!provider) {
      return;
    }
    let condition: conditions.condition.Condition | undefined;
    switch (recordType) {
      case "medicalRecords":
        condition = allowMedicalRecordCondition;
        break;
      case "financialRecords":
        condition = allowFinancialRecordCondition;
        break;
      case "dnrRecords":
        condition = allowDnrRecordCondition;
        break;
      case "genomicRecords":
        condition = allowGenomicRecordCondition;
        break;
      case "myDID":
        condition = allowMyDIDCondition;
        break;
      default:
        condition = undefined;
        break;
    }

    setEncrypting(true);
    if (!record || !condition) {
      setEncrypting(false);
      return;
    }
    try {
      const signer = provider.getSigner();

      console.log("Encrypting message...");
      const encryptedBytes = await encryptDataToBytes(
        record,
        condition,
        signer
      );
      if (encryptedBytes) {
        return toHexString(encryptedBytes);
      }
    } catch (e) {
      console.log(e);
    }
    setEncrypting(false);
  };

  return (
    <Stack
      as="section"
      spacing={8}
      bg="white"
      boxShadow={"2xl"}
      border="1px solid"
      p={8}
      borderColor="gray.300"
      borderRadius={16}
      mt={8}
      divider={<StackDivider borderColor="gray.400" />}
    >
      <Heading as="h2">Citizen Data</Heading>
      <Stack spacing={4}>
        <Text fontWeight={600}>Medical Records: </Text>
        <Box
          as="label"
          display="inline-block"
          cursor="pointer"
          border="1px solid"
          borderRadius={8}
          minW={300}
          maxW={"max-content"}
          px={4}
          py={2}
        >
          <AttachmentIcon /> Upload Medical Records
          <Input
            type="file"
            variant={"filled"}
            display="none"
            accept=".json"
            name="medicalRecords"
            onChange={(e) => uploadFile(e, "medicalRecords")}
          />
        </Box>
        {medicalRecords === "" ? (
          ""
        ) : (
          <JsonView src={JSON.parse(medicalRecords)} collapsed />
        )}
      </Stack>
      <Stack spacing={4}>
        <Text fontWeight={600}>Financial Records: </Text>
        <Box
          as="label"
          display="inline-block"
          cursor="pointer"
          border="1px solid"
          borderRadius={8}
          minW={300}
          maxW={"max-content"}
          px={4}
          py={2}
        >
          <AttachmentIcon /> Upload Financial Records
          <Input
            type="file"
            variant={"filled"}
            display="none"
            accept=".json"
            name="financialRecords"
            onChange={(e) => uploadFile(e, "financialRecords")}
          />
        </Box>
        {financialRecords === "" ? (
          ""
        ) : (
          <JsonView src={JSON.parse(financialRecords)} collapsed />
        )}
      </Stack>
      <Stack spacing={4}>
        <Text fontWeight={600}>DNR Records: </Text>
        <Box
          as="label"
          display="inline-block"
          cursor="pointer"
          border="1px solid"
          minW={300}
          borderRadius={8}
          maxW={"max-content"}
          px={4}
          py={2}
        >
          <AttachmentIcon /> Upload DNR Records
          <Input
            type="file"
            variant={"filled"}
            display="none"
            accept=".json"
            name="dnrRecords"
            onChange={(e) => uploadFile(e, "dnrRecords")}
          />
        </Box>
        {dnrRecords === "" ? (
          ""
        ) : (
          <JsonView src={JSON.parse(dnrRecords)} collapsed />
        )}
      </Stack>
      <Stack spacing={4}>
        <Text fontWeight={600}>Genomic Records: </Text>
        <Box
          as="label"
          display="inline-block"
          cursor="pointer"
          border="1px solid"
          minW={300}
          borderRadius={8}
          maxW={"max-content"}
          px={4}
          py={2}
        >
          <AttachmentIcon /> Upload Genomic Records
          <Input
            type="file"
            variant={"filled"}
            display="none"
            accept=".json"
            name="genomicRecords"
            onChange={(e) => uploadFile(e, "genomicRecords")}
          />
        </Box>
        {genomicRecords === "" ? (
          ""
        ) : (
          <JsonView src={JSON.parse(genomicRecords)} collapsed />
        )}
      </Stack>
      <Stack spacing={4}>
        <Text fontWeight={600}>My De-Identified Records: </Text>
        <Box
          as="label"
          display="inline-block"
          cursor="pointer"
          minW={300}
          border="1px solid"
          borderRadius={8}
          maxW={"max-content"}
          px={4}
          py={2}
        >
          <AttachmentIcon /> Upload De-Identified Records
          <Input
            type="file"
            variant={"filled"}
            display="none"
            accept=".json"
            name="myDID"
            onChange={(e) => uploadFile(e, "myDID")}
          />
        </Box>
        {myDID === "" ? "" : <JsonView src={JSON.parse(myDID)} collapsed />}
      </Stack>
      <Button w={300} colorScheme="purple" onClick={encryptMessage}>
        Encrypt
      </Button>{" "}
      {encrypting && "Encrypting..."}
      <Heading as="h3">Encrypted message</Heading>
      {encryptedData && <JsonView src={JSON.parse(encryptedData)} collapsed />}
      <Stack spacing={4}>
        <Text fontWeight={600}>IPFS Hash: </Text>
        <Input value={ipfsHash} readOnly />
        <Text fontWeight={600}>IPFS URL: </Text>
        <Input value={ipfsUrl} readOnly />
      </Stack>
    </Stack>
  );
}

export default CitizenPage;
