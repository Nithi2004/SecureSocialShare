"use client";
import { fromHexString } from "@nucypher/shared";
import { domains, fromBytes } from "@nucypher/taco";
import { ethers } from "ethers";
import { hexlify } from "ethers/lib/utils";
import { useEffect, useState } from "react";

import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'

import useTaco from "../hooks/useTaco";
import { Button, Heading, Input, InputGroup, Stack, StackDivider, Text, Textarea, useToast } from "@chakra-ui/react";

declare const window: any;

const ritualId = 0; // Replace with your own ritual ID
const domain = domains.TESTNET;

function ConsumerPage() {
  const [provider, setProvider] = useState<
    ethers.providers.Web3Provider | undefined
  >();
  const [encryptedData, setEncryptedData] = useState<string | undefined>("");
  const [eMedicalRecords, setEMedicalRecords] = useState<string | undefined>("");
  const [eFinancialRecords, setEFinancialRecords] = useState<string | undefined>("");
  const [eDnrRecords, setEDnrRecords] = useState<string | undefined>("");
  const [eGenomicRecords, setEGenomicRecords] = useState<string | undefined>("");
  const [eMyDID, setEMyDID] = useState<string | undefined>("");
  const [decrypting, setDecrypting] = useState<boolean>(false);
  const [ipfsUrl, setIpfsUrl] = useState<string>("");

  const [decryptedMedicalRecords, setDecryptedMedicalRecords] = useState<string | undefined>("");
  const [decryptedFinancialRecords, setDecryptedFinancialRecords] = useState<string | undefined>("");
  const [decryptedDnrRecords, setDecryptedDnrRecords] = useState<string | undefined>("");
  const [decryptedGenomicRecords, setDecryptedGenomicRecords] = useState<string | undefined>("");
  const [decryptedMyDID, setDecryptedMyDID] = useState<string | undefined>("");

  const toast = useToast();

  const handleIpfsUrlChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIpfsUrl(e.target.value);
  };

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

  const { isInit, decryptDataFromBytes } = useTaco({
    domain,
    provider,
    ritualId,
  });

  if (!isInit || !provider) {
    return <div>Loading...</div>;
  }

  const parseMessage = async () => {
    if (!ipfsUrl) return;

    const response = await fetch(ipfsUrl);
    if (!response.ok) {
      toast({
        title: "Failed to fetch data",
        description: "Failed to fetch data from IPFS",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    toast({
      title: "Data fetched successfully",
      description: "Data has been fetched successfully",
      status: "success",
      duration: 2000,
      isClosable: true,
    });

    const jsonData = await response.json();
    console.log(jsonData);
    setEncryptedData(JSON.stringify(jsonData));

    setEMedicalRecords(jsonData?.medicalRecords);
    setEFinancialRecords(jsonData?.financialRecords);
    setEDnrRecords(jsonData?.dnrRecords);
    setEGenomicRecords(jsonData?.genomicRecords);
    setEMyDID(jsonData?.myDID);
  };

  const decryptMessage = async (record: string | undefined) => {
    console.log(record)
    if (!encryptedData || !provider || !record) return;

    try {
      setDecrypting(true);
      const signer = provider.getSigner();

      console.log("Decrypting message...");
      const decryptedMessage = await decryptDataFromBytes(
        fromHexString(record),
        signer
      );
      console.log("Decrypted message:", fromBytes(decryptedMessage!));
      if (decryptedMessage) {
        toast({
          title: "Data decrypted successfully",
          description: "Data has been decrypted successfully",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        return fromBytes(decryptedMessage);
      }
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Failed to decrypt data",
        description: "Access denied: " + e?.message?.substring(0, 100),
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setDecrypting(false);
  };

  const decryptMedicalRecords = async () => {
    const decryptedMedicalRecords = await decryptMessage(eMedicalRecords);
    setDecryptedMedicalRecords(decryptedMedicalRecords);
  };

  const decryptFinancialRecords = async () => {
    const decryptedFinancialRecords = await decryptMessage(eFinancialRecords);
    setDecryptedFinancialRecords(decryptedFinancialRecords);
  };

  const decryptDnrRecords = async () => {
    const decryptedDnrRecords = await decryptMessage(eDnrRecords);
    setDecryptedDnrRecords(decryptedDnrRecords);
  };

  const decryptGenomicRecords = async () => {
    const decryptedGenomicRecords = await decryptMessage(eGenomicRecords);
    setDecryptedGenomicRecords(decryptedGenomicRecords);
  };

  const decryptMyDID = async () => {
    const decryptedMyDID = await decryptMessage(eMyDID);
    setDecryptedMyDID(decryptedMyDID);
  };

  return (
    <Stack as="section" spacing={8} bg="white" boxShadow={"2xl"}
      border="1px solid"
      p={8}
      borderColor="gray.300"
      borderRadius={16} mt={8}
      divider={<StackDivider borderColor="gray.400" />}>

      <Heading as="h2">Consume Data</Heading>
      <Stack spacing={4}>
        <Text fontWeight={600}>Enter Data Url:</Text>
        <Input placeholder="Data URL" value={ipfsUrl} onChange={handleIpfsUrlChange} />
        <Button w={300} colorScheme="purple" onClick={parseMessage} isDisabled={ipfsUrl?.length <= 0} >Process data</Button>

        <Text fontWeight={600}>Encrypted Data:</Text>
        <Textarea
          placeholder="Encrypted Data"
          value={encryptedData}
          readOnly
        />
      </Stack>


      <Stack>
        <Text fontWeight={600}>Encrypted Medical Records: </Text>
        <Input
          placeholder="Medical Records"
          value={eMedicalRecords}
          readOnly
        />
        <Button w={300} colorScheme="purple" onClick={decryptMedicalRecords}>Decrypt Medical Records</Button>
        <Text fontWeight={600}>Decrypted Medical Records: </Text>
        {
          !decryptedMedicalRecords || decryptedMedicalRecords === "" ? "" : <JsonView src={JSON.parse(decryptedMedicalRecords)} collapsed />
        }
      </Stack>

      <Stack>
        <Text fontWeight={600}>Encrypted Financial Records: </Text>
        <Input
          placeholder="Medical Records"
          value={eMedicalRecords}
          readOnly
        />
        <Button
          w={300} colorScheme="purple"
          onClick={decryptFinancialRecords}
        >Decrypt Financial Records</Button>
        <Text fontWeight={600}>Decrypted Financial Records: </Text>
        {
          !decryptedFinancialRecords || decryptedFinancialRecords === "" ? "" : <JsonView src={JSON.parse(decryptedFinancialRecords)} collapsed />
        }
      </Stack>

      <Stack>
        <Text fontWeight={600}>Encrypted DNR Records: </Text>
        <Input
          placeholder="DNR Records"
          value={eDnrRecords}
          readOnly
        />
        <Button
          w={300} colorScheme="purple"
          onClick={decryptDnrRecords}
        >Decrypt DNR Records</Button>
        <Text fontWeight={600}>Decrypted DNR Records: </Text>
        {
          !decryptedDnrRecords || decryptedDnrRecords === "" ? "" : <JsonView src={JSON.parse(decryptedDnrRecords)} collapsed />
        }
      </Stack>

      <Stack>
        <Text fontWeight={600}>Encrypted Genomic Records: </Text>
        <Input
          placeholder="Genomic Records"
          value={eGenomicRecords}
          readOnly
        />
        <Button
          w={300} colorScheme="purple"
          onClick={decryptGenomicRecords}
        >Decrypt Genomic Records</Button>
        <Text fontWeight={600}>Decrypted Genomic Records: </Text>
        {
          !decryptedGenomicRecords || decryptedGenomicRecords === "" ? "" : <JsonView src={JSON.parse(decryptedGenomicRecords)} collapsed />
        }
      </Stack>

      <Stack>
        <Text fontWeight={600}>Encrypted De-Identified Records: </Text>
        <Input
          placeholder="MyDID"
          value={eMyDID}
          readOnly
        />
        <Button
          w={300} colorScheme="purple"
          onClick={decryptMyDID}
        >Decrypt De-Identified Records</Button>
        <Text fontWeight={600}>Decrypted De-Identified Records: </Text>
        {
          !decryptedMyDID || decryptedMyDID === "" ? "" : <JsonView src={JSON.parse(decryptedMyDID)} collapsed />
        }
      </Stack>
    </Stack>
  );
}

export default ConsumerPage;
