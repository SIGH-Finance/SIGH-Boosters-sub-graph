import {Address, BigDecimal, Bytes, BigInt, log } from '@graphprotocol/graph-ts/index'
import { log } from '@graphprotocol/graph-ts'
import { SIGHBoosters, Booster, BoosterCategory, User } from '../generated/schema'

//Keeps track of all the boosters and Categories
export function createSIGHBoosters(ID: string): SIGHBoosters {
    let _SIGHBoosters = new SIGHBoosters(ID)
    _SIGHBoosters.name = ''
    _SIGHBoosters.symbol = ''
    _SIGHBoosters.baseURI = ''
    _SIGHBoosters.totalBoosters = new BigInt(0)
    _SIGHBoosters.save()
    return _SIGHBoosters
}

// Creates an Individual Booster entity
export function createNewBooster(ID: string): Booster {
    let _Booster = new Booster(ID)
    _Booster.boosterID = new BigInt(0)
    _Booster.ownerAddress = Address.fromString('0x0000000000000000000000000000000000000000') 
    _Booster.approvedAddress = Address.fromString('0x0000000000000000000000000000000000000000') 
    _Booster.imageUrl = ''
    _Booster.fuelAvailable = new BigInt(0)
    _Booster.fuelUsed = new BigInt(0)
    _Booster.isBlacklisted = false
    _Booster.creationTxHash = []
    _Booster.save()
    return _Booster
}

// Creates a Booster Category entity
export function createBoosterCategory(ID: string): BoosterCategory {
    let _BoosterCategory = new BoosterCategory(ID)
    _BoosterCategory.name = ''
    _BoosterCategory.platformDiscountPercent = ''
    _BoosterCategory.reserveFeeDiscountPercent = ''
    _BoosterCategory.totalBoosters = new BigInt(0)
    _BoosterCategory.creationTxHash = []
    _BoosterCategory.DiscountUpdateTxHashes = []
    _BoosterCategory.save()
    return _BoosterCategory
}

// Creates a User entity
export function createUser(ID: string): User {
    let _User = new User(ID)
    _User.address = ''
    _User.symbol = ''
    _User.listOfBoostersOwned = []
    _User.save()
    return _User
}
  