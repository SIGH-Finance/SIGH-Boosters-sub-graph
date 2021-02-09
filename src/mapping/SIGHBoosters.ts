import { Address, BigInt,BigDecimal, log } from "@graphprotocol/graph-ts"
import { newCategoryAdded, baseURIUpdated,BoosterMinted,boosterURIUpdated,discountMultiplierUpdated,BoosterWhiteListed
,BoosterBlackListed,Transfer,Approval,ApprovalForAll, OwnershipTransferred } from "../../generated/SIGHBoosters/SIGHBoosters"
import { SIGHBoosters,Booster, BoosterCategory, User } from "../../generated/schema"
import {createSIGHBoosters,createNewBooster,createBoosterCategory,createUser} from "../helpers"


// TransferOwnership Handler (emitted during deployment) : TESTED
export function handleTransferOwnership(event: OwnershipTransferred): void {
    let _SIGHBoostersId = event.address.toHexString()
    let SIGHBoostersState = SIGHBoosters.load(_SIGHBoostersId)
    if (!SIGHBoostersState) {
        SIGHBoostersState = createSIGHBoosters(_SIGHBoostersId)
        SIGHBoostersState.name = 'SIGH Boosters'
        SIGHBoostersState.symbol = '🚀'    
    }
    SIGHBoostersState.adminAddress = event.params.newOwner
    SIGHBoostersState.save()
}

// updates the Base URI : TESTED
export function handleBaseURIUpdated(event: baseURIUpdated): void {
    let _SIGHBoostersId = event.address.toHexString()
    let SIGHBoostersState = SIGHBoosters.load(_SIGHBoostersId)
    SIGHBoostersState.baseURI = event.params.baseURI
    log.info('handleBaseURIUpdated',[SIGHBoostersState.baseURI])
    SIGHBoostersState.save()
}

// creates a new Booster category : TESTED
export function handleNewCategoryAdded(event: newCategoryAdded): void {
    let categoryId = event.params._type
    let categoryState = BoosterCategory.load(categoryId)
    if (!categoryState) {
        categoryState = createBoosterCategory(categoryId)
        if (event.params._type == 'CYBERTRUCK ON MARS') {
            categoryState.initialFuelAvailable = BigInt.fromI32(100)
            categoryState.topUpMultiplier = BigInt.fromI32(110)
            categoryState.topUpMinAmount = BigInt.fromI32(50)
            categoryState.topUpMultiplierTwo =  BigInt.fromI32(130)
        }
        if (event.params._type == 'Fifty more things to do in Zero Gravity') {
            categoryState.initialFuelAvailable = BigInt.fromI32(400)
            categoryState.topUpMultiplier = BigInt.fromI32(130)
            categoryState.topUpMinAmount = BigInt.fromI32(100)
            categoryState.topUpMultiplierTwo =  BigInt.fromI32(150)
        }
    }
    categoryState.name = event.params._type
    categoryState.platformDiscountPercent = event.params._platformFeeDiscount_ > BigInt.fromI32(0) ? 
                                                    BigInt.fromI32(100).div(event.params._platformFeeDiscount_).toBigDecimal() : BigInt.fromI32(0).toBigDecimal() 
    categoryState.reserveFeeDiscountPercent = event.params._sighPayDiscount_ > BigInt.fromI32(0) ? 
                                                    BigInt.fromI32(100).div(event.params._sighPayDiscount_).toBigDecimal() : BigInt.fromI32(0).toBigDecimal() 
    categoryState.maxBoostersAllowed = event.params._maxBoosters 
    log.info('handleNewCategoryAdded',[categoryState.name])

    // SIGH Boosters
    let _SIGHBoostersId = event.address.toHexString()
    let SIGHBoostersState = SIGHBoosters.load(_SIGHBoostersId)
    if (!SIGHBoostersState) {
        SIGHBoostersState = createSIGHBoosters(_SIGHBoostersId)
    }
    categoryState._SIGHBoosters = _SIGHBoostersId
    log.info('handleNewCategoryAdded',[SIGHBoostersState.id])

    // Tx Hash
    let txHash = categoryState.creationTxHash
    txHash.push( event.transaction.hash )
    categoryState.creationTxHash = txHash

    categoryState.save()
}

// Discount Multiplier Updated : TESTED
export function handleDiscountMultiplierUpdated(event: discountMultiplierUpdated): void {
    let categoryId = event.params._type
    let categoryState = BoosterCategory.load(categoryId)
    categoryState.platformDiscountPercent = event.params._platformFeeDiscount_ > BigInt.fromI32(0) ? 
                                                    BigInt.fromI32(100).div(event.params._platformFeeDiscount_).toBigDecimal() : BigInt.fromI32(0).toBigDecimal() 
    categoryState.reserveFeeDiscountPercent = event.params._sighPayDiscount_ > BigInt.fromI32(0) ? 
                                                    BigInt.fromI32(100).div(event.params._sighPayDiscount_).toBigDecimal() : BigInt.fromI32(0).toBigDecimal() 
     // Save Tx Hash
     let txHash = categoryState.DiscountUpdateTxHashes
     txHash.push( event.transaction.hash )
     categoryState.DiscountUpdateTxHashes = txHash    
 
    categoryState.save()
}


// Booster Transferred (first event to be emitted when new booster is minted) : TESTED
export function handleTransfer(event: Transfer): void {
    let _boosterId = event.params.tokenId.toHexString()
    let boosterState = Booster.load(_boosterId)
    if (!boosterState) {
        boosterState = createNewBooster(_boosterId)
        boosterState.boosterID = event.params.tokenId
    }

    // NEW OWNER
    let _userId = event.params.to.toHexString()
    let newUser = User.load(_userId)
    if (!newUser) {
        newUser = createUser(_userId)
        newUser.address = event.params.to
    }

    boosterState.owner = newUser.id
    boosterState.ownerAddress = event.params.to

    boosterState.save()
    newUser.save()
}


// Mints a new Booster: TESTED
export function handleBoosterMinted(event: BoosterMinted): void {
    let _boosterId = event.params.newItemId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.booster_URI = event.params.boosterURI

    // Category
    let categoryId = event.params._type
    let categoryState = BoosterCategory.load(categoryId)
    categoryState.totalBoosters = categoryState.totalBoosters.plus(BigInt.fromI32(1))
    boosterState.category = categoryState.id

    // SIGH Boosters
    let _SIGHBoostersId = event.address.toHexString()
    let SIGHBoostersState = SIGHBoosters.load(_SIGHBoostersId)
    SIGHBoostersState.totalBoosters = SIGHBoostersState.totalBoosters.plus(BigInt.fromI32(1))
    boosterState._SIGHBoosters = _SIGHBoostersId
    
    // Creation Tx Hash
    let txHash = boosterState.creationTxHash
    txHash.push( event.transaction.hash )
    boosterState.creationTxHash = txHash    

    SIGHBoostersState.save()
    categoryState.save()
    boosterState.save()
}


// Booster URI Updated : TESTED
export function handleBoosterURIUpdated(event: boosterURIUpdated): void {
    let _boosterId = event.params.boosterId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.booster_URI = event.params._boosterURI
    boosterState.save()
}




// Booster Whitelisted : TESTED
export function handleBoosterWhiteListed(event: BoosterWhiteListed): void {
    let _boosterId = event.params.boosterId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.isBlacklisted = false

    // Tx Hash
    let txHash_ = boosterState.blaclistedTxHashes
    txHash_.push( event.transaction.hash )
    boosterState.blaclistedTxHashes = txHash_    

    boosterState.save()
}

// Booster Whitelisted : TESTED
export function handleBoosterBlackListed(event: BoosterBlackListed): void {
    let _boosterId = event.params.boosterId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.isBlacklisted = true

    // Tx Hash
    let txHash_ = boosterState.blaclistedTxHashes
    txHash_.push( event.transaction.hash )
    boosterState.blaclistedTxHashes = txHash_    

    boosterState.save()
}



// Approval Handler: TESTED
export function handleApproval(event: Approval): void {
    let _boosterId = event.params.tokenId.toHexString()
    let boosterState = Booster.load(_boosterId)
    boosterState.approvedAddress = event.params.approved
    boosterState.save()
}


// ApprovalForAll Handler
export function handleApprovalForAll(event: ApprovalForAll): void {
}





