import { Address, BigInt,BigDecimal, log } from "@graphprotocol/graph-ts"
import { newCategoryAdded, baseURIUpdated,BoosterMinted,boosterURIUpdated,discountMultiplierUpdated,BoosterWhiteListed
,BoosterBlackListed,Transfer,Approval,ApprovalForAll } from "../../generated/SIGHBoosterSale/SIGHBoosterSale"
import { SIGHBoosters,Booster, BoosterCategory, User } from "../../generated/schema"
import {createSIGHBoosters,createNewBooster,createBoosterCategory,createUser} from "../helpers"

// updates the Base URI
export function handleBaseURIUpdated(event: baseURIUpdated): void {
    let _SIGHBoostersId = new BigInt(1).toHexString()
    let SIGHBoostersState = SIGHBoosters.load(_SIGHBoostersId)
    if (!SIGHBoostersState) {
        SIGHBoostersState = createSIGHBoosters(_SIGHBoostersId)
    }
    SIGHBoostersState.name = 'SIGH Boosters'
    SIGHBoostersState.symbol = '🚀'
    SIGHBoostersState.baseURI = event.params.baseURI
    SIGHBoostersState.save()
}

// creates a new Booster category
export function handleNewCategoryAdded(event: newCategoryAdded): void {
    let categoryId = event.params._type.toHexString()
    let categoryState = BoosterCategory.load(categoryId)
    if (!categoryState) {
        categoryState = createBoosterCategory(categoryId)
    }
    categoryState.name = event.params._type
    categoryState.platformDiscountPercent = BigInt.fromI32(100).div(event.params._platformFeeDiscount_).toBigDecimal() 
    categoryState.reserveFeeDiscountPercent = BigInt.fromI32(100).div(event.params._sighPayDiscount_).toBigDecimal() 

    // SIGH Boosters
    let SIGHBoostersState = SIGHBoosters.load(new BigInt(1).toHexString())
    if (!SIGHBoostersState) {
        SIGHBoostersState = createSIGHBoosters(SIGHBoostersState)
    }
    categoryState._SIGHBoosters = SIGHBoostersState

    // Tx Hash
    let txHash = categoryState.creationTxHash
    txHash.push( event.transaction.hash.toHexString() )
    categoryState.creationTxHash = txHash

    categoryState.save()
}

// Mints a new Booster
export function handleBoosterMinted(event: BoosterMinted): void {
    let _boosterId = event.params.newItemId.toHexString()
    let boosterState = Booster.load(_boosterId)
    if (!boosterState) {
        boosterState = createNewBooster(_boosterId)
    }
    boosterState.boosterID = event.params.newItemId
    boosterState.ownerAddress = event.params._owner
    boosterState.imageUrl = event.params.boosterURI

    // Category
    let categoryId = event.params._type.toHexString()
    let categoryState = BoosterCategory.load(categoryId)
    boosterState.category = categoryState

    // SIGH Boosters
    let SIGHBoostersState = SIGHBoosters.load(new BigInt(1).toHexString())
    SIGHBoostersState.totalBoosters = SIGHBoostersState.totalBoosters.add(BigInt.fromI32(1))
    boosterState._SIGHBoosters = SIGHBoostersState
    

    // Creation Tx Hash
    let txHash = boosterState.creationTxHash
    txHash.push( event.transaction.hash.toHexString() )
    boosterState.creationTxHash = txHash    

    // User Entity
    let userId = event.params._owner.toHexString()
    let user = User.load(userId)
    if (!user) {
        user = createUser(userId)
    }
    user.address = event.params._owner
    let allBoostersOwned = user.listOfBoostersOwned
    allBoostersOwned.push(event.params.newItemId)
    user.listOfBoostersOwned = allBoostersOwned
    boosterState.owner = user

    SIGHBoostersState.save()
    boosterState.save()
    user.save()
}


// Booster URI Updated
export function handleBoosterURIUpdated(event: boosterURIUpdated): void {
    let _boosterId = event.params.newItemId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.imageUrl = event.params._boosterURI
    boosterState.save()
}


// Discount Multiplier Updated
export function handleDiscountMultiplierUpdated(event: discountMultiplierUpdated): void {
    let categoryId = event.params._type.toHexString()
    let categoryState = BoosterCategory.load(categoryId)
    categoryState.platformDiscountPercent = BigInt.fromI32(100).div(event.params._platformFeeDiscount_).toBigDecimal() 
    categoryState.reserveFeeDiscountPercent = BigInt.fromI32(100).div(event.params._sighPayDiscount_).toBigDecimal() 
    categoryState.save()
}

// Booster Whitelisted
export function handleBoosterWhiteListed(event: BoosterWhiteListed): void {
    let _boosterId = event.params.newItemId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.isBlacklisted = false

    // Tx Hash
    let txHash_ = boosterState.blaclistedTxHashes
    txHash_.push( event.transaction.hash.toHexString() )
    boosterState.blaclistedTxHashes = txHash_    

    boosterState.save()
}

// Booster Whitelisted
export function handleBoosterBlackListed(event: BoosterBlackListed): void {
    let _boosterId = event.params.newItemId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.isBlacklisted = true

    // Tx Hash
    let txHash_ = boosterState.blaclistedTxHashes
    txHash_.push( event.transaction.hash.toHexString() )
    boosterState.blaclistedTxHashes = txHash_    

    boosterState.save()
}

// Booster Transferred
export function handleTransfer(event: Transfer): void {
    let _boosterId = event.params.tokenId.toHexString()
    let boosterState = Booster.load(_boosterId)
    if (!boosterState) {
        boosterState = createNewBooster(_boosterId)
    }

    // remove BoosterID from the list of Boosters owned by previous User
    if ( event.params.from.toHexString() != '0x0000000000000000000000000000000000000000' ) {
        let userId = event.params.from.toHexString()
        let user = User.load(userId)
        let list =  user.listOfBoostersOwned
        for (let i=0; i < list.length; i++) {
            if ( list[i] ==  event.params.tokenId ) {
                list[i] = list[list.length - 1]
                break;
            }
        }
        list.pop()
        user.listOfBoostersOwned = list
        user.save()
    }

    // NEW OWNER
    boosterState.ownerAddress = event.params.to
    let _userId = event.params.to.toHexString()
    let newUser = User.load(_userId)
    if (!newUser) {
        newUser = createUser(_userId)
    }
    newUser.address = event.params.to.toHexString()
    boosterState.owner = newUser
    let allBoostersOwned = newUser.listOfBoostersOwned
    allBoostersOwned.push(event.params.tokenId)
    newUser.listOfBoostersOwned = allBoostersOwned



    boosterState.save()
    newUser.save()
}

// ApprovalForAll Handler
export function handleApproval(event: Approval): void {
    let _boosterId = event.params.tokenId.toHexString()
    let boosterState = Booster.load(_boosterId)
    if (!boosterState) {
        boosterState = createNewBooster(_boosterId)
    }

    boosterState.approvedAddress = event.params.approved.toHexString()
    boosterState.save()
}


// ApprovalForAll Handler
export function handleApprovalForAll(event: ApprovalForAll): void {

    let userId = event.params.owner.toHexString()
    let user = User.load(userId)
    if (!user) {
        user = createUser(userId)
    }    
    user.address = event.params.owner.toHexString()
    user.approvedForAllAddress = event.params.approved
    user.save()
}



