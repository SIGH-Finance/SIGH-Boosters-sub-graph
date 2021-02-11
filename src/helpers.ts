import {Address, BigDecimal, Bytes, BigInt, log } from '@graphprotocol/graph-ts/index'
import { log } from '@graphprotocol/graph-ts'
import { SIGHBoosters, Booster, BoosterCategory, User,
    BoostersSaleInfo,PaymentMode, SaleCategories, boosterSaleEntity, BoosterPurchasers } from '../generated/schema'

//  ##################################
//  ENTITIES FOR THE BOOSTERS CONTRACT
//  ##################################


//Keeps track of all the boosters and Categories
export function createSIGHBoosters(ID: string): SIGHBoosters {
    let _SIGHBoosters = new SIGHBoosters(ID)
    _SIGHBoosters.name = ''
    _SIGHBoosters.symbol = ''
    _SIGHBoosters.adminAddress =Address.fromString('0x0000000000000000000000000000000000000000') 
    _SIGHBoosters.baseURI = ''
    _SIGHBoosters.totalBoosters = new BigInt(0)
    _SIGHBoosters.save()
    return _SIGHBoosters
}

// Creates a Booster Category entity
export function createBoosterCategory(ID: string): BoosterCategory {
    let _BoosterCategory = new BoosterCategory(ID)
    _BoosterCategory.name = ''
    _BoosterCategory.platformDiscountPercent = BigDecimal.fromString('0')
    _BoosterCategory.reserveFeeDiscountPercent = BigDecimal.fromString('0')
    
    _BoosterCategory.initialFuelAvailable = BigInt.fromI32(0)
    _BoosterCategory.topUpMultiplier = BigInt.fromI32(0)
    _BoosterCategory.topUpMinAmount = BigInt.fromI32(0)
    _BoosterCategory.topUpMultiplierTwo =  BigInt.fromI32(0)

    _BoosterCategory.maxBoostersAllowed = new BigInt(0)
    _BoosterCategory.totalBoosters = new BigInt(0)
    _BoosterCategory.creationTxHash = []
    _BoosterCategory.DiscountUpdateTxHashes = []
    _BoosterCategory._SIGHBoosters = '0x0000000000000000000000000000000000000000'
    _BoosterCategory.save()
    return _BoosterCategory
}

// Creates an Individual Booster entity
export function createNewBooster(ID: string): Booster {
    let _Booster = new Booster(ID)
    _Booster.boosterID = new BigInt(0)
    _Booster.ownerAddress = Address.fromString('0x0000000000000000000000000000000000000000') 
    _Booster.approvedAddress = Address.fromString('0x0000000000000000000000000000000000000000') 
    _Booster.booster_URI = ''
    _Booster.fuelAvailable = BigDecimal.fromString('0')
    _Booster.fuelUsed = BigDecimal.fromString('0')
    _Booster.isBlacklisted = false
    _Booster.creationTxHash = []
    _Booster.blaclistedTxHashes = []
    _Booster.category = '_'
    _Booster._SIGHBoosters = '0x0000000000000000000000000000000000000000'
    _Booster.owner = '0x0000000000000000000000000000000000000000'
    _Booster.save()
    return _Booster
}



// Creates a User entity
export function createUser(ID: string): User {
    let _User = new User(ID)
    _User.SIGH_Rewards = BigDecimal.fromString('0')
    _User.address = Address.fromString('0x0000000000000000000000000000000000000000') 
    _User.save()
    return _User
}
  
//  #######################################
//  ENTITIES FOR THE BOOSTER SALES CONTRACT
//  #######################################

// Keeps Track of the Boosters Sales
export function createBoostersSaleInfo(ID: string): BoostersSaleInfo {
    let _BoostersSaleInfo = new BoostersSaleInfo(ID)
    _BoostersSaleInfo.BoostersSaleContractAddress = Address.fromString('0x0000000000000000000000000000000000000000')
    _BoostersSaleInfo.BoostersContractAddress  = Address.fromString('0x0000000000000000000000000000000000000000')
    _BoostersSaleInfo.activeTimestamp = new BigInt(0)
    _BoostersSaleInfo.tokenAcceptedForSale = '0x0000000000000000000000000000000000000000'
    _BoostersSaleInfo.adminAddress = Address.fromString('0x0000000000000000000000000000000000000000') 
    _BoostersSaleInfo.save()
    return _BoostersSaleInfo
}

// An 1:1 entity for the Booster Category  
export function createSaleCategory(ID: string): SaleCategories {
    let _SaleCategory = new SaleCategories(ID)
    _SaleCategory.name = ''
    _SaleCategory.maxBoostersAllowed = new BigInt(0) 
    _SaleCategory.totalBoosters = new BigInt(0) 
    _SaleCategory.totalBoostersAvailable = new BigInt(0) 
    _SaleCategory.totalBoostersSold = new BigInt(0)
    _SaleCategory.initialFuelAvailable = BigInt.fromI32(0)
    _SaleCategory.topUpMultiplier = BigInt.fromI32(0)
    _SaleCategory.topUpMinAmount = BigInt.fromI32(0)
    _SaleCategory.topUpMultiplierTwo =  BigInt.fromI32(0)
    _SaleCategory.boostersSoldIDsList = []  
    _SaleCategory.salePrice = BigDecimal.fromString('0')
    _SaleCategory.initialFuelAvailable = BigInt.fromI32(0)
    _SaleCategory.platformDiscountPercent = BigDecimal.fromString('0')
    _SaleCategory.reserveFeeDiscountPercent = BigDecimal.fromString('0')
    _SaleCategory.saleSession = '0x0000000000000000000000000000000000000000'
    _SaleCategory.save()
    return _SaleCategory
}

// An 1:1 entity for the Booster sold via Booster Sales Contract 
export function createboosterSaleEntity(ID: string): boosterSaleEntity {
    let _boosterSaleEntity = new boosterSaleEntity(ID)
    _boosterSaleEntity.boosterId = new BigInt(0)
    _boosterSaleEntity.addedBy = Address.fromString('0x0000000000000000000000000000000000000000') 
    _boosterSaleEntity.saleTx = Address.fromString('0x0000000000000000000000000000000000000000') 
    _boosterSaleEntity.booster = ('0x0000000000000000000000000000000000000000')
    _boosterSaleEntity.saleCategory = ('0x0000000000000000000000000000000000000000')
    _boosterSaleEntity.save()
    return _boosterSaleEntity
}

// A Payment mode entity, represents token Balances
export function createPaymentMode(ID: string): PaymentMode {
    let _PaymentMode = new PaymentMode(ID)
    _PaymentMode.address = Address.fromString('0x0000000000000000000000000000000000000000') 
    _PaymentMode.symbol = ''
    _PaymentMode.totalAmountCollected = BigDecimal.fromString('0')
    _PaymentMode.amountAvailable = BigDecimal.fromString('0')
    _PaymentMode.amountTransferred = BigDecimal.fromString('0')
    _PaymentMode.decimals = new BigInt(0)
    _PaymentMode.isActive = false
    _PaymentMode.transferTxs = []
    _PaymentMode.saleSession = '0x0000000000000000000000000000000000000000'
    _PaymentMode.save()
    return _PaymentMode
}





// An 1:1 entity for the Booster Category  
export function createBoosterPurchaser(ID: string): BoosterPurchasers {
    let _BoosterPurchaser = new BoosterPurchasers(ID)
    log.info('1 ---> createBoosterPurchaser, {}',[ID])
    _BoosterPurchaser.address = Address.fromString('0x0000000000000000000000000000000000000000') 
    _BoosterPurchaser.SIGH_Rewards = BigDecimal.fromString('0')
    log.info('2 ---> createBoosterPurchaser, {}',[ID])
    _BoosterPurchaser.purchaseTxs = [] 
    _BoosterPurchaser.listOfBoostersBought = []
    _BoosterPurchaser.saleSession = '0x0000000000000000000000000000000000000000'
    log.info('3 ---> createBoosterPurchaser, {}',[ID])
    _BoosterPurchaser.save()
    return _BoosterPurchaser
}
