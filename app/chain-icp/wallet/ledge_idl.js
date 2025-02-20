const ledgerIDL = ({ IDL }) => {
    const AccountIdentifier = IDL.Text;
    const BlockIndex = IDL.Nat64;
    const Tokens = IDL.Record({ 'e8s': IDL.Nat64 });
    const Memo = IDL.Nat64;
    const Subaccount = IDL.Vec(IDL.Nat8);
    const Transaction = IDL.Record({
        'memo': Memo,
        'from_subaccount': IDL.Opt(Subaccount),
        'created_at_time': IDL.Opt(IDL.Record({ 'timestamp_nanos': IDL.Nat64 })),
        'amount': Tokens,
        'to': AccountIdentifier,
    });
    const Block = IDL.Record({
        'transaction': Transaction,
        'timestamp': IDL.Record({ 'timestamp_nanos': IDL.Nat64 }),
        'parent_hash': IDL.Opt(IDL.Vec(IDL.Nat8)),
    });
    const GetBlocksArgs = IDL.Record({
        'start': BlockIndex,
        'length': IDL.Nat64,
    });
    const BlockRange = IDL.Record({
        'blocks': IDL.Vec(Block),
    });
    const QueryBlocksResponse = IDL.Record({
        'chain_length': IDL.Nat64,
        'first_block_index': BlockIndex,
        'blocks': IDL.Vec(Block),
        'archived_blocks': IDL.Vec(IDL.Record({
            'start': BlockIndex,
            'length': IDL.Nat64,
            'callback': IDL.Func([GetBlocksArgs], [BlockRange], ['query']),
        })),
    });
    return IDL.Service({
        'query_blocks': IDL.Func([GetBlocksArgs], [QueryBlocksResponse], ['query']),
    });
};