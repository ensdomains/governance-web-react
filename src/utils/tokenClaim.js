import { getEthersProvider } from '../web3modal'
import { BigNumber, Contract, ethers } from 'ethers'
import { getENSTokenContractAddress } from './consts'
import ENSTokenAbi from '../assets/abis/ENSToken.json'
import merkleRoot from '../assets/root.json'
import ShardedMerkleTree from '../merkle'

/*
const shardJson = await response.json({encoding: 'utf-8'})
const {root, shardNybbles, total} = merkleRoot;
const shardedMerkleTree = new ShardedMerkleTree(
    () => shardJson,
    shardNybbles,
    root,
    BigNumber.from(total)
)
const [entry, proof] = shardedMerkleTree.getProof(address)
hasClaimed(proof, root, )
 */

function hashLeaf([address, entry]) {
  return ethers.utils.solidityKeccak256(
    ['address', 'uint256'],
    [address, entry.balance]
  )
}

const verify = (proof, root, leaf) => {}

export const hasClaimed = (proof, root, leaf) => {}

export const submitClaim = async (
  balance,
  proof,
  address,
  setClaimState,
  history
) => {
  try {
    const provider = getEthersProvider()
    const signer = provider.getSigner()
    const ENSTokenContract = new Contract(
      getENSTokenContractAddress(),
      ENSTokenAbi.abi,
      signer
    )
    ENSTokenContract.connect(signer)
    const result = await ENSTokenContract.claimTokens(balance, address, proof)
    const transactionReceipt = await result.wait(1)
    setClaimState({
      state: 'SUCCESS',
      message: '',
    })
    setTimeout(() => {
      history.push('/success')
    }, 2000)
  } catch (error) {
    console.error(error)
    setClaimState({
      state: 'ERROR',
      message: error,
    })
  }
}
