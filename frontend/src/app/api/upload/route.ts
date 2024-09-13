import { NextResponse } from "next/server";
import pinataSDK from "@pinata/sdk";

export async function POST(req: Request) {
  try {
    // Get the JSON data from the request body
    const jsonData = await req.json();
    console.log("line 8", jsonData);

    // Create a new Pinata SDK client
    const pinata = new pinataSDK(
      process.env.PINATA_API_KEY,
      process.env.PINATA_API_SECRET
    );

    const IPFS_GATEWAY =
      process.env.IPFS_GATEWAY || "https://gateway.pinata.cloud/ipfs/";

    // Upload the JSON data to IPFS
    const { IpfsHash: ipfsHash } = await pinata.pinJSONToIPFS(jsonData);

    // Get the generated IPFS hash and URL
    console.log("IPFS hash:", ipfsHash);

    const ipfsUrl = `${IPFS_GATEWAY}${ipfsHash}`;

    // Return the IPFS hash as the response
    return NextResponse.json({ ipfsHash, ipfsUrl });
  } catch (error) {
    // Handle any errors that occur during the upload process
    console.error("Error uploading to IPFS:", error);
    return NextResponse.error();
  }
}
