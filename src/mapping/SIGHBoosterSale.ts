import { Address, BigInt,BigDecimal, log } from "@graphprotocol/graph-ts"
import { BoosterAddedForSale, SalePriceUpdated,PaymentTokenUpdated,FundsTransferred,SaleTimeUpdated,BoosterSold
,BoostersBought,BoosterAdded,TokensTransferred } from "../../generated/SIGHBoosters/SIGHBoosters"
import { BoosterSaleInfo,PaymentMode, SaleCategories, User } from "../../generated/schema"
import {createBoostersSaleInfo,createPaymentMode,createBoosterCategory,createUser} from "../helpers"
import { ERC20 } from '../../generated/SIGHBoosters/ERC20'


// SALE INITIATION TIMESTAMP IS UPDATED
export function handleSaleTimeUpdated(event: SaleTimeUpdated) : void {
    let _BoostersSalesId = new BigInt(1).toHexString()
    let BoostersSalesState = BoosterSaleInfo.load(_BoostersSalesId)
    if (!BoostersSalesState) {
        BoostersSalesState = createBoostersSaleInfo(_BoostersSalesId)
        BoostersSalesState.BoostersSaleContractAddress = event.origin
    }
    BoostersSalesState.activeTimestamp = event.params.initiateTimestamp
    BoostersSalesState.save()
}


//PAYMENT TOKEN BEING ACCEPTED IS UPDATED
export function handlePaymentTokenUpdated(event: PaymentTokenUpdated) : void {
    let _BoostersSalesId = new BigInt(1).toHexString()
    let BoostersSalesState = BoosterSaleInfo.load(_BoostersSalesId)
    if (!BoostersSalesState) {
        BoostersSalesState = createBoostersSaleInfo(_BoostersSalesId)
        BoostersSalesState.BoostersSaleContractAddress = event.origin
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
        PaymentModeState.decimals =  _tokenContract.decimals()
        }
        PaymentModeState.isActive = true
        PaymentModeState.saleSession = BoostersSalesState

        PaymentModeState.save()

        BoostersSalesState.tokenAcceptedForSale = PaymentModeState
        BoostersSalesState.save()
}

//TOKENS BEING TRANSFERRED
export function handleTokensTransferred(event: TokensTransferred) : void {
    let _BoostersSalesId = new BigInt(1).toHexString()
    let BoostersSalesState = BoosterSaleInfo.load(_BoostersSalesId)

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
        PaymentModeState.decimals =  _tokenContract.decimals()
        PaymentModeState.saleSession = BoostersSalesState
        }

    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals as u8).toBigDecimal()
    let amount = event.params.amount.toBigDecimal().div( decimalAdj )
    PaymentModeState.amountTransferred = PaymentModeState.amountTransferred.add(amount)

    let _tokenContract = ERC20.bind(event.params.token as Address)
    PaymentModeState.amountAvailable = _tokenContract.balanceOf(BoostersSalesState.BoostersSaleContractAddress as Address)

    // Tx Hash
    let txHashes = PaymentModeState.transferTxs
    txHashes.push( event.transaction.hash.toHexString() )
    PaymentModeState.transferTxs = txHashes

    PaymentModeState.save()
}


//PART OF THE PAYMENT TOKEN BEING ACCEPTED HAS BEEN TRANSFERRED
export function handleFundsTransferred(event: FundsTransferred) : void {
    let _BoostersSalesId = new BigInt(1).toHexString()
    let BoostersSalesState = BoosterSaleInfo.load(_BoostersSalesId)

    let PaymentModeState = BoostersSalesState.tokenAcceptedForSale
    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals as u8).toBigDecimal()
    let amount = event.params.amount.toBigDecimal().div( decimalAdj )
    PaymentModeState.amountTransferred = PaymentModeState.amountTransferred.add(amount)

    let _tokenContract = ERC20.bind(event.params.token as Address)
    PaymentModeState.amountAvailable = _tokenContract.balanceOf(BoostersSalesState.BoostersSaleContractAddress as Address)

    // Tx Hash
    let txHashes = PaymentModeState.transferTxs
    txHashes.push( event.transaction.hash.toHexString() )
    PaymentModeState.transferTxs = txHashes

    PaymentModeState.save()
}

// SALE PRICE FOR A PARTICULAR CATEGORY UPDATED
export function handleSalePriceUpdated(event: SalePriceUpdated) : void {
    let _BoostersSalesId = new BigInt(1).toHexString()
    let BoostersSalesState = BoosterSaleInfo.load(_BoostersSalesId)

    let PaymentModeState = BoostersSalesState.tokenAcceptedForSale
    let decimalAdj = BigInt.fromI32(10).pow(PaymentModeState.decimals as u8).toBigDecimal()
    let price = event.params._price.toBigDecimal().div( decimalAdj )


    let _saleCategoryID = event.params._type.toHexString()
    let _SaleCategory = SaleCategories.load(_saleCategoryID)
    _SaleCategory.salePrice = price
    _SaleCategory.save()
}


export function handleBoosterAdded(event: BoosterAdded) : void {
    
}


export function handleBoosterAddedForSale(event: BoosterAddedForSale) : void {

}




export function handleBoosterSold(event: BoosterSold) : void {
    
}

export function handleBoostersBought(event: BoostersBought) : void {
    
}

