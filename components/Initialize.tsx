import {
  useConnection,
  useWallet,
  useAnchorWallet,
} from "@solana/wallet-adapter-react"
import * as anchor from "@project-serum/anchor"
import { FC, useEffect, useState } from "react"
import idl from "../idl.json"
import { Button } from "@chakra-ui/react"

const PROGRAM_ID = new anchor.web3.PublicKey(
  `9pbyP2VX8Rc7v4nR5n5Kf5azmnw5hHfkJcZKPHXW98mf`
)

export interface Props {
  setCounter
  setTransactionUrl
}

export const Initialize: FC<Props> = ({setCounter, setTransactionUrl}) => {
  const [program, setProgram] = useState<anchor.Program<anchor.Idl> | null>(null)
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  useEffect(() => {
    let provider: anchor.Provider
  
    try {
      provider = anchor.getProvider()
    } catch {
      provider = new anchor.AnchorProvider(connection, wallet, {})
      anchor.setProvider(provider)
    }
  
    const program = new anchor.Program<anchor.Idl>(idl as anchor.Idl, PROGRAM_ID);
    setProgram(program)
  }, [])

  const onClick = async () => {
    const newAccount=new anchor.web3.Keypair()
    const sig = await program.methods
      .initialize()
      .accounts({
        counter: newAccount.publicKey,
        user: wallet.publicKey,
        systemAccount: anchor.web3.SystemProgram.programId,
      })
      .signers([newAccount])
      .rpc()
  
      setTransactionUrl(`https://explorer.solana.com/tx/${sig}?cluster=devnet`)
      setCounter(newAccount.publicKey)
  }


  return <Button onClick={onClick}>Initialize Counter</Button>
}
