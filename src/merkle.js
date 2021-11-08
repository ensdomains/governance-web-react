const { MerkleTree } = require("merkletreejs")
const keccak256 = require("keccak256")
const { ethers } = require("ethers")

function hashLeaf([address, entry]) {
  return ethers.utils.solidityKeccak256(
    ["address", "uint256"],
    [address, entry.balance]
  )
}

export function getIndex(address, entry, proof) {
  let index = 0
  let computedHash = hashLeaf([address, entry])

  for (let i = 0; i < proof.length; i++) {
    index *= 2
    const proofElement = proof[i]

    if (computedHash <= proofElement) {
      // Hash(current computed hash + current element of the proof)
      computedHash = ethers.utils.solidityKeccak256(
        ["bytes32", "bytes32"],
        [computedHash, proofElement]
      )
    } else {
      // Hash(current element of the proof + current computed hash)
      computedHash = ethers.utils.solidityKeccak256(
        ["bytes32", "bytes32"],
        [proofElement, computedHash]
      )
      index += 1
    }
  }
  return index
}

class ShardedMerkleTree {
  constructor(fetcher, shardNybbles, root) {
    this.fetcher = fetcher
    this.shardNybbles = shardNybbles
    this.root = root
    this.shards = {}
    this.trees = {}
  }

  getProof(address) {
    const shardid = address.slice(2, 2 + this.shardNybbles).toLowerCase()
    let shard = this.shards[shardid]
    if (shard === undefined) {
      shard = this.shards[shardid] = this.fetcher(shardid)
      this.trees[shardid] = new MerkleTree(
        Object.entries(shard.entries).map(hashLeaf),
        keccak256,
        { sort: true }
      )
    }
    const entry = shard.entries[address]
    const leaf = hashLeaf([address, entry])
    const proof = this.trees[shardid]
      .getProof(leaf)
      .map((entry) => "0x" + entry.data.toString("hex"))
    return [entry, proof.concat(shard.proof), leaf]
  }

  static build(entries, shardNybbles, directory) {
    const shards = {}
    for (const [address, entry] of entries) {
      const shard = address.slice(2, 2 + shardNybbles).toLowerCase()
      if (shards[shard] === undefined) {
        shards[shard] = []
      }
      shards[shard].push([address, entry])
    }
    const roots = Object.fromEntries(
      Object.entries(shards).map(([shard, entries]) => [
        shard,
        new MerkleTree(entries.map(hashLeaf), keccak256, {
          sort: true,
        }).getRoot(),
      ])
    )
    const tree = new MerkleTree(Object.values(roots), keccak256, {
      sort: true,
    })

    const fs = require("fs")
    const path = require("path")
    fs.mkdirSync(directory, { recursive: true })
    fs.writeFileSync(
      path.join(directory, "root.json"),
      JSON.stringify({
        root: tree.getHexRoot(),
        shardNybbles,
      })
    )
    for (const [shard, entries] of Object.entries(shards)) {
      fs.writeFileSync(
        path.join(directory, shard + ".json"),
        JSON.stringify({
          proof: tree
            .getProof(roots[shard])
            .map((value) => "0x" + value.data.toString("hex")),
          entries: Object.fromEntries(entries),
        })
      )
    }
  }

  static fromFiles(directory) {
    const fs = require("fs")
    const path = require("path")
    const { root, shardNybbles } = JSON.parse(
      fs.readFileSync(path.join(directory, "root.json"), { encoding: "utf-8" })
    )
    return new ShardedMerkleTree(
      (shard) => {
        return JSON.parse(
          fs.readFileSync(path.join(directory, `${shard}.json`), {
            encoding: "utf-8",
          })
        )
      },
      shardNybbles,
      root
    )
  }
}

export default ShardedMerkleTree
