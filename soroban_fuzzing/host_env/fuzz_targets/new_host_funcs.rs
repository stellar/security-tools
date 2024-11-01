#![no_main]

use libfuzzer_sys::{arbitrary, fuzz_target};
use soroban_env_common::EnvBase;
use soroban_env_host::{Env, Host};

fuzz_target!(|methods: FuzzedMethods| {
    let host = Host::default();

    for method in methods.methods {
        match method {
            HostFuncs::NewHostFuncs { funcs } => {
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
    NewHostFuncs {
        funcs: NewHostFuncs,
    },
}

#[derive(arbitrary::Arbitrary)]
#[derive(Debug)]
enum NewHostFuncs {

    Bls12_381MapFpToG1 { fp: BytesObject },
    Bls12_381MapFp2ToG2 { fp2: BytesObject },
    Bls12_381HashToG1 { mo: BytesObject, dst: BytesObject },
    Bls12_381HashToG2 { msg: BytesObject, dst: BytesObject },
    Bls12_381MultiPairingCheck { vp1: VecObject, vp2: VecObject },

}

impl NewHostFuncs {
    fn call(self, host: &Host) {
        match self {
            NewHostFuncs::Bls12_381MapFpToG1 { fp } => {
                let _ = host.bls12_381_map_fp_to_g1(fp.as_inner());
            }
            NewHostFuncs::Bls12_381MapFp2ToG2 { fp2 } => {
                let _ = host.bls12_381_map_fp2_to_g2(fp2.as_inner());
            }
            NewHostFuncs::Bls12_381HashToG1 { mo, dst } => {
                let _ = host.bls12_381_hash_to_g1(mo.as_inner(), dst.as_inner());
            }
            NewHostFuncs::Bls12_381HashToG2 { msg, dst } => {
                let _ = host.bls12_381_hash_to_g2(msg.as_inner(), dst.as_inner());
            }
            NewHostFuncs::Bls12_381MultiPairingCheck { vp1, vp2 } => {
                let _ = host.bls12_381_multi_pairing_check(vp1.as_inner(), vp2.as_inner());
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
