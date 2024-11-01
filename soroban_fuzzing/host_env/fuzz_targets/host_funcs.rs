#![no_main]

use libfuzzer_sys::{arbitrary, fuzz_target};
use soroban_env_common::EnvBase;
use soroban_env_host::{Env, Host};

fuzz_target!(|methods: FuzzedMethods| {
    let host = Host::default();

    for method in methods.methods {
        match method {
            /*HostFuncs::CallHostFuncs { funcs } => {
                funcs.call(&host)
            }*/
            HostFuncs::ContextHostFuncs { funcs } => {
                funcs.call(&host)
            }
            HostFuncs::IntHostFuncs { funcs } => {
                funcs.call(&host)
            }
            HostFuncs::LedgerHostFuncs { funcs } => {
                funcs.call(&host)
            }
            HostFuncs::CryptoHostFuncs { funcs } => {
                funcs.call(&host)
            }
            HostFuncs::AddressHostFuncs { funcs } => {
                funcs.call(&host)
            }
            HostFuncs::VecHostFuncs { funcs } => {
                funcs.call(&host)
            }
            HostFuncs::MapHostFuncs { funcs } => {
                funcs.call(&host)
            }
            HostFuncs::BufHostFuncs { funcs } => {
                funcs.call(&host)
            }
        }
    }
});

#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
struct FuzzedMethods {
    methods: Vec<HostFuncs>,
}

#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum HostFuncs {
    ContextHostFuncs {
        funcs: ContextHostFuncs,
    },
    /*CallHostFuncs {
        funcs: CallHostFuncs,
    },*/
    IntHostFuncs {
        funcs: IntHostFuncs,
    },
    LedgerHostFuncs {
        funcs: LedgerHostFuncs,
    },
    CryptoHostFuncs {
        funcs: CryptoHostFuncs,
    },
    AddressHostFuncs {
        funcs: AddressHostFuncs,
    },
    VecHostFuncs {
        funcs: VecHostFuncs,
    },
    MapHostFuncs {
        funcs: MapHostFuncs,
    },
    BufHostFuncs {
        funcs: BufHostFuncs,
    },
}

#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum ContextHostFuncs {
    // pub fn log_from_linear_memory(msg_pos: U32Val, msg_len: U32Val, vals_pos: U32Val, vals_len: U32Val) -> Void;
    LogFromLinearMemory { msg_pos: U32Val, msg_len: U32Val, vals_pos: U32Val, vals_len: U32Val },

    // pub fn obj_cmp(a: Val, b: Val) -> i64;
    ObjCmp { a: Val, b: Val },

    // pub fn contract_event(topics: VecObject, data: Val) -> Void;
    ContractEvent { topics: VecObject, data: Val },

    // pub fail_with_error(error: Error) -> Void;
    FailWithError { error: Error },

}

impl ContextHostFuncs {
    fn call(self, host: &Host) {
        match self {
            ContextHostFuncs::LogFromLinearMemory { msg_pos, msg_len, vals_pos, vals_len } => {
                let _ = host.log_from_linear_memory(msg_pos.as_inner(), msg_len.as_inner(), vals_pos.as_inner(), vals_len.as_inner());
            }
            ContextHostFuncs::ObjCmp { a, b } => {
                let _ = host.obj_cmp(a.as_inner(), b.as_inner());
            }
            ContextHostFuncs::ContractEvent { topics, data } => {
                let _ = host.contract_event(topics.as_inner(), data.as_inner());
            }
            ContextHostFuncs::FailWithError { error } => {
                let _ = host.fail_with_error(error.as_inner());
            }
        }
    }
}


/*#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum CallHostFuncs {
    // pub fn call(contract: AddressObject, func: Symbol, args: VecObject) -> Val;
    Call {
        contract: AddressObject,
        func: Symbol,
        args: VecObject,
    },
    // pub fn try_call(contract: AddressObject, func: Symbol, args: VecObject) -> Val;
    TryCall {
        contract: AddressObject,
        func: Symbol,
        args: VecObject,
    },
}

impl CallHostFuncs {
    fn call(self, host: &Host) {
        match self {
            CallHostFuncs::Call {
                contract,
                func,
                args,
            } => {
                let _ = host.call(contract.as_inner(), func.as_inner(), args.as_inner());
            }
            CallHostFuncs::TryCall {
                contract,
                func,
                args,
            } => {
                let _ = host.try_call(contract.as_inner(), func.as_inner(), args.as_inner());
            }
        }
    }
}*/


#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum IntHostFuncs {
    // pub fn obj_from_u128_pieces(hi: u64, lo: u64) -> U128Object;
    ObjFromU128Pieces {
        hi: u64,
        lo: u64,
    },

    // pub fn obj_to_u128_lo64(obj: U128Object) -> u64;
    ObjToU128Lo64 {
        obj: U128Object,
    },

    // pub fn obj_to_u128_hi64(obj: U128Object) -> u64;
    ObjToU128Hi64 {
        obj: U128Object,
    },

    // pub fn obj_from_i128_pieces(hi: i64, lo: u64) -> I128Object;
    ObjFromI128Pieces {
        hi: i64,
        lo: u64,
    },

    // pub fn obj_to_i128_lo64(obj: I128Object) -> u64;
    ObjToI128Lo64 {
        obj: I128Object,
    },

    // pub fn obj_to_i128_hi64(obj: I128Object) -> i64;
    ObjToI128Hi64 {
        obj: I128Object,
    },


    // pub fn obj_from_u256_pieces(hi_hi: u64, hi_lo: u64, lo_hi: u64, lo_lo: u64) -> U256Object;
    ObjFromU256Pieces {
        hi_hi: u64,
        hi_lo: u64,
        lo_hi: u64,
        lo_lo: u64,
    },

    // pub fn u256_val_from_be_bytes(bytes: BytesObject) -> U256Val;
    U256ValFromBeBytes {
        bytes: BytesObject,
    },

    // pub fn u256_val_to_be_bytes(val: U256Val) -> BytesObject;
    U256ValToBeBytes {
        val: U256Val,
    },

    // pub fn obj_to_u256_hi_hi(obj: U256Object) -> u64;
    ObjToU256HiHi {
        obj: U256Object,
    },

    // pub fn obj_to_u256_hi_lo(obj: U256Object) -> u64;
    ObjToU256HiLo {
        obj: U256Object,
    },

    // pub fn obj_to_u256_lo_hi(obj: U256Object) -> u64;
    ObjToU256LoHi {
        obj: U256Object,
    },

    // pub fn obj_to_u256_lo_lo(obj: U256Object) -> u64;
    ObjToU256LoLo {
        obj: U256Object,
    },

    // pub fn obj_from_i256_pieces(hi_hi: i64, hi_lo: u64, lo_hi: u64, lo_lo: u64) -> I256Object;
    ObjFromI256Pieces {
        hi_hi: i64,
        hi_lo: u64,
        lo_hi: u64,
        lo_lo: u64,
    },

    // pub fn i256_val_from_be_bytes(bytes: BytesObject) -> I256Val;
    I256ValFromBeBytes {
        bytes: BytesObject,
    },

    // pub fn i256_val_to_be_bytes(val: i256Val) -> BytesObject;
    I256ValToBeBytes {
        val: I256Val,
    },

    // pub fn obj_to_i256_hi_hi(obj: I256Object) -> i64;
    ObjToI256HiHi {
        obj: I256Object,
    },

    // pub fn obj_to_i256_hi_lo(obj: I256Object) -> u64;
    ObjToI256HiLo {
        obj: I256Object,
    },

    // pub fn obj_to_i256_lo_hi(obj: I256Object) -> u64;
    ObjToI256LoHi {
        obj: I256Object,
    },

    // pub fn obj_to_i256_lo_lo(obj: I256Object) -> u64;
    ObjToI256LoLo {
        obj: I256Object,
    },
}

impl IntHostFuncs {
    fn call(self, host: &Host) {
        match self {
            IntHostFuncs::ObjFromU128Pieces { hi, lo } => {
                let _ = host.obj_from_u128_pieces(hi, lo);
            }
            IntHostFuncs::ObjToU128Lo64 { obj } => {
                let _ = host.obj_to_u128_lo64(obj.as_inner());
            }
            IntHostFuncs::ObjToU128Hi64 { obj } => {
                let _ = host.obj_to_u128_hi64(obj.as_inner());
            }
            IntHostFuncs::ObjFromI128Pieces { hi, lo } => {
                let _ = host.obj_from_i128_pieces(hi, lo);
            }
            IntHostFuncs::ObjToI128Lo64 { obj } => {
                let _ = host.obj_to_i128_lo64(obj.as_inner());
            }
            IntHostFuncs::ObjToI128Hi64 { obj } => {
                let _ = host.obj_to_i128_hi64(obj.as_inner());
            }
            IntHostFuncs::ObjFromU256Pieces {
                hi_hi,
                hi_lo,
                lo_hi,
                lo_lo,
            } => {
                let _ = host.obj_from_u256_pieces(hi_hi, hi_lo, lo_hi, lo_lo);
            }
            IntHostFuncs::U256ValFromBeBytes { bytes } => {
                let _ = host.u256_val_from_be_bytes(bytes.as_inner());
            }
            IntHostFuncs::U256ValToBeBytes { val } => {
                let _ = host.u256_val_to_be_bytes(val.as_inner());
            }

            IntHostFuncs::ObjToU256HiHi { obj } => {
                let _ = host.obj_to_u256_hi_hi(obj.as_inner());
            }
            IntHostFuncs::ObjToU256HiLo { obj } => {
                let _ = host.obj_to_u256_hi_lo(obj.as_inner());
            }
            IntHostFuncs::ObjToU256LoHi { obj } => {
                let _ = host.obj_to_u256_lo_hi(obj.as_inner());
            }
            IntHostFuncs::ObjToU256LoLo { obj } => {
                let _ = host.obj_to_u256_lo_lo(obj.as_inner());
            }
            IntHostFuncs::ObjFromI256Pieces {
                hi_hi,
                hi_lo,
                lo_hi,
                lo_lo,
            } => {
                let _ = host.obj_from_i256_pieces(hi_hi, hi_lo, lo_hi, lo_lo);
            }
            IntHostFuncs::I256ValFromBeBytes { bytes } => {
                let _ = host.i256_val_from_be_bytes(bytes.as_inner());
            }
            IntHostFuncs::I256ValToBeBytes { val } => {
                let _ = host.i256_val_to_be_bytes(val.as_inner());
            }
            IntHostFuncs::ObjToI256HiHi { obj } => {
                let _ = host.obj_to_i256_hi_hi(obj.as_inner());
            }
            IntHostFuncs::ObjToI256HiLo { obj } => {
                let _ = host.obj_to_i256_hi_lo(obj.as_inner());
            }
            IntHostFuncs::ObjToI256LoHi { obj } => {
                let _ = host.obj_to_i256_lo_hi(obj.as_inner());
            }
            IntHostFuncs::ObjToI256LoLo { obj } => {
                let _ = host.obj_to_i256_lo_lo(obj.as_inner());
            }
        }
    }
}

#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum LedgerHostFuncs {
    // pub fn put_contract_data(k: Val, v: Val, t: StorageType) -> Void;
    PutContractData {
        k: Val,
        v: Val,
        t: StorageType,
    },
    // pub fn has_contract_data(k: Val, t: StorageType) -> Bool;
    HasContractData {
        k: Val,
        t: StorageType,
    },

    // pub fn get_contract_data(k: Val, t: StorageType) -> Val;
    GetContractData {
        k: Val,
        t: StorageType,
    },

    // pub fn del_contract_data(k: Val,t: StorageType) -> Void;
    DelContractData {
        k: Val,
        t: StorageType,
    },

    // pub fn create_contract(deployer: AddressObject, wasm_hash: BytesObject, salt: BytesObject) -> AddressObject;
    CreateContract {
        deployer: AddressObject,
        wasm_hash: BytesObject,
        salt: BytesObject,
    },

    // pub fn create_asset_contract(serialized_asset: BytesObject) -> AddressObject;
    CreateAssetContract {
        serialized_asset: BytesObject,
    },

    // pub fn get_contract_id(deployer: AddressObject, salt: BytesObject) -> AddressObject;
    GetContractId {
        deployer: AddressObject,
        salt: BytesObject,
    },

    // pub fn get_asset_contract_id(serialized_asset: BytesObject) -> AddressObject;
    GetAssetContractId {
        serialized_asset: BytesObject,
    },

    // pub fn upload_wasm(wasm: BytesObject) -> BytesObject;
    UploadWasm {
        wasm: BytesObject,
    },

    // pub fn update_current_contract_wasm(hash: BytesObject) -> Void;
    UpdateCurrentContractWasm {
        hash: BytesObject,
    },
}

impl LedgerHostFuncs {
    fn call(self, host: &Host) {
        match self {
            LedgerHostFuncs::PutContractData { k, v, t } => {
                let _ = host.put_contract_data(k.as_inner(), v.as_inner(), t.as_inner());
            }
            LedgerHostFuncs::HasContractData { k, t } => {
                let _ = host.has_contract_data(k.as_inner(), t.as_inner());
            }
            LedgerHostFuncs::GetContractData { k, t } => {
                let _ = host.get_contract_data(k.as_inner(), t.as_inner());
            }
            LedgerHostFuncs::DelContractData { k, t } => {
                let _ = host.del_contract_data(k.as_inner(), t.as_inner());
            }        
            LedgerHostFuncs::CreateContract { deployer, wasm_hash, salt } => {
                let _ = host.create_contract(deployer.as_inner(), wasm_hash.as_inner(), salt.as_inner());
            }
            LedgerHostFuncs::CreateAssetContract { serialized_asset } => {
                let _ = host.create_asset_contract(serialized_asset.as_inner());
            }
            LedgerHostFuncs::GetContractId { deployer, salt } => {
                let _ = host.get_contract_id(deployer.as_inner(), salt.as_inner());
            }
            LedgerHostFuncs::GetAssetContractId { serialized_asset } => {
                let _ = host.get_asset_contract_id(serialized_asset.as_inner());
            }
            LedgerHostFuncs::UploadWasm { wasm } => {
                let _ = host.upload_wasm(wasm.as_inner());
            }
            LedgerHostFuncs::UpdateCurrentContractWasm { hash } => {
                let _ = host.update_current_contract_wasm(hash.as_inner());
            }
        }
    }
}


#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum CryptoHostFuncs {
    // pub fn compute_hash_sha256(x: BytesObject) -> BytesObject;
    ComputeHashSha256 {
        x: BytesObject,
    },

    // pub compute_hash_keccak256(x: BytesObject) -> BytesObject;
    ComputeHashKeccak256 {
        x: BytesObject,
    },

    // pub fn verify_sig_ed25519(k: BytesObject, x: BytesObject, s: BytesObject) -> Void;
    VerifySigED25519 {
        k: BytesObject,
        x: BytesObject,
        s: BytesObject,
    },

    // pub fn recover_key_ecdsa_secp256k1(x: BytesObject) -> BytesObject;
    RecoverKeyEcdsaSecp256k1 {
        msg_digest: BytesObject,
        signature: BytesObject,
        recovery_id: U32Val,
    },
}

impl CryptoHostFuncs {
    fn call(self, host: &Host) {
        match self {
            CryptoHostFuncs::ComputeHashSha256 { x } => {
                let _ = host.compute_hash_sha256(x.as_inner());
            }
            CryptoHostFuncs::ComputeHashKeccak256 { x } => {
                let _ = host.compute_hash_keccak256(x.as_inner());
            }
            CryptoHostFuncs::VerifySigED25519 { k, x, s } => {
                let _ = host.verify_sig_ed25519(k.as_inner(), x.as_inner(), s.as_inner());
            }
            CryptoHostFuncs::RecoverKeyEcdsaSecp256k1 { msg_digest, signature, recovery_id } => {
                let _ = host.recover_key_ecdsa_secp256k1(msg_digest.as_inner(), signature.as_inner(), recovery_id.as_inner());
            }
        }
    }
}

#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum AddressHostFuncs {
    // pub fn require_auth_for_args(address: AddressObject, args: VecObject) -> Void;
    RequireAuthForArgs {
        address: AddressObject,
        args: VecObject,
    },
    // pub fn require_auth(address: AddressObject) -> Void;
    RequireAuth {
        address: AddressObject,
    },

    // pub fn authorize_as_curr_contract(auth_entries: VecObject) -> Void;
    AuthorizeAsCurrContract {
        auth_entries: VecObject,
    },

    // pub fn address_to_strkey(address: AddressObject) -> StringObject;
    AddressToStrkey {
        address: AddressObject,
    },

    // pub fn strkey_to_address(strkey_obj: Val) -> AddressObject;
    StrkeyToAddress {
        strkey_obj: Val,
    },
}

impl AddressHostFuncs {
    fn call(self, host: &Host) {
        match self {
            AddressHostFuncs::RequireAuthForArgs { address, args } => {
                let _ = host.require_auth_for_args(address.as_inner(), args.as_inner());
            }
            AddressHostFuncs::RequireAuth { address } => {
                let _ = host.require_auth(address.as_inner());
            }
            AddressHostFuncs::AuthorizeAsCurrContract { auth_entries } => {
                let _ = host.authorize_as_curr_contract(auth_entries.as_inner());
            }
            AddressHostFuncs::AddressToStrkey { address } => {
                let _ = host.address_to_strkey(address.as_inner());
            }
            AddressHostFuncs::StrkeyToAddress { strkey_obj } => {
                let _ = host.strkey_to_address(strkey_obj.as_inner());
            }
            
        }
    }
}


#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum VecHostFuncs {

    // pub fn vec_put(v: VecObject, i: U32Val, x: Val) -> VecObject;
    VecPut {
        v: VecObject,
        i: U32Val,
        x: Val,
    },

    // pub fn vec_get(v: VecObject, i: U32Val) -> Val;
    VecGet {
        v: VecObject,
        i: U32Val,
    },

    // pub fn vec_del(v: VecObject, i: U32Val) -> VecObject;
    VecDel {
        v: VecObject,
        i: U32Val,
    },

    // pub fn vec_len(v: VecObject) -> U32Val;
    VecLen {
        v: VecObject,
    },

    // pub fn vec_push_front(v: VecObject, x: RawVal) -> VecObject;
    VecPushFront {
        v: VecObject,
        x: Val,
    },

    // pub fn vec_pop_front(v: VecObject) -> VecObject;
    VecPopFront {
        v: VecObject,
    },

    // pub fn vec_push_back(v: VecObject, x: Val) -> VecObject;
    VecPushBack {
        v: VecObject,
        x: Val,
    },

    // pub fn vec_pop_back(v: VecObject) -> VecObject;
    VecPopBack {
        v: VecObject,
    },

    // pub fn vec_front(v: VecObject) -> Val;
    VecFront {
        v: VecObject,
    },

    // pub fn vec_back(v: VecObject) -> Val;
    VecBack {
        v: VecObject,
    },

    // pub fn vec_insert(v: VecObject, i: U32Val, x: Val) -> VecObject;
    VecInsert {
        v: VecObject,
        i: U32Val,
        x: Val,
    },

    // pub fn vec_append(v1: VecObject, v2: VecObject) -> VecObject;
    VecAppend {
        v1: VecObject,
        v2: VecObject,
    },

    // pub fn vec_slice(v: VecObject, start: U32Val, end: U32Val) -> VecObject;
    VecSlice {
        v: VecObject,
        start: U32Val,
        end: U32Val,
    },

    // pub fn vec_first_index_of(v: VecObject, x: Val) -> Val;
    VecFirstIndexOf {
        v: VecObject,
        x: Val,
    },

    // pub fn vec_last_index_of(v: VecObject, x: Val) -> Val;
    VecLastIndexOf {
        v: VecObject,
        x: Val,
    },

    // pub fn vec_binary_search(v: VecObject, x: Val) -> u64;
    VecBinarySearch {
        v: VecObject,
        x: Val,
    },

    // pub fn vec_new_from_linear_memory(vals_pos: U32Val, len: U32Val) -> VecObject;
    VecNewFromLinearMemory {
        vals_pos: U32Val,
        len: U32Val,
    },

    // pub fn vec_unpack_to_linear_memory(vec: VecObject, vals_pos: U32Val, len: U32Val) -> Void;
    VecUnpackToLinearMemory {
        vec: VecObject,
        vals_pos: U32Val,
        len: U32Val,
    },
}

impl VecHostFuncs {
    
    fn call(self, host: &Host) {
        match self {
            VecHostFuncs::VecPut { v, i, x } => {
                    let _ = host.vec_put(v.as_inner(), i.as_inner(), x.as_inner());
            }
            VecHostFuncs::VecGet { v, i } => {
                let _ = host.vec_get(v.as_inner(), i.as_inner());
            }
            VecHostFuncs::VecDel { v, i } => {
                    let _ = host.vec_del(v.as_inner(), i.as_inner());
            }
            VecHostFuncs::VecLen { v } => {
                    let _ = host.vec_len(v.as_inner());
            }
            VecHostFuncs::VecPushFront { v, x } => {
                    let _ = host.vec_push_front(v.as_inner(), x.as_inner());
            }
            VecHostFuncs::VecPopFront { v } => {
                    let _ = host.vec_pop_front(v.as_inner());
            }
            VecHostFuncs::VecPushBack { v, x } => {
                    let _ = host.vec_push_back(v.as_inner(), x.as_inner());
            }
            VecHostFuncs::VecPopBack { v } => {
                    let _ = host.vec_pop_back(v.as_inner());
            }
            VecHostFuncs::VecFront { v } => {
                    let _ = host.vec_front(v.as_inner());
            }
            VecHostFuncs::VecBack { v } => {
                    let _ = host.vec_back(v.as_inner());
            }
            VecHostFuncs::VecInsert { v, i, x } => {
                    let _ = host.vec_insert(v.as_inner(), i.as_inner(), x.as_inner());
            }
            VecHostFuncs::VecAppend { v1, v2 } => {
                    let _ = host.vec_append(v1.as_inner(), v2.as_inner());
            }
            VecHostFuncs::VecSlice { v, start, end } => {
                    let _ = host.vec_slice(v.as_inner(), start.as_inner(), end.as_inner());
            }
            VecHostFuncs::VecFirstIndexOf { v, x } => {
                    let _ = host.vec_first_index_of(v.as_inner(), x.as_inner());
            }
            VecHostFuncs::VecLastIndexOf { v, x } => {
                    let _ = host.vec_last_index_of(v.as_inner(), x.as_inner());
            }
            VecHostFuncs::VecBinarySearch { v, x } => {
                    let _ = host.vec_binary_search(v.as_inner(), x.as_inner());
            }
            VecHostFuncs::VecNewFromLinearMemory { vals_pos, len } => {
                    let _ = host.vec_new_from_linear_memory(vals_pos.as_inner(), len.as_inner());
            }
            VecHostFuncs::VecUnpackToLinearMemory { vec, vals_pos, len } => {
                    let _ = host.vec_unpack_to_linear_memory(vec.as_inner(), vals_pos.as_inner(), len.as_inner());
            }
        }
    }
}

#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum MapHostFuncs {

    // pub fn map_put(m: MapObject, k: Val, v: Val) -> MapObject;
    MapPut {
        m: MapObject,
        k: Val,
        v: Val,
    },
    // pub fn map_get(m: MapObject, k: Val) -> Val;
    Mapget {
        m: MapObject,
        k: Val,
    },

    // pub fn map_del(m: MapObject, k: Val) -> MapObject;
    MapDel {
        m: MapObject,
        k: Val,
    },

    // pub fn map_len(m: MapObject) -> U32Val;
    MapLen {
        m: MapObject,
    },

    // pub fn map_has(m: MapObject, k: Val) -> Bool;
    MapHas {
        m: MapObject,
        k: Val,
    },

    // pub fn map_key_by_pos(m: MapObject, k: U32Val) -> Val;
    MapKeyByPos {
        m: MapObject,
        i: U32Val,
    },

    // pub fn map_val_by_pos(m: MapObject, i: U32Val) -> Val;
    MapValByPos {
        m: MapObject,
        i: U32Val,
    },

    // pub fn map_keys(m: MapObject) -> VecObject;
    MapKeys {
        m: MapObject,
    },

    // pub fn map_values(m: MapObject) -> VecObject;
    MapValues {
        m: MapObject,
    },

    // pub fn map_new_from_linear_memory(
    //     keys_pos: U32Val,
    //     vals_pos: U32Val,
    //     len: U32Val,
    // ) -> MapObject;
    MapNewFromLinearMemory {
        keys_pos: U32Val,
        vals_pos: U32Val,
        len: U32Val,
    },

    // pub fn map_unpack_to_linear_memory(
    //     map: MapObject,
    //     keys_pos: U32Val,
    //     vals_pos: U32Val,
    //     len: U32Val,
    // ) -> Void;
    MapUnpackToLinearMemory {
        map: MapObject,
        keys_pos: U32Val,
        vals_pos: U32Val,
        len: U32Val,
    },
}

impl MapHostFuncs {
    fn call(self, host: &Host) {
        match self {
            MapHostFuncs::MapPut { m, k, v } => {
                    let _ = host.map_put(m.as_inner(), k.as_inner(), v.as_inner());
            }
            MapHostFuncs::Mapget { m, k } => {
                    let _ = host.map_get(m.as_inner(), k.as_inner());
            }
            MapHostFuncs::MapDel { m, k } => {
                    let _ = host.map_del(m.as_inner(), k.as_inner());
            }
            MapHostFuncs::MapLen { m } => {
                    let _ = host.map_len(m.as_inner());
            }
            MapHostFuncs::MapHas { m, k } => {
                    let _ = host.map_has(m.as_inner(), k.as_inner());
            }
            MapHostFuncs::MapKeyByPos { m, i } => {
                    let _ = host.map_key_by_pos(m.as_inner(), i.as_inner());
            }
            MapHostFuncs::MapValByPos { m, i } => {
                    let _ = host.map_val_by_pos(m.as_inner(), i.as_inner());
            }
            MapHostFuncs::MapKeys { m } => {
                    let _ = host.map_keys(m.as_inner());
            }
            MapHostFuncs::MapValues { m } => {
                    let _ = host.map_values(m.as_inner());
            }
            MapHostFuncs::MapNewFromLinearMemory {keys_pos, vals_pos, len} => {
                    let _ = host.map_new_from_linear_memory(keys_pos.as_inner(), vals_pos.as_inner(), len.as_inner());
            }
            MapHostFuncs::MapUnpackToLinearMemory {map, keys_pos, vals_pos, len} => {
                    let _ = host.map_unpack_to_linear_memory(map.as_inner(), keys_pos.as_inner(), vals_pos.as_inner(), len.as_inner());
            }
        }
    }
}


#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum BufHostFuncs {

    // pub fn serialize_to_bytes(v: Val) -> BytesObject;
    SerializeToBytes {
        v: Val,
    },

    // pub fn deserialize_from_bytes(b: BytesObject) -> Val;
    DeserializeFromBytes {
        b: BytesObject,
    },

    // pub fn string_copy_to_linear_memory(
    //     s: StringObject,
    //     s_pos: U32Val,
    //     lm_pos: U32Val,
    //     len: U32Val,
    // ) -> Void;
    StringCopyToLinearMemory {
        s: StringObject,
        s_pos: U32Val,
        lm_pos: U32Val,
        len: U32Val,
    },

    // pub fn symbol_copy_to_linear_memory(
    //     s: SymbolObject,
    //     s_pos: U32Val,
    //     lm_pos: U32Val,
    //     len: U32Val,
    // ) -> Void;
    SymbolCopyToLinearMemory {
        s: SymbolObject,
        s_pos: U32Val,
        lm_pos: U32Val,
        len: U32Val,
    },

    // pub fn bytes_copy_to_linear_memory(
    //     b: BytesObject,
    //     b_pos: U32Val,
    //     lm_pos: U32Val,
    //     len: U32Val,
    // ) -> Void;
    BytesCopyToLinearMemory {
        b: BytesObject,
        b_pos: U32Val,
        lm_pos: U32Val,
        len: U32Val,
    },

    // pub fn bytes_copy_from_linear_memory(
    //     b: BytesObject,
    //     b_pos: U32Val,
    //     lm_pos: U32Val,
    //     len: U32Val,
    // ) -> BytesObject;
    BytesCopyFromLinearMemory {
        b: BytesObject,
        b_pos: U32Val,
        lm_pos: U32Val,
        len: U32Val,
    },

    // pub fn bytes_new_from_linear_memory(lm_pos: U32Val, len: U32Val) -> BytesObject;
    BytesNewFromLinearMemory {
        lm_pos: U32Val,
        len: U32Val,
    },

    // pub fn string_new_from_linear_memory(lm_pos: U32Val, len: U32Val) -> StringObject;
    StringNewFromLinearMemory {
        lm_pos: U32Val,
        len: U32Val,
    },

    // pub fn symbol_new_from_linear_memory(lm_pos: U32Val, len: U32Val) -> SymbolObject;
    SymbolNewFromLinearMemory {
        lm_pos: U32Val,
        len: U32Val,
    },

    // pub fn symbol_index_in_linear_memory(
    //     sym: Symbol,
    //     slices_pos: U32Val,
    //     len: U32Val,
    // ) -> U32Val;
    /*SymbolIndexInLinearMemory {
        sym: Symbol,
        slices_pos: U32Val,
        len: U32Val,
    },*/

    // pub fn bytes_put(b: BytesObject, i: U32Val, u: U32Val) -> BytesObject;
    BytesPut {
        b: BytesObject,
        iv: U32Val,
        u: U32Val,
    },

    // pub fn bytes_get(b: BytesObject, i: U32Val) -> U32Val;
    BytesGet {
        b: BytesObject,
        iv: U32Val,
    },

    // pub fn bytes_del(b: BytesObject, i: U32Val) -> BytesObject;
    BytesDel {
        b: BytesObject,
        i: U32Val,
    },

    // pub fn bytes_len(b: BytesObject) -> U32Val;
    BytesLen {
        b: BytesObject,
    },

    // pub fn string_len(s: StringObject) -> U32Val;
    StringLen {
        b: StringObject,
    },

    // pub fn symbol_len(s: SymbolObject) -> U32Val;
    SymbolLen {
        b: SymbolObject,
    },

    // pub fn bytes_push(b: BytesObject, u: U32Val) -> BytesObject;
    BytesPush {
        b: BytesObject,
        u: U32Val,
    },

    // pub fn bytes_pop(b: BytesObject) -> BytesObject;
    BytesPop {
        b: BytesObject,
    },

    // pub fn bytes_front(b: BytesObject) -> U32Val;
    BytesFront {
        b: BytesObject,
    },

    // pub fn bytes_back(b: BytesObject) -> U32Val;
    BytesBack {
        b: BytesObject,
    },

    // pub fn bytes_insert(b: BytesObject, i: U32Val, u: U32Val) -> BytesObject;
    BytesInsert {
        b: BytesObject,
        i: U32Val,
        u: U32Val,
    },

    // pub fn bytes_append(b1: BytesObject, b2: BytesObject) -> BytesObject;
    BytesAppend {
        b1: BytesObject,
        b2: BytesObject,
    },

    // pub fn bytes_slice(b: BytesObject, start: U32Val, end: U32Val) -> BytesObject;
    BytesSlice {
        b: BytesObject,
        start: U32Val,
        end: U32Val,
    },
}

impl BufHostFuncs {
    fn call(self, host: &Host) {
        match self {
            BufHostFuncs::SerializeToBytes { v } => {
                    let _ = host.serialize_to_bytes(v.as_inner());
            }
            BufHostFuncs::DeserializeFromBytes { b } => {
                    let _ = host.deserialize_from_bytes(b.as_inner());
            }
            BufHostFuncs::StringCopyToLinearMemory {s, s_pos, lm_pos, len} => {
                    let _ = host.string_copy_to_linear_memory(s.as_inner(), s_pos.as_inner(), lm_pos.as_inner(), len.as_inner());
            }
            BufHostFuncs::SymbolCopyToLinearMemory {s, s_pos, lm_pos, len} => {
                    let _ = host.symbol_copy_to_linear_memory(s.as_inner(), s_pos.as_inner(), lm_pos.as_inner(), len.as_inner());
            }
            BufHostFuncs::BytesCopyToLinearMemory {b, b_pos, lm_pos, len} => {
                    let _ = host.bytes_copy_to_linear_memory(b.as_inner(), b_pos.as_inner(), lm_pos.as_inner(), len.as_inner());
            }
            BufHostFuncs::BytesCopyFromLinearMemory {b, b_pos, lm_pos, len} => {
                    let _ = host.bytes_copy_from_linear_memory(b.as_inner(), b_pos.as_inner(), lm_pos.as_inner(), len.as_inner());
            }
            BufHostFuncs::BytesNewFromLinearMemory { lm_pos, len } => {
                    let _ = host.bytes_new_from_linear_memory(lm_pos.as_inner(), len.as_inner());
            }
            BufHostFuncs::StringNewFromLinearMemory { lm_pos, len } => {
                    let _ = host.string_new_from_linear_memory(lm_pos.as_inner(), len.as_inner());
            }
            BufHostFuncs::SymbolNewFromLinearMemory { lm_pos, len } => {
                    let _ = host.symbol_new_from_linear_memory(lm_pos.as_inner(), len.as_inner());
            }
            /*BufHostFuncs::SymbolIndexInLinearMemory {sym, slices_pos, len} => {
                    let _ = host.symbol_index_in_linear_memory(sym.as_inner(), slices_pos.as_inner(), len.as_inner());
            }*/
            BufHostFuncs::BytesPut { b, iv, u } => {
                    let _ = host.bytes_put(b.as_inner(), iv.as_inner(), u.as_inner());
            }
            BufHostFuncs::BytesGet { b, iv } => {
                    let _ = host.bytes_get(b.as_inner(), iv.as_inner());
            }
            BufHostFuncs::BytesDel { b, i } => {
                    let _ = host.bytes_del(b.as_inner(), i.as_inner());
            }
            BufHostFuncs::BytesLen { b } => {
                    let _ = host.bytes_len(b.as_inner());
            }
            BufHostFuncs::StringLen { b } => {
                    let _ = host.string_len(b.as_inner());
            }
            BufHostFuncs::SymbolLen { b } => {
                    let _ = host.symbol_len(b.as_inner());
            }
            BufHostFuncs::BytesPush { b, u } => {
                    let _ = host.bytes_push(b.as_inner(), u.as_inner());
            }
            BufHostFuncs::BytesPop { b } => {
                    let _ = host.bytes_pop(b.as_inner());
            }
            BufHostFuncs::BytesFront { b } => {
                    let _ = host.bytes_front(b.as_inner());
            }
            BufHostFuncs::BytesBack { b } => {
                    let _ = host.bytes_back(b.as_inner());
            }
            BufHostFuncs::BytesInsert { b, i, u } => {
                    let _ = host.bytes_insert(b.as_inner(), i.as_inner(), u.as_inner());
            }
            BufHostFuncs::BytesAppend { b1, b2 } => {
                    let _ = host.bytes_append(b1.as_inner(), b2.as_inner());
            }
            BufHostFuncs::BytesSlice { b, start, end } => {
                    let _ = host.bytes_slice(b.as_inner(), start.as_inner(), end.as_inner());
            }
        }
    }
}

#[derive(Debug)]
struct Val(soroban_env_host::Val);

impl Val {
    fn as_inner(self) -> soroban_env_host::Val {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for Val {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let tag = Tag::arbitrary(u)?;
        let x = u64::arbitrary(u)?;
        let val = soroban_env_host::Val::from_payload((x << 8) | (tag as u64));
        Ok(Self(val))
    }
}


#[derive(Debug)]
struct VecObject(soroban_env_host::VecObject);

impl VecObject {
    fn as_inner(self) -> soroban_env_host::VecObject {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for VecObject {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;
        let val = unsafe { soroban_env_host::VecObject::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct BytesObject(soroban_env_host::BytesObject);

impl BytesObject {
    fn as_inner(self) -> soroban_env_host::BytesObject {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for BytesObject {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;
        let val = unsafe { soroban_env_host::BytesObject::from_handle(x) };
        Ok(Self(val))
    }
}

/*#[derive(Debug)]
struct Symbol(soroban_env_host::Symbol);

impl Symbol {
    fn as_inner(self) -> soroban_env_host::Symbol {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for Symbol {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u64::arbitrary(u)?;

        let val = unsafe { soroban_env_host::Symbol::from_small_body(x) };
        Ok(Self(val))
    }
}*/

#[derive(Debug)]
struct AddressObject(soroban_env_host::AddressObject);

impl AddressObject {
    fn as_inner(self) -> soroban_env_host::AddressObject {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for AddressObject {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;
        let val = unsafe { soroban_env_host::AddressObject::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct U32Val(soroban_env_host::U32Val);

impl U32Val {
    fn as_inner(self) -> soroban_env_host::U32Val {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for U32Val {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;
        let val = soroban_env_host::Val::from_u32(x);
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct Error(soroban_env_host::Error);

impl Error {
    fn as_inner(self) -> soroban_env_host::Error {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for Error {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;

        let val = soroban_env_host::Error::from_contract_error(x);
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct U128Object(soroban_env_host::U128Object);

impl U128Object {
    fn as_inner(self) -> soroban_env_host::U128Object {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for U128Object {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;

        let val = unsafe { soroban_env_host::U128Object::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct I128Object(soroban_env_host::I128Object);

impl I128Object {
    fn as_inner(self) -> soroban_env_host::I128Object {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for I128Object {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;

        let val = unsafe { soroban_env_host::I128Object::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct U256Object(soroban_env_host::U256Object);

impl U256Object {
    fn as_inner(self) -> soroban_env_host::U256Object {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for U256Object {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;

        let val = unsafe { soroban_env_host::U256Object::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct I256Object(soroban_env_host::I256Object);

impl I256Object {
    fn as_inner(self) -> soroban_env_host::I256Object {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for I256Object {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;

        let val = unsafe { soroban_env_host::I256Object::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct U256Val(soroban_env_host::U256Val);

impl U256Val {
    fn as_inner(self) -> soroban_env_host::U256Val {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for U256Val {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;
        let val = soroban_env_host::U256Val::from_u32(x);
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct I256Val(soroban_env_host::I256Val);

impl I256Val {
    fn as_inner(self) -> soroban_env_host::I256Val {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for I256Val {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = i32::arbitrary(u)?;
        let val = soroban_env_host::I256Val::from_i32(x);
        Ok(Self(val))
    }
}

#[derive(arbitrary::Arbitrary, Debug)]
struct StorageType(soroban_env_host::StorageType);

impl StorageType {
    fn as_inner(self) -> soroban_env_host::StorageType {
        self.0
    }
}

/*impl<'a> arbitrary::Arbitrary<'a> for StorageType {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let val = soroban_env_host::StorageType::arbitrary(u)?;
        Ok(Self(val))
    }
}*/

#[derive(Debug)]
struct MapObject(soroban_env_host::MapObject);

impl MapObject {
    fn as_inner(self) -> soroban_env_host::MapObject {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for MapObject {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;
        let val = unsafe { soroban_env_host::MapObject::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct StringObject(soroban_env_host::StringObject);

impl StringObject {
    fn as_inner(self) -> soroban_env_host::StringObject {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for StringObject {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;

        let val = unsafe { soroban_env_host::StringObject::from_handle(x) };
        Ok(Self(val))
    }
}

#[derive(Debug)]
struct SymbolObject(soroban_env_host::SymbolObject);

impl SymbolObject {
    fn as_inner(self) -> soroban_env_host::SymbolObject {
        self.0
    }
}

impl<'a> arbitrary::Arbitrary<'a> for SymbolObject {
    fn arbitrary(u: &mut arbitrary::Unstructured<'a>) -> arbitrary::Result<Self> {
        let x = u32::arbitrary(u)?;

        let val = unsafe { soroban_env_host::SymbolObject::from_handle(x) };
        Ok(Self(val))
    }
}

#[repr(u8)]
#[derive(Copy, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Debug, arbitrary::Arbitrary)]
pub enum Tag {
    False = 0,
    True = 1,
    Void = 2,
    Error = 3,
    U32Val = 4,
    I32Val = 5,
    U64Small = 6,
    I64Small = 7,
    TimepointSmall = 8,
    DurationSmall = 9,
    U128Small = 10,
    I128Small = 11,
    U256Small = 12,
    I256Small = 13,
    SymbolSmall = 14,
    SmallCodeUpperBound = 15,
    ObjectCodeLowerBound = 63,
    U64Object = 64,
    I64Object = 65,
    TimepointObject = 66,
    DurationObject = 67,
    U128Object = 68,
    I128Object = 69,
    U256Object = 70,
    I256Object = 71,
    BytesObject = 72,
    StringObject = 73,
    SymbolObject = 74,
    VecObject = 75,
    MapObject = 76,
    AddressObject = 77,
    ObjectCodeUpperBound = 78,
    Bad = 0x7f,
}
