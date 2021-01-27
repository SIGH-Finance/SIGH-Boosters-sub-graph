import { Address, BigInt,BigDecimal, log } from "@graphprotocol/graph-ts"
import { BoosterAddedForSale, SalePriceUpdated,PaymentTokenUpdated,FundsTransferred,SaleTimeUpdated,BoosterSold
,BoostersBought,BoosterAdded } from "../../generated/SIGHBoosters/SIGHBoosters"
import { BoosterSaleInfo,Booster, BoosterCategory, User } from "../../generated/schema"
import {createBoostersSaleInfo,createPaymentMode,createBoosterCategory,createUser} from "../helpers"


export function handleSaleTimeUpdated(event: SaleTimeUpdated) : void {
    let _BoostersSalesId = new BigInt(1).toHexString()
    let BoostersSalesState = BoosterSaleInfo.load(_BoostersSalesId)
    if (!BoostersSalesState) {
        BoostersSalesState = createBoostersSaleInfo(_BoostersSalesId)
    }
    BoostersSalesState.activeTimestamp = event.params.initiateTimestamp
    BoostersSalesState.save()
}

export function handlePaymentTokenUpdated(event: PaymentTokenUpdated) : void {
    let _BoostersSalesId = new BigInt(1).toHexString()
    let BoostersSalesState = BoosterSaleInfo.load(_BoostersSalesId)
    if (!BoostersSalesState) {
        BoostersSalesState = createBoostersSaleInfo(_BoostersSalesId)
    }

    let _PaymentModeId = new BigInt(1).toHexString()
    let PaymentModeState = BoosterSaleInfo.load(_PaymentModeId)
    if (!PaymentModeState) {
        PaymentModeState = createPaymentMode(_PaymentModeId)
    }

    
}


export function handleBoosterAddedForSale(event: BoosterAddedForSale) : void {

}

export function handleSalePriceUpdated(event: SalePriceUpdated) : void {
    
}



export function handleBoosterSold(event: BoosterSold) : void {
    
}

export function handleBoostersBought(event: BoostersBought) : void {
    
}

export function handleBoosterAdded(event: BoosterAdded) : void {
    
}