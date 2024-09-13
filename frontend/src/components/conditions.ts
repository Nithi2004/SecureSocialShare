import { conditions } from '@nucypher/taco';

const PRIMARY_DR_BADGE_NFT = process.env.NEXT_PUBLIC_PRIMARY_DR_BADGE_NFT || "";
const EMT_BADGE_NFT = process.env.NEXT_PUBLIC_EMT_BADGE_NFT || "";
const SOCIAL_WORKER_BADGE_NFT = process.env.NEXT_PUBLIC_SOCIAL_WORKER_BADGE_NFT || "";
const RESEARCHER_BADGE_NFT = process.env.NEXT_PUBLIC_RESEARCHER_BADGE_NFT || "";
const PUBLIC_RECORD_AGENT_NFT = process.env.NEXT_PUBLIC_PUBLIC_RECORD_AGENT_NFT || "";

const POLYGON_AMOY_CHAIN_ID = process.env.NEXT_PUBLIC_POLYGON_AMOY_CHAIN_ID ? Number(process.env.NEXT_PUBLIC_POLYGON_AMOY_CHAIN_ID) : 80002;

console.log("PRIMARY_DR_BADGE_NFT", PRIMARY_DR_BADGE_NFT);
console.log("EMT_BADGE_NFT", EMT_BADGE_NFT);
console.log("SOCIAL_WORKER_BADGE_NFT", SOCIAL_WORKER_BADGE_NFT);
console.log("RESEARCHER_BADGE_NFT", RESEARCHER_BADGE_NFT);
console.log("PUBLIC_RECORD_AGENT_NFT", PUBLIC_RECORD_AGENT_NFT);
console.log("POLYGON_AMOY_CHAIN_ID", POLYGON_AMOY_CHAIN_ID);

const ownsPrimaryDrBadge = new conditions.base.contract.ContractCondition({
    chain: 80002,
    method: 'balanceOf',
    parameters: [':userAddress'],
    standardContractType: 'ERC721',
    contractAddress: PRIMARY_DR_BADGE_NFT,
    returnValueTest: {
        comparator: '>',
        value: 0,
    },
});

const ownsEmtBadge = new conditions.base.contract.ContractCondition({
    chain: 80002,
    method: 'balanceOf',
    parameters: [':userAddress'],
    standardContractType: 'ERC721',
    contractAddress: EMT_BADGE_NFT,
    returnValueTest: {
        comparator: '>',
        value: 0,
    },
});

const ownsSocialWorkerBadge = new conditions.base.contract.ContractCondition({
    method: 'balanceOf',
    parameters: [':userAddress'],
    standardContractType: 'ERC721',
    contractAddress: SOCIAL_WORKER_BADGE_NFT,
    chain: 80002,
    returnValueTest: {
        comparator: '>',
        value: 0,
    },
});

const ownsResearcherBadge = new conditions.base.contract.ContractCondition({
    method: 'balanceOf',
    parameters: [':userAddress'],
    standardContractType: 'ERC721',
    contractAddress: RESEARCHER_BADGE_NFT,
    chain: 80002,
    returnValueTest: {
        comparator: '>',
        value: 0,
    },
});

const ownsPublicRecordAgentBadge = new conditions.base.contract.ContractCondition({
    method: 'balanceOf',
    parameters: [':userAddress'],
    standardContractType: 'ERC721',
    contractAddress: PUBLIC_RECORD_AGENT_NFT,
    chain: 80002,
    returnValueTest: {
        comparator: '>',
        value: 0,
    },
});


console.log("ownsPrimaryDrBadge", ownsPrimaryDrBadge);
console.log("ownsEmtBadge", ownsEmtBadge);
console.log("ownsSocialWorkerBadge", ownsSocialWorkerBadge);
console.log("ownsResearcherBadge", ownsResearcherBadge);


// const allowMedicalRecordCondition = new conditions.compound.CompoundCondition({
//     operator: 'or',
//     operands: [ownsPrimaryDrBadge, ownsEmtBadge]
// });

const allowMedicalRecordCondition = ownsPrimaryDrBadge;

const allowFinancialRecordCondition = ownsSocialWorkerBadge;

const allowDnrRecordCondition = ownsEmtBadge;

// const allowGenomicRecordCondition = new conditions.compound.CompoundCondition({
//     operator: 'or',
//     operands: [ownsPrimaryDrBadge, ownsResearcherBadge]
// });

const allowGenomicRecordCondition = ownsResearcherBadge;

const allowMyDIDCondition = ownsPublicRecordAgentBadge;

export {
    allowMedicalRecordCondition,
    allowFinancialRecordCondition,
    allowDnrRecordCondition,
    allowGenomicRecordCondition,
    allowMyDIDCondition
};