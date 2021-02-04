import { Address, BigInt,BigDecimal, log } from "@graphprotocol/graph-ts"
import { BoosterAddedForSale, SalePriceUpdated,PaymentTokenUpdated,FundsTransferred,SaleTimeUpdated,BoosterSold
,BoostersBought,BoosterAdded,TokensTransferred, OwnershipTransferred } from "../../generated/SIGHBoosterSale/SIGHBoosterSale"
import { BoosterCategory, BoostersSaleInfo,PaymentMode, SaleCategories, boosterSaleEntity, BoosterPurchasers,Booster } from "../../generated/schema"
import {createBoostersSaleInfo,createPaymentMode,createboosterSaleEntity,createSaleCategory, createBoosterPurchaser} from "../helpers"
import { ERC20 } from '../../generated/SIGHBoosterSale/ERC20'

// TransferOwnership Handler (emitted during deployment) : TESTED
export function handleTransferOwnership(event: OwnershipTransferred): void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)
    if (!BoostersSalesState) {
        BoostersSalesState = createBoostersSaleInfo(_BoostersSalesId)
        BoostersSalesState.BoostersSaleContractAddress = event.address
        BoostersSalesState.BoostersContractAddress = Address.fromString('0xe00c407e1ad26aef6d4ae77f930ab63ca260b537')
    }
    BoostersSalesState.adminAddress = event.params.newOwner
    BoostersSalesState.save()
}

// SALE INITIATION TIMESTAMP IS UPDATED : TESTED
export function handleSaleTimeUpdated(event: SaleTimeUpdated) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)
    BoostersSalesState.activeTimestamp = event.params.initiateTimestamp
    BoostersSalesState.save()
}


//PAYMENT TOKEN BEING ACCEPTED IS UPDATED : TESTED
export function handlePaymentTokenUpdated(event: PaymentTokenUpdated) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)

    let prevAcceptedTokenId = BoostersSalesState.tokenAcceptedForSale
    if ( prevAcceptedTokenId != '0x0000000000000000000000000000000000000000') {
        let prevAcceptedToken =  PaymentMode.load(prevAcceptedTokenId)
        prevAcceptedToken.isActive = false
        prevAcceptedToken.save()
    }

    let _PaymentModeId = event.params.token.toHexString()
    let PaymentModeState = PaymentMode.load(_PaymentModeId)
    if (!PaymentModeState) {
        PaymentModeState = createPaymentMode(_PaymentModeId)
        PaymentModeState.address = event.params.token
        PaymentModeState.totalAmountCollected = BigDecimal.fromString('0')
        PaymentModeState.amountAvailable = BigDecimal.fromString('0')
        PaymentModeState.amountTransferred = BigDecimal.fromString('0')
        let _tokenContract = ERC20.bind(event.params.token as Address)
        PaymentModeState.symbol =  _tokenContract.symbol()
        PaymentModeState.decimals =  BigInt.fromI32(_tokenContract.decimals())
        }

        PaymentModeState.isActive = true
        PaymentModeState.saleSession = BoostersSalesState.id
        PaymentModeState.save()

        BoostersSalesState.tokenAcceptedForSale = PaymentModeState.id
        BoostersSalesState.save()
}

//TOKENS BEING TRANSFERRED : TESTED
export function handleTokensTransferred(event: TokensTransferred) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)

    let _PaymentModeId = event.params.token.toHexString()
    let PaymentModeState = PaymentMode.load(_PaymentModeId)
    if (!PaymentModeState) {
        PaymentModeState = createPaymentMode(_PaymentModeId)
        PaymentModeState.address = event.params.token
        PaymentModeState.totalAmountCollected = BigDecimal.fromString('0')
        PaymentModeState.amountAvailable = BigDecimal.fromString('0')
        PaymentModeState.amountTransferred = BigDecimal.fromString('0')
        let _tokenContract = ERC20.bind(event.params.token as Address)
        PaymentModeState.symbol =  _tokenContract.symbol()
        PaymentModeState.decimals =  BigInt.fromI32(_tokenContract.decimals())
        PaymentModeState.saleSession = BoostersSalesState.id
        }

    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals.toI32() as u8).toBigDecimal()
    let amount = event.params.amount.toBigDecimal().div( decimalAdj )
    PaymentModeState.amountTransferred = PaymentModeState.amountTransferred.plus(amount)

    let _tokenContract = ERC20.bind(event.params.token as Address)
    let availAmount = _tokenContract.balanceOf(BoostersSalesState.BoostersSaleContractAddress as Address).toBigDecimal()
    PaymentModeState.amountAvailable = availAmount.div( decimalAdj )

    // Tx Hash
    let txHashes = PaymentModeState.transferTxs
    txHashes.push( event.transaction.hash )
    PaymentModeState.transferTxs = txHashes

    PaymentModeState.save()
}

//PART OF THE PAYMENT TOKEN BEING ACCEPTED HAS BEEN TRANSFERRED: TESTED
export function handleFundsTransferred(event: FundsTransferred) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)

    let PaymentModeStateId = BoostersSalesState.tokenAcceptedForSale
    let PaymentModeState = PaymentMode.load(PaymentModeStateId)
    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals.toI32() as u8).toBigDecimal()
    let amount = event.params.amount.toBigDecimal().div( decimalAdj )
    PaymentModeState.amountTransferred = PaymentModeState.amountTransferred.plus(amount)

    let _tokenContract = ERC20.bind(PaymentModeState.address as Address)
    let availAmount = _tokenContract.balanceOf(BoostersSalesState.BoostersSaleContractAddress as Address).toBigDecimal()
     PaymentModeState.amountAvailable = availAmount.div( decimalAdj )

    // Tx Hash
    let txHashes = PaymentModeState.transferTxs
    txHashes.push( event.transaction.hash )
    PaymentModeState.transferTxs = txHashes

    PaymentModeState.save()
}


// Booster Added for Sale, BoosterAdded & BoosterAddedForSale are emitted together : TESTED
export function handleBoosterAddedForSale(event: BoosterAddedForSale) : void {
    // Booster Entity which is added

    let _BoostersSalesId = event.params.boosterid.toHexString()
    let _boosterSaleEntity = boosterSaleEntity.load(_BoostersSalesId)
    if (!_boosterSaleEntity) {
        _boosterSaleEntity = createboosterSaleEntity(_BoostersSalesId)
        _boosterSaleEntity.boosterId = event.params.boosterid
        let booster = Booster.load(_BoostersSalesId)
        _boosterSaleEntity.booster = booster.id
    }

    // Category of the Booster Entity which is added
    let BoostersSalesState = BoostersSaleInfo.load(event.address.toHexString())
    let _SaleCategoryID = event.params._type
    let _SaleCategory = SaleCategories.load(_SaleCategoryID)
    if (!_SaleCategory) {
        _SaleCategory = createSaleCategory(_SaleCategoryID)
        _SaleCategory.name = event.params._type
        _SaleCategory.saleSession = BoostersSalesState.id
        let categoryState_ = BoosterCategory.load(_SaleCategoryID)
        _SaleCategory.totalBoosters = categoryState_.totalBoosters
        _SaleCategory.initialFuelAvailable = categoryState_.initialFuelAvailable
        _SaleCategory.topUpMultiplier = categoryState_.topUpMultiplier
        _SaleCategory.topUpMinAmount = categoryState_.topUpMinAmount
        _SaleCategory.topUpMultiplierTwo = categoryState_.topUpMultiplierTwo
        _SaleCategory.platformDiscountPercent = categoryState_.platformDiscountPercent
        _SaleCategory.reserveFeeDiscountPercent = categoryState_.reserveFeeDiscountPercent
    }

    _SaleCategory.totalBoostersAvailable = _SaleCategory.totalBoostersAvailable.plus(BigInt.fromI32(1))
    _boosterSaleEntity.saleCategory = _SaleCategory.id


    _boosterSaleEntity.save()
    _SaleCategory.save()
}


// Booster Added for Sale, BoosterAdded & BoosterAddedForSale are emitted together : TESTED
export function handleBoosterAdded(event: BoosterAdded) : void {
    let _BoostersSalesId = event.params.tokenId.toHexString()
    let _boosterSaleEntity = boosterSaleEntity.load(_BoostersSalesId)
    _boosterSaleEntity.addedBy = event.params.operator
    _boosterSaleEntity.save()
}

// SALE PRICE FOR A PARTICULAR CATEGORY UPDATED: TESTED
export function handleSalePriceUpdated(event: SalePriceUpdated) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)
    let PaymentModeStateId = BoostersSalesState.tokenAcceptedForSale
    let PaymentModeState = PaymentMode.load(PaymentModeStateId)

    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals.toI32() as u8).toBigDecimal()
    let price = event.params._price.toBigDecimal().div( decimalAdj )

    let _saleCategoryID = event.params._type
    let _SaleCategory = SaleCategories.load(_saleCategoryID)
    _SaleCategory.salePrice = price
    _SaleCategory.save()
}




// EMITTED WHEN A BOOSTER IS SOLD: TESTED
export function handleBoosterSold(event: BoosterSold) : void {
    let purchaserID = event.params._to.toHexString()
    let purchaser = BoosterPurchasers.load(purchaserID)
    if (!purchaser) {
        purchaser = createBoosterPurchaser(purchaserID)
        purchaser.address = event.params._to
        let BoostersSalesState = BoostersSaleInfo.load(event.address.toHexString())
        purchaser.saleSession = BoostersSalesState.id
    }

    let txs = purchaser.purchaseTxs
    txs.push(event.transaction.hash)
    purchaser.purchaseTxs = txs

    let listOfBoosterIds = purchaser.listOfBoostersBought
    listOfBoosterIds.push(event.params._boosterId)
    purchaser.listOfBoostersBought = listOfBoosterIds

    let _BoostersSalesId = event.params._boosterId.toHexString()
    let _boosterSaleEntity = boosterSaleEntity.load(_BoostersSalesId)
    _boosterSaleEntity.saleTx = event.transaction.hash
    _boosterSaleEntity.saleCategory = '0x0000000000000000000000000000000000000000'

    let _SaleCategoryID = event.params._BoosterType
    let _SaleCategory = SaleCategories.load(_SaleCategoryID)
    _SaleCategory.totalBoostersSold = _SaleCategory.totalBoostersSold.plus(BigInt.fromI32(1))
    _SaleCategory.totalBoostersAvailable = _SaleCategory.totalBoostersAvailable.minus(BigInt.fromI32(1))

    let listOfIds = _SaleCategory.boostersSoldIDsList
    listOfIds.push(event.params._boosterId)
    _SaleCategory.boostersSoldIDsList = listOfIds



    // Payment Mode Balance 
    let _BoostersSalesInfoId = event.address.toHexString()
    let BoostersSalesInfoState = BoostersSaleInfo.load(_BoostersSalesInfoId)
    let PaymentModeStateId = BoostersSalesInfoState.tokenAcceptedForSale
    let paymentMode = PaymentMode.load(PaymentModeStateId)
    let decimalAdj = BigInt.fromI32(10).pow(paymentMode.decimals.toI32() as u8).toBigDecimal()
    let amount = event.params.salePrice.toBigDecimal().div(decimalAdj)
    paymentMode.totalAmountCollected = paymentMode.totalAmountCollected.plus(amount)

    let _tokenContract = ERC20.bind(paymentMode.address as Address)
    let availAmount = _tokenContract.balanceOf(BoostersSalesInfoState.BoostersSaleContractAddress as Address).toBigDecimal()
    paymentMode.amountAvailable = availAmount.div( decimalAdj )

    if (event.params._BoosterType == 'CYBERTRUCK ON MARS') {
        let reward = amount.times(BigInt.fromI32(110).toBigDecimal()).div(BigInt.fromI32(100).toBigDecimal())
        purchaser.SIGH_Rewards = purchaser.SIGH_Rewards.plus(reward)
    }
    if (event.params._BoosterType == 'Fifty more things to do in Zero Gravity') {
        let reward = amount.times(BigInt.fromI32(50).toBigDecimal()).div(BigInt.fromI32(100).toBigDecimal())
        purchaser.SIGH_Rewards = purchaser.SIGH_Rewards.plus(reward)
    }
    if (event.params._BoosterType == 'DEEP THOUGHT') {
        let reward = amount.times(BigInt.fromI32(0).toBigDecimal())
        purchaser.SIGH_Rewards = purchaser.SIGH_Rewards.plus(reward)
    }
    if (event.params._BoosterType == 'JARVIS') {
        let reward = amount.times(BigInt.fromI32(150).toBigDecimal()).div(BigInt.fromI32(100).toBigDecimal())
        purchaser.SIGH_Rewards = purchaser.SIGH_Rewards.plus(reward)
    }



    purchaser.save()
    _boosterSaleEntity.save()
    _SaleCategory.save()
    paymentMode.save()
}




// export function handleBoostersBought(event: BoostersBought) : void {
// }

