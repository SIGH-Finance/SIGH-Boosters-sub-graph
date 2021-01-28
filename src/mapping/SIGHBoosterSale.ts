import { Address, BigInt,BigDecimal, log } from "@graphprotocol/graph-ts"
import { BoosterAddedForSale, SalePriceUpdated,PaymentTokenUpdated,FundsTransferred,SaleTimeUpdated,BoosterSold
,BoostersBought,BoosterAdded,TokensTransferred, OwnershipTransferred } from "../../generated/SIGHBoosterSale/SIGHBoosterSale"
import { BoostersSaleInfo,PaymentMode, SaleCategories, boosterSaleEntity, BoosterPurchasers,Booster } from "../../generated/schema"
import {createBoostersSaleInfo,createPaymentMode,createboosterSaleEntity,createSaleCategory, createBoosterPurchaser} from "../helpers"
import { ERC20 } from '../../generated/SIGHBoosterSale/ERC20'


// SALE INITIATION TIMESTAMP IS UPDATED
export function handleSaleTimeUpdated(event: SaleTimeUpdated) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)
    BoostersSalesState.activeTimestamp = event.params.initiateTimestamp
    BoostersSalesState.save()
}


//PAYMENT TOKEN BEING ACCEPTED IS UPDATED
export function handlePaymentTokenUpdated(event: PaymentTokenUpdated) : void {
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
        }
        PaymentModeState.isActive = true
        PaymentModeState.saleSession = BoostersSalesState.id

        PaymentModeState.save()

        BoostersSalesState.tokenAcceptedForSale = PaymentModeState.id
        BoostersSalesState.save()
}

//TOKENS BEING TRANSFERRED
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
    PaymentModeState.amountAvailable = _tokenContract.balanceOf(BoostersSalesState.BoostersSaleContractAddress as Address).toBigDecimal()

    // Tx Hash
    let txHashes = PaymentModeState.transferTxs
    txHashes.push( event.transaction.hash )
    PaymentModeState.transferTxs = txHashes

    PaymentModeState.save()
}


//PART OF THE PAYMENT TOKEN BEING ACCEPTED HAS BEEN TRANSFERRED
export function handleFundsTransferred(event: FundsTransferred) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)

    let PaymentModeStateId = BoostersSalesState.tokenAcceptedForSale
    let PaymentModeState = PaymentMode.load(PaymentModeStateId)
    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals.toI32() as u8).toBigDecimal()
    let amount = event.params.amount.toBigDecimal().div( decimalAdj )
    PaymentModeState.amountTransferred = PaymentModeState.amountTransferred.plus(amount)

    let _tokenContract = ERC20.bind(PaymentModeState.address as Address)
    PaymentModeState.amountAvailable = _tokenContract.balanceOf(BoostersSalesState.BoostersSaleContractAddress as Address).toBigDecimal()

    // Tx Hash
    let txHashes = PaymentModeState.transferTxs
    txHashes.push( event.transaction.hash )
    PaymentModeState.transferTxs = txHashes

    PaymentModeState.save()
}

// SALE PRICE FOR A PARTICULAR CATEGORY UPDATED
export function handleSalePriceUpdated(event: SalePriceUpdated) : void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)

    let PaymentModeStateId = BoostersSalesState.tokenAcceptedForSale
    let PaymentModeState = PaymentMode.load(PaymentModeStateId)
    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals.toI32() as u8).toBigDecimal()
    let price = event.params._price.toBigDecimal().div( decimalAdj )


    let _saleCategoryID = event.params._type
    let _SaleCategory = SaleCategories.load(_saleCategoryID)
    if (!_SaleCategory) {
        _SaleCategory = createSaleCategory(_saleCategoryID)
        _SaleCategory.name = event.params._type
        let BoostersSalesState = BoostersSaleInfo.load(event.address.toHexString())
        _SaleCategory.saleSession = BoostersSalesState.id
    }
    _SaleCategory.salePrice = price
    _SaleCategory.save()
}

// Booster Added for Sale, BoosterAdded & BoosterAddedForSale are emitted together
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
    let _SaleCategoryID = event.params._type
    let _SaleCategory = SaleCategories.load(_SaleCategoryID)
    if (!_SaleCategory) {
        _SaleCategory = createSaleCategory(_SaleCategoryID)
        _SaleCategory.name = event.params._type
        let BoostersSalesState = BoostersSaleInfo.load(event.address.toHexString())
        _SaleCategory.saleSession = BoostersSalesState.id
    }
    _SaleCategory.totalBoostersAvailable = _SaleCategory.totalBoostersAvailable.plus(BigInt.fromI32(1))

    
    _boosterSaleEntity.saleCategory = _SaleCategory.id
    _boosterSaleEntity.save()
    _SaleCategory.save()
}


// Booster Added for Sale, BoosterAdded & BoosterAddedForSale are emitted together
export function handleBoosterAdded(event: BoosterAdded) : void {
    let _BoostersSalesId = event.params.tokenId.toHexString()
    let _boosterSaleEntity = boosterSaleEntity.load(_BoostersSalesId)
    _boosterSaleEntity.addedBy = event.params.from
    _boosterSaleEntity.save()
}


export function handleBoosterSold(event: BoosterSold) : void {
    let _BoostersSalesId = event.params._boosterId.toHexString()
    let _boosterSaleEntity = boosterSaleEntity.load(_BoostersSalesId)
    _boosterSaleEntity.saleTx = event.transaction.hash
    _boosterSaleEntity.saleCategory = '0x0000000000000000000000000000000000000000'

    log.info('----> handleBoosterSold : {}',[_BoostersSalesId])
    // Update Category of the Booster Entity    
    let _SaleCategoryID = event.params._BoosterType
    let _SaleCategory = SaleCategories.load(_SaleCategoryID)
    _SaleCategory.totalBoostersSold = _SaleCategory.totalBoostersSold.plus(BigInt.fromI32(1))
    _SaleCategory.totalBoostersAvailable = _SaleCategory.totalBoostersAvailable.minus(BigInt.fromI32(1))

    log.info('----> handleBoosterSold : {}',[_BoostersSalesId])
    let listOfIds = _SaleCategory.boostersSoldIDsList
    listOfIds.push(event.params._boosterId)
    _SaleCategory.boostersSoldIDsList = listOfIds

    // Payment Mode Balance 
    log.info('----> handleBoosterSold : {}',[_BoostersSalesId])
    let _BoostersSalesInfoId = event.address.toHexString()
    let BoostersSalesInfoState = BoostersSaleInfo.load(_BoostersSalesInfoId)
    let PaymentModeStateId = BoostersSalesInfoState.tokenAcceptedForSale
    let paymentMode = PaymentMode.load(PaymentModeStateId)
    let decimalAdj = BigInt.fromI32(10).pow(paymentMode.decimals.toI32() as u8).toBigDecimal()
    let amount = event.params.salePrice.toBigDecimal().div(decimalAdj)
    paymentMode.totalAmountCollected = paymentMode.totalAmountCollected.plus(amount)

    log.info('----> handleBoosterSold : {}',[_BoostersSalesId])
    let _tokenContract = ERC20.bind(paymentMode.address as Address)
    paymentMode.amountAvailable = _tokenContract.balanceOf(BoostersSalesInfoState.BoostersSaleContractAddress as Address).toBigDecimal()

    log.info('----> handleBoosterSold : {}',[_BoostersSalesId])
    _boosterSaleEntity.save()
    _SaleCategory.save()
    paymentMode.save()
}

export function handleBoostersBought(event: BoostersBought) : void {
    let BoosterPurchasersId = event.params.caller.toHexString()
    let BoosterPurchasers_ = BoosterPurchasers.load(BoosterPurchasersId)
    if (!BoosterPurchasersId) {
        BoosterPurchasers_ = createBoosterPurchaser(BoosterPurchasersId)
        BoosterPurchasers_.address = event.params.caller
    }

    let _BoostersSalesInfoId = event.address.toHexString()
    let BoostersSalesInfoState = BoostersSaleInfo.load(_BoostersSalesInfoId)
    BoosterPurchasers_.saleSession = BoostersSalesInfoState.id

    let PaymentModeStateId = BoostersSalesInfoState.tokenAcceptedForSale
    let paymentMode = PaymentMode.load(PaymentModeStateId)

    let decimalAdj = BigInt.fromI32(10).pow(paymentMode.decimals.toI32() as u8).toBigDecimal()
    if (event.params._BoosterType == 'MARVIN') {
        let rewardRatio = BigInt.fromI32(12).toBigDecimal()
        let amount = event.params.amountToBePaid.toBigDecimal().div(decimalAdj).times(rewardRatio).div(BigInt.fromI32(10).toBigDecimal())
        BoosterPurchasers_.SIGH_Rewards = BoosterPurchasers_.SIGH_Rewards.plus(amount)
    }
    if (event.params._BoosterType == 'JARVIS') {
        let rewardRatio = BigInt.fromI32(12).toBigDecimal()
        let amount = event.params.amountToBePaid.toBigDecimal().div(decimalAdj).times(rewardRatio).div(BigInt.fromI32(10).toBigDecimal())
        BoosterPurchasers_.SIGH_Rewards = BoosterPurchasers_.SIGH_Rewards.plus(amount)
    }


    let listOfTxs = BoosterPurchasers_.purchaseTxs
    listOfTxs.push(event.transaction.hash)
    BoosterPurchasers_.purchaseTxs = listOfTxs


    BoosterPurchasers_.save()
}

// TransferOwnership Handler
export function handleTransferOwnership(event: OwnershipTransferred): void {
    let _BoostersSalesId = event.address.toHexString()
    let BoostersSalesState = BoostersSaleInfo.load(_BoostersSalesId)
    if (!BoostersSalesState) {
        BoostersSalesState = createBoostersSaleInfo(_BoostersSalesId)
        BoostersSalesState.BoostersSaleContractAddress = event.address
    }
    BoostersSalesState.adminAddress = event.params.newOwner
    log.info("SIGH BOOSTER SALES CONTRACT - handleTransferOwnership",[])
    BoostersSalesState.save()
}