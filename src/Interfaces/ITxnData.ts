interface ITxnData {
    timestamp: string;
    block_number: number;
    txn_hash: string;
    token_address: string;    
    token_id_array: string[];
    value: number;
}

export { ITxnData }